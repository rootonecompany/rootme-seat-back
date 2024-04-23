import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "./seat.entity";
import { Theater } from "./theater.entity";

@Entity("yanolja_order")
export class Order {
    @PrimaryGeneratedColumn({ type: "bigint", comment: "주문번호 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", comment: "주문번호" })
    orderNum: string;

    @IsString()
    @Column({ type: "varchar", comment: "주문자 명" })
    name: string;

    @IsString()
    @Column({ type: "varchar", nullable: true, comment: "주문자 폰번호" })
    phone: string;

    @IsString()
    @Column({ type: "tinyint", comment: "예매할 좌석 수" })
    count: number;

    @OneToOne(() => Theater)
    @JoinColumn({ name: "theaterId" }) // 1. foreignKey
    theater: Theater;

    @Column() // 2. create column for foreignKey
    theaterId: number;

    @OneToMany(() => Seat, (seat) => seat.order)
    seats: Seat[];
}
