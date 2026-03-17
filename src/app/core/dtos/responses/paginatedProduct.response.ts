import { Product } from "../../models/product.model";

export interface PaginatedResponse<T> {
  currentPage: number;
  pageLength: number;
  nextPage: number;
  totalPages: number;
  totalElements: number;
  data: T[];
}
