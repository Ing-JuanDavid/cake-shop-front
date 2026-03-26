export interface UserRegisterDto {
  nip?: number;
  email?: string;
  password?: string;
  name?: string;
  birth?: Date;
  rol?: string;
  sex?: string;
  address? : string;
  telf?: string;
}
