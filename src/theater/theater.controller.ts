import { Body, Controller, Get, Post, Put, Query } from "@nestjs/common";
import { TheaterService } from "./theater.service";

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
export class TheaterController {
    constructor(private readonly theaterService: TheaterService) {}

    @Post("/insertTheaterInfos")
    public async insertTheaterInfos(@Body() body: InsertTheaterBodyType) {
        return await this.theaterService.insertTheaterInfos(body);
    }

    @Post("/insertCustomDates")
    public async insertCustomDates(@Body() body: InsertDateBodyType) {
        return await this.theaterService.insertCustomDates(body);
    }

    @Post("/insertCustomTimes")
    async insertCustomTimes(@Body() body: InsertTimeBodyType) {
        return await this.theaterService.insertCustomTimes(body);
    }

    @Post("/insertCustomRows")
    async insertCustomRows(@Body() body: InsertRowBodyType) {
        return await this.theaterService.insertCustomRows(body);
    }

    @Post("/insertCustomSeats")
    async insertCustomSeats(@Body() body: InsertSeatBodyType) {
        return await this.theaterService.insertCustomSeats(body);
    }

    @Get("/dates")
    async getDates(@Query() query: TheaterQueryType) {
        return await this.theaterService.getDates(query);
    }

    @Get("/times")
    async getTimes(@Query() query: DateQueryType) {
        return await this.theaterService.getTimes(query);
    }

    @Get("/seats")
    async getSeats(@Query() query: TimeQueryType) {
        return await this.theaterService.getSeats(query);
    }

    @Put("/seats")
    async updateSeats(@Body() body: UpdateSeatBodyType) {
        return await this.theaterService.updateSeats(body);
    }
}
