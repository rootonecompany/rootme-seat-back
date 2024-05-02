import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TheaterService } from "./theater.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";

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
    theaterCode: string;
    orderNum: string;
};

export type DateQueryType = {
    dateId: number;
    count?: number;
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
    @ApiConsumes("application/json")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                theaterCode: {
                    type: "string",
                    description: "극장 코드",
                    example: "0000001",
                },
                name: {
                    type: "string",
                    description: "극장 이름",
                    example: "서울 상상나라극장",
                },
                location: {
                    type: "string",
                    description: "극장 위치",
                    example: "서울시 광진구 능동로216, 서울상상나라 지하 1층",
                },
                size: {
                    type: "string",
                    description: "극장 규모 (소극장)",
                    example: "소극장",
                },
            },
        },
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
    @ApiQuery({
        name: "theaterCode",
        required: true,
        example: "0000001",
        type: String,
    })
    @ApiQuery({
        name: "orderNum",
        required: true,
        example: "2",
        type: String,
    })
    async getDates(@Query() query: TheaterQueryType) {
        return await this.theaterService.getDates(query);
    }

    @Get("/times")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 시간 호출",
        description: "소극장의 예매할 수 있는 시간 호출",
    })
    @ApiQuery({
        name: "dateId",
        required: true,
        example: 1,
        type: String,
    })
    async getTimes(@Query() query: DateQueryType) {
        return await this.theaterService.getTimes(query);
    }

    @Get("/seats")
    @ApiOperation({
        summary: "소극장의 예매할 수 있는 좌석 호출",
        description: "소극장의 예매할 수 있는 좌석 호출",
    })
    @ApiQuery({
        name: "timeId",
        required: true,
        example: 1,
        type: String,
    })
    async getSeats(@Query() query: TimeQueryType) {
        return await this.theaterService.getSeats(query);
    }

    @Post("/seats")
    @ApiOperation({
        summary: "좌석 예매",
        description: "좌석 예매",
    })
    // @ApiQuery({
    //     name: "orderNum",
    //     required: true,
    //     example: 1,
    //     type: String,
    // })
    // @ApiQuery({
    //     name: "seatIds",
    //     required: true,
    //     example: [1, 2, 3, 4, 5],
    //     type: [Number],
    // })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                orderNum: {
                    type: "string",
                    description: "주문 번호",
                    example: "2",
                },
                seatIds: {
                    type: "Array[number]",
                    description: "좌석 아이디 값",
                    example: "[1, 2, 3, 4, 5]",
                },
            },
        },
    })
    async updateSeats(@Body() body: UpdateSeatBodyType) {
        return await this.theaterService.updateSeats(body);
    }
}
