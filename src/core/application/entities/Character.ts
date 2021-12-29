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

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  hair: number;

  @Column({ nullable: true })
  face: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: GenderType,
  })
  gender: GenderType;

  @Column({
    nullable: true,
    type: "enum",
    enum: GuardianType,
  })
  guardian: GuardianType;

  @Column({ nullable: true })
  nationality: NationalityType;

  @Column({
    nullable: true,
  })
  isActive: boolean;
}
