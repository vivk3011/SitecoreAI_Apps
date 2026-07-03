"use client";

import { useEffect, useMemo, useState } from "react";

import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ProductForm } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import type { Product } from "@/types/product";

type FormMode = "add" | "edit";
const SESSION_PRODUCTS_KEY = "productCrudApp.sessionProducts";

function readSessionProducts(): Product[] | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SESSION_PRODUCTS_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Product[]) : null;
  } catch {
    return null;
  }
}

function writeSessionProducts(products: Product[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_PRODUCTS_KEY, JSON.stringify(products));
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [activeFormMode, setActiveFormMode] = useState<FormMode | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.name.localeCompare(b.name)),
    [products],
  );

  async function loadProducts() {
    try {
      const sessionProducts = readSessionProducts();
      if (sessionProducts) {
        setProducts(sessionProducts);
        setErrorMessage(null);
        return;
      }

      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Unable to fetch products.");
      }

      const data = (await response.json()) as Product[];
      setProducts(data);
      writeSessionProducts(data);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load products.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProducts();
  }, []);

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const openAddForm = () => {
    resetMessages();
    setSelectedProduct(undefined);
    setActiveFormMode("add");
  };

  const openEditForm = (product: Product) => {
    resetMessages();
    setSelectedProduct(product);
    setActiveFormMode("edit");
  };

  const closeForm = () => {
    setActiveFormMode(null);
    setSelectedProduct(undefined);
  };

  const createProduct = async (newProduct: Product) => {
    try {
      setIsMutating(true);
      resetMessages();

      if (products.some((product) => product.id === newProduct.id)) {
        throw new Error("A product with this id already exists.");
      }

      const nextProducts = [...products, newProduct];
      setProducts(nextProducts);
      writeSessionProducts(nextProducts);
      setSuccessMessage("Product created successfully.");
      closeForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create product.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
      setIsMutating(true);
      resetMessages();

      if (!products.some((product) => product.id === updatedProduct.id)) {
        throw new Error("Product not found.");
      }

      const nextProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product,
      );

      setProducts(nextProducts);
      writeSessionProducts(nextProducts);
      setSuccessMessage("Product updated successfully.");
      closeForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update product.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  const requestDeleteProduct = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) {
      return;
    }

    setProductPendingDelete(product);
  };

  const closeDeleteDialog = () => {
    if (!isMutating) {
      setProductPendingDelete(null);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!productPendingDelete) {
      return;
    }

    const id = productPendingDelete.id;

    try {
      setIsMutating(true);
      resetMessages();

      const nextProducts = products.filter((product) => product.id !== id);
      setProducts(nextProducts);
      writeSessionProducts(nextProducts);
      setSuccessMessage("Product deleted successfully.");
      setProductPendingDelete(null);

      if (selectedProduct?.id === id) {
        closeForm();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete product.",
      );
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-8 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Create, update, and delete products available in your store. 
              All changes are stored in session storage and will be lost when the page is refreshed.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            disabled={isMutating}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            Add Product
          </button>
        </header>

        {errorMessage && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        {activeFormMode && (
          <ProductForm
            key={`${activeFormMode}-${selectedProduct?.id ?? "new"}`}
            mode={activeFormMode}
            initialProduct={selectedProduct}
            onSubmit={activeFormMode === "add" ? createProduct : updateProduct}
            onCancel={closeForm}
            isSubmitting={isMutating}
          />
        )}

        {isLoading ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-600">
            Loading products...
          </div>
        ) : (
          <ProductList
            products={sortedProducts}
            onEdit={openEditForm}
            onDelete={requestDeleteProduct}
            isMutating={isMutating}
          />
        )}

        <ConfirmDialog
          isOpen={Boolean(productPendingDelete)}
          title="Delete Product"
          message={`Are you sure you want to delete ${productPendingDelete?.name ?? "this product"}? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isLoading={isMutating}
          onConfirm={confirmDeleteProduct}
          onCancel={closeDeleteDialog}
        />
      </main>
    </div>
  );
}
