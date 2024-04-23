import { IsBoolean, IsNumber, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Row } from "./row.entity";

@Entity("yanolja_seat")
export class Seat {
    @PrimaryGeneratedColumn({ type: "bigint", comment: "좌석 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", nullable: true, comment: "좌석 이름" })
    name: string;

    @IsBoolean()
    @Column({
        type: "bool",
        nullable: true,
        default: 0,
        comment: "장애인석 여부 0: 비장애인석 / 1: 장애인석",
    })
    isDisabled: boolean;

    @IsNumber()
    @Column({
        type: "tinyint",
        nullable: true,
        comment: "상태 0: 좌석 없음 / 1: 예약 가능 / 2: 예약 불가 / 3: 선택 불가",
        default: 1,
    })
    state: number;

    @ManyToOne(() => Row, (row) => row.seats)
    @JoinColumn({ name: "rowId" }) // 1. foreignKey
    row: Row;

    @Column() // 2. create column for foreignKey
    rowId: number;

    @ManyToOne(() => Order, (order) => order.seats)
    @JoinColumn({ name: "orderId" }) // 1. foreignKey
    order: Order;

    @Column({ nullable: true }) // 2. create column for foreignKey
    orderId: number;
}
