export enum GenderType {
  MALE, // 남자
  FEMALE, // 여자
}
export enum GuardianType {
  RED_BIRD, // 주작
  BLACK_TORTOISE, // 현무
  BLUE_DRAGON, // 청룡
  WHITE_TIGER, // 백호
}
export enum NationalityType {
  BUYEO, // 부여
  GOGURYEO, // 고구려
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
  nxclub_id: string;
  server?: string;
  current_map?: string;
  job?: number;
  job_rank?: number;
  clan: string;
  clan_title: string;
  title?: string;
  personality?: number;
  active_pk?: boolean;
  active_trade?: boolean;
  active_group?: boolean;
  alive?: boolean;
  current_hp?: number;
  max_hp?: number;
  current_mp?: number;
  max_mp?: number;
  money?: number;
  exp?: number;
  long?: number;
  lat?: number;
  blocked?: boolean;
}
