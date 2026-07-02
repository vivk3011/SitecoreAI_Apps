import { promises as fs } from "node:fs";
import path from "node:path";

import type { Product, ProductPayload } from "@/types/product";

const productsFilePath = path.join(process.cwd(), "products.json");

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  product?: Product;
}

export async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(productsFilePath, "utf-8");
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed as Product[];
}

export async function writeProducts(products: Product[]): Promise<void> {
  await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
}

export function validateProductPayload(payload: unknown): ValidationResult {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { isValid: false, errors: ["Invalid request body."] };
  }

  const candidate = payload as Record<string, unknown>;

  const id = normalizeString(candidate.id);
  const name = normalizeString(candidate.name);
  const sku = normalizeString(candidate.sku);
  const imageUrl = normalizeString(candidate.imageUrl);
  const description = normalizeString(candidate.description);
  const category = normalizeString(candidate.category);
  const price = Number(candidate.price);

  if (!id) errors.push("id is required.");
  if (!name) errors.push("name is required.");
  if (!sku) errors.push("sku is required.");
  if (!imageUrl) errors.push("imageUrl is required.");
  if (!description) errors.push("description is required.");
  if (!category) errors.push("category is required.");

  if (!Number.isFinite(price) || price <= 0) {
    errors.push("price must be a positive number.");
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      errors.push("imageUrl must be a valid URL.");
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const product: ProductPayload = {
    id,
    name,
    sku,
    imageUrl,
    price,
    description,
    category,
  };

  return {
    isValid: true,
    errors: [],
    product,
  };
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}
