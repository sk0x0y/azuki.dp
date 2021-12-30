import { CharactorRepository } from "../repository/charactor.repository";
import { CharactorDTO } from "../dto/charactor.dto";
import { Connection, getConnection } from "typeorm";

class CharactorController {
  private connection: Connection;
  private charactorRepository: CharactorRepository;
  private charactor: CharactorDTO;

  constructor() {
    this.connection = getConnection();
    this.charactorRepository =
      this.connection.getCustomRepository(CharactorRepository);
    this.charactor = this.charactorRepository.create();
  }

  setCharactor(data: CharactorDTO) {
    this.charactor = { ...data };

    return this;
  }

  findByName(username) {
    return this.charactorRepository.findOne({ username });
  }

  save() {
    return this.charactorRepository.save(this.charactor);
  }
}

export const useCharactor = () => {
  return new CharactorController();
};
