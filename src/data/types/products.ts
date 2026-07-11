import type { Product as OriginalProduct } from "@/shared/types/types/product";

export type Product = OriginalProduct & {
  stock: number;
};
