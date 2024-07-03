import { BadRequestException, Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Order } from "src/yanolja/entities/order.entity";
import { DataSource, Repository } from "typeorm";
import { MyOrderBodyType, OrderQueryType } from "./order.controller";
import { Theater } from "src/yanolja/entities/theater.entity";
import { OrderInfo } from "src/yanolja/entities/orderInfo.entity";
import { OrderInfoDto } from "src/yanolja/dtos/orderInfo.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderInfo)
        private readonly orderInfoRepository: Repository<OrderInfo>,
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

            await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(Order, ["orderNum", "theaterId", "name", "phone", "count"])
                .values(body)
                .execute();

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

        return await this.getMyOrder(body);
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

    public async saveOrderInfo(orderInfoDto: OrderInfoDto) {
        let execute: any;
        try {
            execute = await this.orderInfoRepository
                .createQueryBuilder("orderInfo")
                .insert()
                .into(OrderInfo, [
                    "name",
                    "phoneNumber",
                    "pinNumber",
                    "channel",
                    "goodsCode",
                    "goodsName",
                    "date",
                    "validStartAt",
                    "validEndAt",
                    "price",
                ])
                .values(orderInfoDto)
                .execute();
        } catch (error: any) {
            if (error.errno === 1062) {
                throw new BadRequestException("핀번호가 중복된 주문정보입니다.", {
                    cause: new Error(),
                    description: error.code,
                });
            }
        }

        if (execute.identifiers) {
            return {
                result: "success",
            };
        }
        return execute;
    }

    private dateFormat = (date: Date) => {
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        let hour = date.getHours().toString();
        let minute = date.getMinutes().toString();
        let second = date.getSeconds().toString();

        month = Number(month) >= 10 ? month : "0" + month;
        day = Number(day) >= 10 ? day : "0" + day;
        hour = Number(hour) >= 10 ? hour : "0" + hour;
        minute = Number(minute) >= 10 ? minute : "0" + minute;
        second = Number(second) >= 10 ? second : "0" + second;

        return (
            date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
        );
    };
}
