import { Notification } from '#/notification/enitities/notification.entity';
import { Reviews } from '#/reviews/entities/reviews.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  salt: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    unique: true
  })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string

  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => Reviews, (review) => review.psycholog)
  reviews: Reviews[]

  @OneToMany(() => Notification, (notif) => notif.sender)
  sender: Notification[]

  @OneToMany(() => Notification, (notif) => notif.receiver)
  receiver: Notification[]
}
