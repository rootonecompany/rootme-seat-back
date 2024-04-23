import { IsString } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Seat } from "./seat.entity";
import { Time } from "./time.entity";

@Entity("yanolja_row")
export class Row {
    /**
     * new entity
     */
    @PrimaryGeneratedColumn({ type: "bigint", comment: "행 인덱스" })
    id: number;

    @IsString()
    @Column({ type: "varchar", nullable: true, comment: "행" })
    name: string;

    @ManyToOne(() => Time, (time) => time.rows)
    @JoinColumn({ name: "timeId" }) // 1. foreignKey
    time: Time;

    @Column() // 2. create column for foreignKey
    timeId: number;

    @OneToMany(() => Seat, (seat) => seat.row)
    seats: Seat[];
}
