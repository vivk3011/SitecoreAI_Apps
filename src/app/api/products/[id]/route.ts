import {
  readProducts,
  validateProductPayload,
  writeProducts,
} from "@/lib/products-store";

export const runtime = "nodejs";

interface ProductRouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const products = await readProducts();
    const product = products.find((item) => item.id === id);

    if (!product) {
      return Response.json({ message: "Product not found." }, { status: 404 });
    }

    return Response.json(product, { status: 200 });
  } catch {
    return Response.json(
      { message: "Failed to fetch product." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validation = validateProductPayload(body);

    if (!validation.isValid || !validation.product) {
      return Response.json(
        { message: "Validation failed.", errors: validation.errors },
        { status: 400 },
      );
    }

    if (validation.product.id !== id) {
      return Response.json(
        { message: "Product id in URL and payload must match." },
        { status: 400 },
      );
    }

    const products = await readProducts();
    const targetIndex = products.findIndex((item) => item.id === id);

    if (targetIndex < 0) {
      return Response.json({ message: "Product not found." }, { status: 404 });
    }

    products[targetIndex] = validation.product;
    await writeProducts(products);

    return Response.json(validation.product, { status: 200 });
  } catch {
    return Response.json(
      { message: "Failed to update product." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  try {
    const { id } = await context.params;
    const products = await readProducts();
    const targetIndex = products.findIndex((item) => item.id === id);

    if (targetIndex < 0) {
      return Response.json({ message: "Product not found." }, { status: 404 });
    }

    const deletedProduct = products[targetIndex];
    const remainingProducts = products.filter((item) => item.id !== id);
    await writeProducts(remainingProducts);

    return Response.json(
      { message: "Product deleted.", product: deletedProduct },
      { status: 200 },
    );
  } catch {
    return Response.json(
      { message: "Failed to delete product." },
      { status: 500 },
    );
  }
}
