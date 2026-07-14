import { NextRequest } from "next/server";
import { z } from "zod";
import data from "./data.json";
import { Product } from "@/data/types/product";

const PAGE_SIZE = 6;

const sortComparators: Record<string, (a: Product, b: Product) => number> = {
  price_asc: (a, b) => a.price - b.price,
  price_desc: (a, b) => b.price - a.price,
  rating_desc: (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filterSchema = z.object({
    categoria: z.string().optional(),
    preco_min: z.coerce.number().optional(),
    preco_max: z.coerce.number().optional(),
    rating_min: z.coerce.number().optional(),
    sort: z
      .enum(["relevancia", "price_asc", "price_desc", "rating_desc"])
      .optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
  });

  const { categoria, preco_max, preco_min, rating_min, sort, page } =
    filterSchema.parse(Object.fromEntries(searchParams));

  let filteredProducts = data.products;

  if (categoria) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLocaleLowerCase() === categoria.toLocaleLowerCase(),
    );
  }

  if (preco_min) {
    filteredProducts = filteredProducts.filter((p) => p.price >= preco_min);
  }

  if (preco_max) {
    filteredProducts = filteredProducts.filter((p) => p.price <= preco_max);
  }

  if (rating_min) {
    filteredProducts = filteredProducts.filter(
      (p) => p.rating.rate >= rating_min,
    );
  }

  if (sort && sort in sortComparators) {
    filteredProducts = [...filteredProducts].sort(sortComparators[sort]);
  }

  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginatedProducts = filteredProducts.slice(start, start + PAGE_SIZE);

  return Response.json({
    products: paginatedProducts,
    page,
    totalPages,
    total,
  });
}
