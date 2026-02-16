export interface User {
  nip: number;
  email : string;
  name: string;
  birth: Date | null;
  roles : string[];
  sex: string;
  address: string;
  telf: string;
}

export interface UpdatedUser {
  name: string;
  birth: Date;
  sex: string;
  address: string;
  telf: string;
}
