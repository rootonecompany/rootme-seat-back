import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { OrderInfoDto } from "src/yanolja/dtos/orderInfo.dto";

export type OrderQueryType = {
    orderNum: string;
};

export type MyOrderBodyType = OrderQueryType & {
    theaterId?: number;
    theaterCode?: string;
    name?: string;
    phone?: string;
    count?: number;
};

@Controller("order")
@ApiTags("주문 API")
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post()
    @ApiOperation({
        summary: "주문 확인",
        description:
            "1) 주문번호가 없으면 insert \n2) 주문번호가 있고, 좌석이 없으면 {}\n3) 주문번호가 있고, 좌석이 있으면 invoice값 호출",
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
                    description: "예매자 이름",
                    example: "박아무개",
                },
                phone: {
                    type: "string",
                    description: "예매자 폰번호",
                    example: "01012341234",
                },
                count: {
                    type: "string",
                    description: "예매할 좌석 수",
                    example: "5",
                },
            },
        },
    })
    public async isOrder(@Body() body: MyOrderBodyType) {
        return await this.orderService.isOrder(body);
    }

    @Get("/invoice")
    @ApiOperation({
        summary: "인보이스",
        description: "주문번호로 예매된 모든 값 호출",
    })
    @ApiQuery({
        name: "orderNum",
        required: true,
        example: "1",
        type: String,
    })
    public async getMyOrder(@Query() query: OrderQueryType) {
        return await this.orderService.isOrder(query);
    }

    @Post("/orderInfo")
    @ApiOperation({
        summary: "주문자 정보",
        description: "각 채널 주문자 정보",
    })
    @ApiConsumes("application/json")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    description: "주문자명",
                    example: "박아무개",
                },
                phoneNumber: {
                    type: "string",
                    description: "주문자 폰번호",
                    example: "01012341234",
                },
                pinNumber: {
                    type: "string",
                    description: "핀번호",
                    example: "HD129AGFK182AFB",
                },
                channel: {
                    type: "string",
                    description: "채널",
                    example: "티몬",
                },
                goodsCode: {
                    type: "string",
                    description: "상품코드",
                    example: "300000",
                },
                goodsName: {
                    type: "string",
                    description: "상품명",
                    example: "번개맨와 배트맨이 싸우면 누가 이길까?",
                },
                date: {
                    type: "Date",
                    description: "구매일자",
                    example: "2024-01-01 12:31:42",
                },
                validStartAt: {
                    type: "Date",
                    description: "유효기간 시작일",
                    example: "2024-01-15",
                },
                validEndAt: {
                    type: "Date",
                    description: "유효기간 시작일",
                    example: "2024-01-30",
                },
            },
        },
    })
    public async saveOrderInfo(@Body() orderInfoDto: OrderInfoDto) {
        return await this.orderService.saveOrderInfo(orderInfoDto);
    }
}
