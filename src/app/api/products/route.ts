import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import data from "./data.json";

function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

const searchParamsSchema = z.object({
  q: z.string().optional(),
  categoria: z.string().optional(),
  preco_min: z.coerce.number().optional(),
  preco_max: z.coerce.number().optional(),
  rating_min: z.coerce.number().optional(),
  sort: z.string().optional(),
  page: z.coerce.number().min(1).optional().default(1),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { q, categoria, preco_min, preco_max, rating_min, sort, page } =
      searchParamsSchema.parse(Object.fromEntries(searchParams));

    let products = data.products;

    // Filtering
    if (q) {
      const normalizedQuery = normalizeString(q);
      products = products.filter(
        (product) =>
          normalizeString(product.title).includes(normalizedQuery) ||
          normalizeString(product.description).includes(normalizedQuery),
      );
    }

    if (categoria) {
      products = products.filter(
        (product) =>
          product.category.toLocaleLowerCase() ===
          categoria.toLocaleLowerCase(),
      );
    }

    if (preco_min) {
      products = products.filter((product) => product.price >= preco_min);
    }

    if (preco_max) {
      products = products.filter((product) => product.price <= preco_max);
    }

    if (rating_min) {
      products = products.filter(
        (product) => product.rating && product.rating.rate >= rating_min,
      );
    }

    // Sorting
    if (sort) {
      switch (sort) {
        case "price_asc":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          products.sort((a, b) => b.price - a.price);
          break;
        case "rating_desc":
          products.sort(
            (a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0),
          );
          break;
      }
    }

    // Pagination
    const PAGE_SIZE = 9;
    const total = products.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);
    const paginatedProducts = products.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE,
    );

    return NextResponse.json({
      products: paginatedProducts,
      page,
      totalPages,
      total,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.flatten(), { status: 400 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
