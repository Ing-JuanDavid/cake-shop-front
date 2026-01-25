export interface Rate {
  rateId: number;
  userName: string;
  score: number;
  comment: string;
  creationDate: Date;
  productId: number;
  productName:string;
}

export interface RateModel {
  score: number;
  comment: string;
}
