import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  GenderType,
  GuardianType,
  NationalityType,
} from "../../interface/dto/charactor.dto";

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  hair: number;

  @Column()
  face: number;

  @Column({
    type: "enum",
    enum: GenderType,
  })
  gender: GenderType;

  @Column({
    type: "enum",
    enum: GuardianType,
  })
  guardian: GuardianType;

  @Column()
  nationality: NationalityType;

  @Column({})
  nxclub_id: string;

  @Column({ default: "연" })
  server: string;

  @Column({ nullable: true })
  current_map: string;

  @Column({ default: 0 })
  job: number;

  @Column({ default: 0 })
  job_rank: number;

  @Column({ nullable: true, default: "문파 이름 공간" })
  clan: string;

  @Column({ nullable: true, default: "문파 칭호 공간" })
  clan_title: string;

  @Column({ nullable: true, default: "칭호 공간" })
  title?: string;

  @Column({ default: 0 })
  personality?: number;

  @Column({ nullable: true, default: false })
  active_pk?: boolean;

  @Column({ nullable: true, default: true })
  active_trade?: boolean;

  @Column({ nullable: true, default: true })
  active_group?: boolean;

  @Column({ nullable: true, default: true })
  alive: boolean;

  @Column({ nullable: true, default: 50 })
  current_hp: number;

  @Column({ nullable: true, default: 50 })
  max_hp: number;

  @Column({ nullable: true, default: 50 })
  current_mp: number;

  @Column({ nullable: true, default: 50 })
  max_mp: number;

  @Column({ nullable: true, default: 0 })
  money: number;

  @Column({ nullable: true, default: 0 })
  exp: number;

  @Column({ nullable: true, default: 0 })
  long: number;

  @Column({ nullable: true, default: 0 })
  lat: number;

  @Column({ nullable: true, default: false })
  blocked: boolean;
}
