import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dynamic_links')
export class DynamicLinksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  link: string;

  @Column('varchar')
  token: string;

  @Column('datetime', { name: 'expire_at' })
  expireAt: Date;

  @Column('boolean', { default: false })
  deleted: boolean;
}
