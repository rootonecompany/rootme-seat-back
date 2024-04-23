import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { OrderService } from "./order.service";

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
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    // @Get()
    // async getOrderAll(): Promise<Order[]> {
    //     return await this.orderaService.getOrderAll();
    // }

    // @Get()
    // public async isOrder(@Query() query: OrderQueryType) {
    //     return await this.orderService.isOrder(query);
    // }

    @Post()
    public async isOrder(@Body() body: MyOrderBodyType) {
        return await this.orderService.isOrder(body);
    }

    @Get("/invoice")
    public async getMyOrder(@Query() query: OrderQueryType) {
        return await this.orderService.isOrder(query);
    }
}
