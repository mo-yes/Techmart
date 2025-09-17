"use client"

import { Button, LoadingSpinner } from '@/components'
import AddToCartButton from '@/components/products/AddToCartButton'
import { Category } from '@/interfaces'
import { servicesApi } from '@/services'
import { SingleCategoryResponse } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

export default function CategoriesDetailsPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [singleCategory, setSingleCategory] = useState<Category | null>(null)

  async function fetchCategoryDetails() {
        setLoading(true)
    const data:SingleCategoryResponse = await servicesApi.getCategorieDetails(String(id))
    setLoading(false)
    setSingleCategory(data.data)
    }

  useEffect(() => {
    fetchCategoryDetails()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !singleCategory) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Category not found"}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-10">
      {/* Category Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white shadow-lg p-6 rounded-2xl">
        <div className="relative w-32 h-32 rounded-xl overflow-hidden shadow-md">
          {singleCategory.image ? (
            <Image
              src={singleCategory?.image}
              alt={singleCategory?.name}
              fill
              className="object-cover"
              sizes="128px"
            />
          ) : (
            <span className="text-4xl font-bold text-black uppercase flex items-center justify-center h-full w-full">
              {singleCategory?.name || "C"}
            </span>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900">
            {singleCategory.name}
          </h1>
          {singleCategory.slug && (
            <p className="mt-3 text-gray-600 text-lg">
              Discover Amazing Products From{" "}
              <span className="font-semibold text-blue-600">
                {singleCategory.slug.toUpperCase()}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Category Card */}
      <div className="max-w-md mx-auto">
        <article
          key={singleCategory._id}
          className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col overflow-hidden"
        >
          <div className="relative w-full aspect-[4/3] bg-gray-50">
            <Image
              src={singleCategory.image}
              alt={singleCategory.name}
              fill
              className="object-cover object-fill transition-transform duration-300 group-hover:scale-105"
              sizes="(min-width: 768px) 400px, 100vw"
            />
          </div>

          <div className="flex flex-col p-5">
            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
              {singleCategory.name}
            </h2>
            <Link href={`/products/${singleCategory._id}`}>
              <p className="text-sm text-gray-500 mb-3">
                {singleCategory.slug}
              </p>
            </Link>
            <div className="flex justify-center md:justify-start">
              <AddToCartButton handleAddToCart={() => handleAddToCart(singleCategory._id)} />
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
