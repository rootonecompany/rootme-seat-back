import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

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
    public async isOrder(@Body() body: MyOrderBodyType) {
        return await this.orderService.isOrder(body);
    }

    @Get("/invoice")
    @ApiOperation({
        summary: "인보이스",
        description: "주문번호로 예매된 모든 값 호출",
    })
    public async getMyOrder(@Query() query: OrderQueryType) {
        return await this.orderService.isOrder(query);
    }
}
