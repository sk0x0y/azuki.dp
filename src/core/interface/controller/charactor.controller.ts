import { getConnection } from "typeorm";
import { CharactorRepository } from "../repository/charactor.repository";
import { CharactorDTO } from "../dto/charactor.dto";

const connect = getConnection();
const charactorRepository = connect.getCustomRepository(CharactorRepository);

export const register = (data: CharactorDTO) =>
  charactorRepository.register(data);
