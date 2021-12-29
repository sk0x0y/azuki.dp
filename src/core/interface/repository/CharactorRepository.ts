import { EntityRepository, Repository } from "typeorm";
import { Character } from "../../application/entities/Character";
import { CharactorDTO } from "../dto/Charactor.dto";

@EntityRepository()
class CharactorRepository extends Repository<Character> {
  register(data: CharactorDTO) {
    this.createQueryBuilder()
      .insert()
      .into(Character)
      .values({ ...data });
  }
}
