import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/yanolja/entities/order.entity";
import { DataSource, Repository } from "typeorm";
import { MyOrderBodyType, OrderQueryType } from "./order.controller";
import { Theater } from "src/yanolja/entities/theater.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Theater)
        private readonly theaterRepository: Repository<Theater>,
        @InjectDataSource()
        private readonly db: DataSource,
    ) {}

    public async getOrder(query: OrderQueryType) {
        try {
            const order = await this.orderRepository
                .createQueryBuilder("order")
                .where("order.orderNum = :orderNum")
                .setParameter("orderNum", query.orderNum)
                .getOneOrFail();

            return order;
        } catch (error) {
            throw new NotAcceptableException("잘못된 주문번호 입니다!");
        }
    }

    public async getMyOrder(body: MyOrderBodyType) {
        const returnMyOrder = await this.theaterRepository
            .createQueryBuilder("theater")
            .leftJoinAndSelect("theater.orders", "orders")
            .leftJoinAndSelect("theater.dates", "dates")
            .leftJoinAndSelect("dates.times", "times")
            .leftJoinAndSelect("times.rows", "rows")
            .leftJoinAndSelect("rows.seats", "seats")
            .select([
                "theater.name",
                "theater.posterUrl",
                "theater.location",
                "theater.title",
                "orders.orderNum",
                "orders.name",
                "orders.phone",
                "dates.date",
                "times.time",
                "rows.name",
                "seats.name",
            ])
            .where("orders.orderNum = :orderNum")
            .setParameter("orderNum", body.orderNum)
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("order.id")
                    .from(Order, "order")
                    .where("order.orderNum = :orderNum")
                    .getQuery();
                return "seats.orderId = " + subQuery;
            })
            .setParameter("orderNum", body.orderNum)
            .getOne();

        if (!returnMyOrder) {
            return {
                result: false,
            };
        }

        const orders = returnMyOrder.orders;
        const dates = returnMyOrder.dates;
        const times = dates.find((date) => date.times).times;

        return {
            result: true,
            theaterName: returnMyOrder.name,
            theaterLocation: returnMyOrder.location,
            theaterTitle: returnMyOrder.title,
            theaterPoster: returnMyOrder.posterUrl,
            orderNum: orders.flatMap((order) => order.orderNum).toString(),
            name: orders.flatMap((order) => order.name).toString(),
            phone: orders.flatMap((order) => order.phone).toString(),
            date: returnMyOrder.dates.flatMap((date) => date.date).toString(),
            time: times.flatMap((time) => time.time).toString(),
            seats: times.flatMap((time) =>
                time.rows.flatMap((row) =>
                    row.seats.flatMap((seat) => `${row.name} ${seat.name}번`),
                ),
            ),
        };
    }

    private async postMyOrder(body: MyOrderBodyType) {
        let result: any;

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const theaterId = await this.theaterRepository
                .createQueryBuilder("theater")
                .select("id")
                .where("theater.theaterCode = :theaterCode")
                .setParameter("theaterCode", body.theaterCode)
                .getRawOne();

            body.theaterId = theaterId.id;

            const execute = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(Order, ["orderNum", "theaterId", "name", "phone", "count"])
                .values(body)
                .execute();

            result = execute;

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

        return result;
    }

    public async isOrder(body: MyOrderBodyType) {
        const isOrder = await this.orderRepository
            .createQueryBuilder("order")
            .where("order.orderNum = :orderNum")
            .setParameter("orderNum", body.orderNum)
            .getExists();

        if (isOrder) {
            return await this.getMyOrder(body);
        }

        return await this.postMyOrder(body);
    }
}
