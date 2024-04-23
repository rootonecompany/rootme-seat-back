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
            throw new NotAcceptableException("잘못된 주문번호 입니다.");
        }
    }

    public async getMyOrder(body: MyOrderBodyType) {
        const returnMyOrder = await this.orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.theater", "theater")
            .leftJoinAndSelect("theater.dates", "dates")
            .leftJoinAndSelect("dates.times", "times")
            .leftJoinAndSelect("times.rows", "rows")
            .leftJoinAndSelect("rows.seats", "seats")
            .select([
                "order.orderNum",
                "order.name",
                "order.phone",
                "theater.name",
                "theater.posterUrl",
                "theater.location",
                "theater.title",
                "dates.date",
                "times.time",
                "rows.name",
                "seats.name",
            ])
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("order.id")
                    .from(Order, "order")
                    .where("order.orderNum = :orderNum")
                    .getQuery();
                return "seats.orderId = " + subQuery;
            })
            .setParameter("orderNum", body.orderNum)
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("theater.id")
                    .from(Theater, "theater")
                    .where("theater.theaterCode = :theaterCode")
                    .getQuery();
                return "theater.id = " + subQuery;
            })
            .setParameter("theaterCode", body.theaterCode)
            .getOne();

        if (!returnMyOrder) {
            return {};
        }

        const dates = returnMyOrder.theater.dates;
        const times = dates.flatMap((date) => date.times);

        return {
            orderNum: returnMyOrder.orderNum,
            userName: returnMyOrder.name,
            userPhone: returnMyOrder.phone,
            theaterName: returnMyOrder.theater.name,
            theaterLocation: returnMyOrder.theater.location,
            theaterTitle: returnMyOrder.theater.title,
            date: dates.map((date) => date.date).toString(),
            time: times.map((time) => time.time).toString(),
            seats: times.flatMap((time) =>
                time.rows.flatMap((row) =>
                    row.seats.flatMap((seat) => row.name + " " + seat.name + "번"),
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

            body.theaterId = theaterId;

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
