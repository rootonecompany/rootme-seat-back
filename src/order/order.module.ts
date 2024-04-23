import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "src/yanolja/entities/order.entity";
import { Theater } from "src/yanolja/entities/theater.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Order, Theater])],
    providers: [OrderService],
    controllers: [OrderController],
})
export class OrderModule {}
