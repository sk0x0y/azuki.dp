import { EntityRepository, Repository } from "typeorm";
import { Character } from "../../application/entities/Character";
import { CharactorDTO } from "../dto/charactor.dto";

@EntityRepository(Character)
export class CharactorRepository extends Repository<Character> {}

export const useCharactor = () => {
  return new CharactorRepository();
};
