import Image from "next/image";

import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isMutating: boolean;
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  isMutating,
}: ProductCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-48 w-full">
        <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full" />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-zinc-900">{product.name}</h3>
          <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
            {product.category}
          </span>
        </div>

        <p className="text-sm text-zinc-600">{product.description}</p>

        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-zinc-900">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            SKU: {product.sku}
          </p>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => onEdit(product)}
            disabled={isMutating}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(product.id)}
            disabled={isMutating}
            className="rounded-md bg-rose-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
