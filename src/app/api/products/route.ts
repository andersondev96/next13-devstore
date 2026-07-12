import { NextRequest } from "next/server";
import { z } from "zod";
import data from "./data.json";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const filterSchema = z.object({
    categoria: z.string().optional(),
    marca: z.string().optional(),
    disponibilidade: z.string().optional(),
    preco_min: z.coerce.number().optional(),
    preco_max: z.coerce.number().optional(),
    rating_min: z.coerce.number().optional(),
  });

  const {
    categoria,
    marca,
    disponibilidade,
    preco_max,
    preco_min,
    rating_min,
  } = filterSchema.parse(Object.fromEntries(searchParams));

  let filteredProducts = data.products;

  if (categoria) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLocaleLowerCase() === categoria.toLocaleLowerCase(),
    );
  }

  if (marca) {
    filteredProducts = filteredProducts.filter(
      (p) => p.brand.toLocaleLowerCase() === marca.toLocaleLowerCase(),
    );
  }

  if (disponibilidade) {
    if (disponibilidade === "disponivel") {
      filteredProducts = filteredProducts.filter((p) => p.stock > 0);
    } else if (disponibilidade === "esgotado") {
      filteredProducts = filteredProducts.filter((p) => p.stock <= 0);
    }
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

  return Response.json(filteredProducts);
}
