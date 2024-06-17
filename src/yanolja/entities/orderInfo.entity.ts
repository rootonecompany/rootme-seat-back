import { IsDate, IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "./seat.entity";
import { Theater } from "./theater.entity";

@Entity("yanolja_orderInfo")
export class OrderInfo {
    @PrimaryGeneratedColumn({ type: "bigint", comment: "주문번호 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", comment: "주문자 명" })
    name: string;

    @IsString()
    @Column({ type: "varchar", comment: "주문자 폰번호" })
    phoneNumber: string;

    @IsString()
    @Column({ type: "varchar", comment: "핀번호", unique: true })
    pinNumber: string;

    @IsString()
    @Column({ type: "varchar", comment: "채널(인터파크티켓, 야놀자티켓 등등)" })
    channel: string;

    @IsString()
    @Column({ type: "varchar", comment: "상품코드" })
    goodsCode: string;

    @IsString()
    @Column({ type: "varchar", comment: "상품명" })
    goodsName: string;

    @IsDate()
    @Column({ type: "datetime", comment: "구매일자" })
    date: Date;

    @IsDate()
    @Column({ type: "date", comment: "유효기간 시작일" })
    validStartAt: Date;

    @IsDate()
    @Column({ type: "date", comment: "유효기간 종료일" })
    validEndAt: Date;

    @ManyToOne(() => Theater, (theater) => theater.orderInfos)
    @JoinColumn({ name: "theaterId" }) // 1. foreignKey
    theater: Theater;

    @Column({ nullable: true }) // 2. create column for foreignKey
    theaterId: number;

    @OneToMany(() => Seat, (seat) => seat.order)
    seats: Seat[];
}
