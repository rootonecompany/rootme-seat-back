import { Injectable, NotAcceptableException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { Theater } from "src/yanolja/entities/theater.entity";
import { DataSource, Repository } from "typeorm";
import {
    DateQueryType,
    InsertDateBodyType,
    InsertRowBodyType,
    InsertSeatBodyType,
    InsertTheaterBodyType,
    InsertTimeBodyType,
    TheaterQueryType,
    TimeQueryType,
    UpdateSeatBodyType,
} from "./theater.controller";
import { Date } from "src/yanolja/entities/date.entity";
import { Time } from "src/yanolja/entities/time.entity";
import { Row } from "src/yanolja/entities/row.entity";
import { Seat } from "src/yanolja/entities/seat.entity";

@Injectable()
export class TheaterService {
    constructor(
        @InjectRepository(Theater)
        private readonly theaterRepository: Repository<Theater>,
        @InjectRepository(Date)
        private readonly dateRepository: Repository<Date>,
        @InjectRepository(Time)
        private readonly timeRepository: Repository<Time>,
        @InjectRepository(Row)
        private readonly rowRepository: Repository<Row>,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        @InjectDataSource()
        private readonly db: DataSource,
    ) {}

    public async insertTheaterInfos(body: InsertTheaterBodyType) {
        const execute = await this.theaterRepository
            .createQueryBuilder("theater")
            .insert()
            .into(Theater, ["theaterCode", "name", "location", "size"])
            .values(body)
            .execute();

        return execute;
    }

    public async insertCustomDates(body: InsertDateBodyType) {
        let result: any;

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const searchDates = await this.getCustomDates(body);
        const dates = searchDates.flatMap((date) => date.date);
        const searchTheaterIds = await this.theaterRepository
            .createQueryBuilder("theater")
            .select("theater.id")
            .getMany();
        const theaterIds = searchTheaterIds.flatMap((id) => id.id);

        const insertDates = theaterIds.flatMap((id: number) => {
            return dates.map((date: string) => {
                return {
                    date,
                    state: 1,
                    theaterId: id,
                };
            });
        }) as unknown as Date;

        try {
            const execute = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(Date, ["date", "state", "theaterId"])
                .values(insertDates)
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

    public async insertCustomTimes(body: InsertTimeBodyType) {
        let result: any;

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const returnDateIds = await this.dateRepository
            .createQueryBuilder("date")
            .select("date.id")
            .getMany();
        const dateIds = returnDateIds.flatMap((id) => id.id);

        const insertTimes = dateIds.flatMap((id) => {
            return body.times.map((time) => {
                return {
                    time,
                    dateId: id,
                };
            });
        });

        try {
            const execute = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(Time, ["time", "dateId"])
                .values(insertTimes)
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

    public async insertCustomRows(body: InsertRowBodyType) {
        let result: any;

        const returnTheaterId = await this.theaterRepository
            .createQueryBuilder("theater")
            .leftJoinAndSelect("theater.dates", "dates")
            .leftJoinAndSelect("dates.times", "times")
            .select(["theater.id", "dates.id", "times.id"])
            .where("theater.id = :theaterId", { theaterId: body.theaterId })
            .getMany();

        const timeIds = returnTheaterId.flatMap((theaterId) =>
            theaterId.dates.flatMap((dateId) => dateId.times.flatMap((timeId) => timeId.id)),
        );

        // const rawQuery = `
        //     select c.id
        //     from yanolja_theater a
        //     left join yanolja_date b
        //     on a.id = b.theaterId
        //     left join yanolja_time c
        //     on b.id = c.dateId
        //     where a.id = ${body.theaterId}
        // `;
        // const timeIds = await this.theaterRepository.query(rawQuery);

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const insertRows = timeIds.flatMap((id) => {
                return body.rows.map((name) => {
                    return {
                        name,
                        timeId: id,
                    };
                });
            });

            const execute = await queryRunner.manager
                .createQueryBuilder()
                .insert()
                .into(Row, ["name", "timeId"])
                .values(insertRows)
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

    public async insertCustomSeats(body: InsertSeatBodyType) {
        console.time("call");

        let result: any;

        // const rawQuery = `
        //     select d.id
        //     from yanolja_theater a
        //     left join yanolja_date b
        //     on a.id = b.theaterId
        //     left join yanolja_time c
        //     on b.id = c.dateId
        //     left join yanolja_row d
        //     on c.id = d.timeId
        //     where a.id = ${body.theaterId}
        // `;
        // const timeIds = await this.theaterRepository.query(rawQuery);

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const rawQuery = `call loopInsertSeat(${body.endOfRowCount}, ${body.theaterId})`;
            const execute = await this.theaterRepository.query(rawQuery);

            result = execute;

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
        console.timeEnd("call");

        return result;
    }

    public async getDates(query: TheaterQueryType) {
        const returnDates = await this.theaterRepository
            .createQueryBuilder("theater")
            .leftJoinAndSelect("theater.orders", "orders")
            .leftJoinAndSelect("theater.dates", "dates")
            .select(["theater.id", "dates.id", "dates.date", "dates.state", "orders.count"])
            .where((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("theater.id")
                    .from(Theater, "theater")
                    .where("theater.theaterCode = :theaterCode")
                    .getQuery();
                return "dates.theaterId = " + subQuery;
            })
            .setParameter("theaterCode", query.theaterCode)
            .andWhere("orders.orderNum = :orderNum")
            .setParameter("orderNum", query.orderNum)
            .getOne();

        return {
            count: Number(returnDates.orders.flatMap((order) => order.count).toString()),
            dates: returnDates.dates,
        };
    }

    public async getTimes(query: DateQueryType) {
        // group by query
        // const times = await this.theaterRepository
        //     .createQueryBuilder("theater")
        //     .leftJoinAndSelect("theater.dates", "dates")
        //     .leftJoinAndSelect("dates.times", "times")
        //     .leftJoinAndSelect("times.rows", "rows")
        //     .leftJoinAndSelect("rows.seats", "seats")
        //     .select([
        //         "ANY_VALUE(theater.id) as theater_id",
        //         "ANY_VALUE(dates.id) as dates_id",
        //         "ANY_VALUE(times.id) as times_id",
        //         "ANY_VALUE(times.time) as times_time",
        //         "ANY_VALUE(rows.id) as rows_id",
        //         "count(seats.id) as count",
        //     ])
        //     .where("times.dateId = :dateId", { dateId: query.dateId })
        //     .andWhere("seats.state = 1")
        //     .groupBy("times.id")
        //     .getRawMany();

        // select subQuery
        const returnTimes = await this.timeRepository
            .createQueryBuilder("time")
            .select(["time.id", "time.time"])
            .addSelect((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("count(seats.id)")
                    .from(Row, "row")
                    .leftJoin("row.seats", "seats")
                    .where("row.timeId = time.id")
                    .andWhere("seats.state = 1")
                    .andWhere("seats.isDisabled = 0");
                return subQuery;
            }, "enabled_count")
            .addSelect((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("count(seats.id)")
                    .from(Row, "row")
                    .leftJoin("row.seats", "seats")
                    .where("row.timeId = time.id")
                    .andWhere("seats.state = 1")
                    .andWhere("seats.isDisabled = 1");
                return subQuery;
            }, "disabled_count")
            .where("time.dateId = :dateId", { dateId: query.dateId })
            .getRawMany();

        return returnTimes.map((time) => {
            return {
                id: time.time_id,
                time: time.time_time,
                enabled_count: time.enabled_count,
                disabled_count: time.disabled_count,
            };
        });
    }

    public async getSeats(query: TimeQueryType) {
        const searchTimes = await this.timeRepository
            .createQueryBuilder("time")
            .leftJoinAndSelect("time.rows", "rows")
            .leftJoinAndSelect("rows.seats", "seats")
            .select([
                "time.id",
                "time.time",
                "rows.id",
                "rows.name",
                "seats.id",
                "seats.name",
                "seats.isDisabled",
                "seats.state",
            ])
            .where("time.id = :timeId", { timeId: query.timeId })
            .getOne();

        const times = {
            id: searchTimes.id,
            time: searchTimes.time,
            rows: searchTimes.rows.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    seats: row.seats.flatMap((seat) => {
                        const temp = {
                            id: seat.id,
                            name: seat.name,
                            state: seat.state,
                        };

                        seat.isDisabled === true ? (temp["isDisabled"] = true) : undefined;

                        return temp;
                    }),
                };
            }),
        };

        return times;
    }

    private async getCustomDates(query: InsertDateBodyType) {
        const { startDate, endDate } = query;

        const rawQuery = `
            with recursive cte as (
                select date("${startDate}") as dt from dual
                union all
                select date_add(dt, interval 1 day) from cte
                where dt <= date("${endDate}")
            )
            select date(dt) as date
            from cte
        `;

        return await this.theaterRepository.query(rawQuery);
    }

    public async updateSeats(body: UpdateSeatBodyType) {
        let result: any;

        const { orderNum, seatIds } = body;

        const availableSeats = await this.seatRepository
            .createQueryBuilder()
            .whereInIds(seatIds)
            .getMany();
        const isOrders = availableSeats.find((seat) => seat.orderId !== null);

        if (isOrders) {
            throw new NotAcceptableException("이미 예약된 좌석입니다.");
        }

        const queryRunner = this.db.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const updateSeats = await this.seatRepository
                .createQueryBuilder()
                .setLock("pessimistic_write")
                .update(Seat)
                .set({
                    orderId: () => {
                        return `(
                            select *
                            from (
                                select id
                                from yanolja_order
                                where orderNum = '${orderNum}'
                            ) as a
                        )`;
                    },
                    state: () => "2",
                })
                .whereInIds(seatIds)
                .execute();

            result = updateSeats;

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }

        return result;
    }
}
