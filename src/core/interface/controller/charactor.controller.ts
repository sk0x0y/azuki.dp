import { CharactorRepository } from "../repository/charactor.repository";
import { CharactorDTO } from "../dto/charactor.dto";
import { Connection, getConnection } from "typeorm";

export class CharactorController {
  connection: Connection;
  charactorRepository: CharactorRepository;
  charactor: CharactorDTO;

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

  save() {
    return this.charactorRepository.save(this.charactor);
  }
}
