import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { GenderType, GuardianType } from "../../interface/dto/Charactor.dto";

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
  isActive: boolean;
}
