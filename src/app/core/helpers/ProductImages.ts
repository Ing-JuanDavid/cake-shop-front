import { ProductImage } from "../models/productImage.model";

export function getMainImage(images: ProductImage[]): ProductImage | null {
  if (images.length == 0) {
    return null;
  }

  return images.find((i) => i.isMain) ?? null;
}
