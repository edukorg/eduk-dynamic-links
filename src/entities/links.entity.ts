import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('links')
export class LinksEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    link: string;

    @Column()
    ip: string;

    @Column()
    deleted: boolean;
}