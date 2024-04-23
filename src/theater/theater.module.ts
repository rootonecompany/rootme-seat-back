import { Module } from "@nestjs/common";
import { TheaterService } from "./theater.service";
import { TheaterController } from "./theater.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Theater } from "src/yanolja/entities/theater.entity";
import { Date } from "src/yanolja/entities/date.entity";
import { Time } from "src/yanolja/entities/time.entity";
import { Row } from "src/yanolja/entities/row.entity";
import { Seat } from "src/yanolja/entities/seat.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Theater, Date, Time, Row, Seat])],
    providers: [TheaterService],
    controllers: [TheaterController],
})
export class TheaterModule {}
