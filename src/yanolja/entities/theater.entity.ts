import { IsOptional, IsString } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Date } from "./date.entity";
import { Order } from "./order.entity";
import { OrderInfo } from "./orderInfo.entity";

@Entity("yanolja_theater")
export class Theater {
    @PrimaryGeneratedColumn({ type: "bigint", comment: "극장 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", comment: "소극장 코드" })
    theaterCode: string;

    @IsString()
    @Column({ type: "varchar", comment: "이름" })
    name: string;

    @IsString()
    @Column({ type: "varchar", comment: "위치" })
    location: string;

    @IsString()
    @IsOptional()
    @Column({ type: "varchar", nullable: true, comment: "규모" })
    size: string;

    @IsString()
    @Column({ type: "varchar", nullable: true, comment: "포스터" })
    posterUrl: string;

    @IsString()
    @Column({ type: "varchar", nullable: true, comment: "공연 제목" })
    title: string;

    @OneToMany(() => OrderInfo, (orderInfo) => orderInfo.theater)
    orderInfos: OrderInfo[];

    @OneToMany(() => Order, (order) => order.theater)
    orders: Order[];

    @OneToMany(() => Date, (date) => date.theater)
    dates: Date[];
}
