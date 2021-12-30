export enum GenderType {
  MALE,
  FEMALE,
}
export enum GuardianType {
  RED_BIRD,
  BLACK_TORTOISE,
  BLUE_DRAGON,
  WHITE_TIGER,
}
export enum NationalityType {
  BUYEO,
  GOGURYEO,
}

export interface CharactorDTO {
  id?: number;
  username: string;
  password: string;
  hair: number;
  face: number;
  gender: GenderType;
  guardian: GuardianType;
  nationality: NationalityType;
  isActive: boolean;
}
