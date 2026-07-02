import {
  readProducts,
  validateProductPayload,
  writeProducts,
} from "@/lib/products-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await readProducts();
    return Response.json(products, { status: 200 });
  } catch {
    return Response.json(
      { message: "Failed to read products." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateProductPayload(body);

    if (!validation.isValid || !validation.product) {
      return Response.json(
        { message: "Validation failed.", errors: validation.errors },
        { status: 400 },
      );
    }

    const products = await readProducts();

    if (products.some((product) => product.id === validation.product?.id)) {
      return Response.json(
        { message: "A product with this id already exists." },
        { status: 409 },
      );
    }

    const nextProducts = [...products, validation.product];
    await writeProducts(nextProducts);

    return Response.json(validation.product, { status: 201 });
  } catch {
    return Response.json(
      { message: "Failed to create product." },
      { status: 500 },
    );
  }
}
