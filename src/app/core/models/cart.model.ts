export interface CartProduct {
  productId: number;
  productName: string;
  price: number;
  quant: number;
  img: string;
}

export interface CartProducts {
  products: CartProduct[];
  cartTotal: number;
}
