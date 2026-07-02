import type { Product } from "@/types/product";

import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isMutating: boolean;
}

export function ProductList({
  products,
  onEdit,
  onDelete,
  isMutating,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        No products found. Add one to get started.
      </div>
    );
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          isMutating={isMutating}
        />
      ))}
    </section>
  );
}
