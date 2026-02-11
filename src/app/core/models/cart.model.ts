export interface CartProduct {
  productId: number;
  name: string;
  price: number;
  quant: number;
  stock: number;
  img: string;
}

export interface CartProducts {
  products: CartProduct[];
  cartTotal: number;
}
