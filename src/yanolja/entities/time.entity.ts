import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Date } from "./date.entity";
import { Row } from "./row.entity";

@Entity("yanolja_time")
export class Time {
    /**
     * new entity
     */
    @PrimaryGeneratedColumn({ type: "bigint", comment: "시간 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", nullable: true, comment: "시간" })
    time: string;

    @ManyToOne(() => Date, (date) => date.times)
    @JoinColumn({ name: "dateId" }) // 1. foreignKey
    date: Date;

    @Column() // 2. create column for foreignKey
    dateId: number;

    @OneToMany(() => Row, (row) => row.time)
    rows: Row[];
}
