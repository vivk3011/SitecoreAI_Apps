"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { Product } from "@/types/product";

interface ProductFormProps {
  mode: "add" | "edit";
  initialProduct?: Product;
  onSubmit: (product: Product) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface ProductFormState {
  id: string;
  name: string;
  sku: string;
  imageUrl: string;
  price: string;
  description: string;
  category: string;
}

function toFormState(product?: Product): ProductFormState {
  return {
    id: product?.id ?? "",
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    imageUrl: product?.imageUrl ?? "",
    price: product?.price ? String(product.price) : "",
    description: product?.description ?? "",
    category: product?.category ?? "",
  };
}

export function ProductForm({
  mode,
  initialProduct,
  onSubmit,
  onCancel,
  isSubmitting,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormState>(() =>
    toFormState(initialProduct),
  );
  const [errors, setErrors] = useState<string[]>([]);

  const heading = useMemo(
    () => (mode === "add" ? "Add Product" : `Edit ${initialProduct?.name ?? "Product"}`),
    [initialProduct?.name, mode],
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors: string[] = [];
    const price = Number(formData.price);

    if (!formData.id.trim()) validationErrors.push("id is required.");
    if (!formData.name.trim()) validationErrors.push("name is required.");
    if (!formData.sku.trim()) validationErrors.push("sku is required.");
    if (!formData.imageUrl.trim()) validationErrors.push("imageUrl is required.");
    if (!formData.description.trim()) validationErrors.push("description is required.");
    if (!formData.category.trim()) validationErrors.push("category is required.");

    if (!Number.isFinite(price) || price <= 0) {
      validationErrors.push("price must be a positive number.");
    }

    if (formData.imageUrl.trim()) {
      try {
        new URL(formData.imageUrl);
      } catch {
        validationErrors.push("imageUrl must be a valid URL.");
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    await onSubmit({
      id: formData.id.trim(),
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      imageUrl: formData.imageUrl.trim(),
      price,
      description: formData.description.trim(),
      category: formData.category.trim(),
    });
  };

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-zinc-900">{heading}</h2>

      {errors.length > 0 && (
        <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {errors.join(" ")}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-zinc-700">
          Id
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            readOnly={mode === "edit"}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="prod-2001"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="Product name"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          SKU
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="SKU-123"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Price
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="99.99"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700 sm:col-span-2">
          Image URL
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="https://example.com/image.jpg"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700">
          Category
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="Audio"
          />
        </label>

        <label className="grid gap-1 text-sm text-zinc-700 sm:col-span-2">
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900"
            placeholder="Short product description"
          />
        </label>

        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {isSubmitting
              ? "Saving..."
              : mode === "add"
                ? "Create Product"
                : "Update Product"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
