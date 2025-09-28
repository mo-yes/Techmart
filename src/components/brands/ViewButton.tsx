import React from 'react'
import { Button } from '../ui'
import { Box, Loader2 } from 'lucide-react'
import { Brand } from '@/interfaces'
import Link from 'next/link'

interface ViewProductButtonProps {
  viewProduct: boolean
  handleViewProduct: () => void
  brand: Brand
}

export default function ViewButton({ handleViewProduct, viewProduct , brand}: ViewProductButtonProps) {
  return (
    <Link href={`/brands/${brand?._id}`}>
    <Button
      onClick={handleViewProduct}
      className="w-full"
      size="sm"
    >
      {viewProduct && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
      <Box className="h-4 w-4 mr-2" />
      View Products
    </Button>
    </Link>
  )
};