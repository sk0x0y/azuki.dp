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
  isActive: boolean;
}
