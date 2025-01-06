'use client'

import { ProductForm } from './components/product-form'

export default function NewProductPage() {
  return (
    <div className="px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Novo Produto</h1>
        <p className="mt-2 text-muted-foreground">
          Cadastre um novo produto no sistema
        </p>
      </div>
      <ProductForm />
    </div>
  )
}
