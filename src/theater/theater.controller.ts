import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { TheaterService } from "./theater.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

export type InsertTheaterBodyType = {
    theaterCode: string;
    name: string;
    location: string;
    size: string;
};

export type InsertDateBodyType = {
    startDate: string;
    endDate: string;
};

export type InsertTimeBodyType = {
    times: string[];
};

export type InsertRowBodyType = {
    theaterId: number;
    rows: string[];
};

export type InsertSeatBodyType = {
    theaterId: number;
    endOfRowCount: number;
};

export type TheaterQueryType = {
    theaterId: number;
};

export type DateQueryType = {
    dateId: number;
};

export type TimeQueryType = {
    timeId: number;
};

export type UpdateSeatBodyType = {
    orderNum: string;
    seatIds: number[];
};

export type dateQueryType = {
    theaterCode: string;
    date: string;
};

@Controller("theater")
@ApiTags("소극장 관련 API")
export class TheaterController {
    constructor(private readonly theaterService: TheaterService) {}

    @Post("/insertTheaterInfos")
    @ApiOperation({
        summary: "소극장 정보 저장",
        description: "소극장 정보 저장",
    })
    public async insertTheaterInfos(@Body() body: InsertTheaterBodyType) {
        return await this.theaterService.insertTheaterInfos(body);
    }

    @Post("/insertCustomDates")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 날짜 저장",
        description: "소극장의 예매할 수 있는 날짜 저장",
    })
    public async insertCustomDates(@Body() body: InsertDateBodyType) {
        return await this.theaterService.insertCustomDates(body);
    }

    @Post("/insertCustomTimes")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 시간 저장",
        description: "소극장의 예매할 수 있는 시간 저장",
    })
    async insertCustomTimes(@Body() body: InsertTimeBodyType) {
        return await this.theaterService.insertCustomTimes(body);
    }

    @Post("/insertCustomRows")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 행 저장",
        description: "소극장의 예매할 수 있는 행 저장",
    })
    async insertCustomRows(@Body() body: InsertRowBodyType) {
        return await this.theaterService.insertCustomRows(body);
    }

    @Post("/insertCustomSeats")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 좌석 저장",
        description: "소극장의 예매할 수 있는 좌석 저장",
    })
    async insertCustomSeats(@Body() body: InsertSeatBodyType) {
        return await this.theaterService.insertCustomSeats(body);
    }

    @Get("/dates")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 날짜 호출",
        description: "소극장의 예매할 수 있는 날짜 호출",
    })
    async getDates(@Query() query: TheaterQueryType) {
        return await this.theaterService.getDates(query);
    }

    @Get("/times")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 시간 호출",
        description: "소극장의 예매할 수 있는 시간 호출",
    })
    async getTimes(@Query() query: DateQueryType) {
        return await this.theaterService.getTimes(query);
    }

    @Get("/seats")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 좌석 호출",
        description: "소극장의 예매할 수 있는 좌석 호출",
    })
    async getSeats(@Query() query: TimeQueryType) {
        return await this.theaterService.getSeats(query);
    }

    @Put("/seats")
    @ApiOperation({
        summary: "좌석 예매",
        description: "좌석 예매",
    })
    async updateSeats(@Body() body: UpdateSeatBodyType) {
        return await this.theaterService.updateSeats(body);
    }
}
