import { IsOptional, IsString } from "class-validator";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Date } from "./date.entity";
import { Order } from "./order.entity";

@Entity("yanolja_theater")
export class Theater {
    /**
     * old entity
     */
    // @PrimaryGeneratedColumn({ type: "bigint", comment: "극장 인덱스" })
    // id: number;

    // @IsString()
    // @IsOptional()
    // @Column({ type: "varchar", nullable: true, comment: "소극장 코드" })
    // theaterCode: string;

    // @IsString()
    // @IsOptional()
    // @Column({ type: "varchar", nullable: true, comment: "이름" })
    // name: string;

    // @IsString()
    // @IsOptional()
    // @Column({ type: "varchar", nullable: true, comment: "위치" })
    // location: string;

    // @IsString()
    // @IsOptional()
    // @Column({ type: "varchar", nullable: true, comment: "규모" })
    // size: string;

    // @OneToMany(() => Date, (date) => date.theater)
    // dates: Date[];

    // @OneToMany(() => Seat, (seat) => seat.theater)
    // seats: Seat[];

    /**
     * new entity
     */
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

    @OneToOne(() => Order)
    order: Order;

    @OneToMany(() => Date, (date) => date.theater)
    dates: Date[];
}
