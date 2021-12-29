export enum GenderType {
  MALE = "남자",
  FEMALE = "여자",
}
export enum GuardianType {
  RED_BIRD = "주작",
  BLACK_TORTOISE = "현무",
  BLUE_DRAGON = "청룡",
  WHITE_TIGER = "백호",
}
export enum NationalityType {
  BUYEO = "부여",
  GOGURYEO = "고구려",
}

export interface CharactorDTO {
  id?: number;
  username: string;
  password: string;
  hair?: number;
  face?: number;
  gender?: GenderType;
  guardian?: GuardianType;
  nationality?: NationalityType;
  isActive?: boolean;
}
