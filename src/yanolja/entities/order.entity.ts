import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "./seat.entity";
import { Theater } from "./theater.entity";

@Entity("yanolja_order")
export class Order {
    @PrimaryGeneratedColumn({ type: "bigint", comment: "주문번호 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", comment: "주문번호", unique: true })
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

    @OneToMany(() => Theater, (theater) => theater.order)
    @JoinColumn({ name: "theaterId", referencedColumnName: "id" }) // 1. foreignKey
    theaters: Theater[];

    @Column() // 2. create column for foreignKey
    theaterId: number;

    @OneToMany(() => Seat, (seat) => seat.order)
    seats: Seat[];
}
