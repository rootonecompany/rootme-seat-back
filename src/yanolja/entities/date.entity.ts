import { IsBoolean, IsDate } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Theater } from "./theater.entity";
import { Time } from "./time.entity";

@Entity("yanolja_date")
export class Date {
    @PrimaryGeneratedColumn({ type: "bigint", comment: "날짜 인덱스" })
    id: number;

    @IsDate()
    @Column({ type: "date", nullable: true, comment: "날짜" })
    date: string;

    @IsBoolean()
    @Column({ type: "bool", default: 1, comment: "활성화 여부 0: 비활성 / 1: 활성" })
    state: boolean;

    @ManyToOne(() => Theater, (theater) => theater.dates)
    @JoinColumn({ name: "theaterId" }) // 1. foreignKey
    theater: Theater;

    @Column() // 2. create column for foreignKey
    theaterId: number;

    @OneToMany(() => Time, (time) => time.date)
    times: Time[];
}
