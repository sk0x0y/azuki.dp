import { EntityRepository, Repository } from "typeorm";
import { Character } from "../../application/entities/Character";
import { CharactorDTO } from "../dto/charactor.dto";

@EntityRepository(Character)
export class CharactorRepository extends Repository<Character> {
  register(data: CharactorDTO) {
    return this.createQueryBuilder()
      .insert()
      .into(Character)
      .values({ ...data });
  }
}
