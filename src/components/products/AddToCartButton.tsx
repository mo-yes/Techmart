import React from 'react'
import { Button } from '@/components/ui/button'
import { Box, Loader2} from 'lucide-react'

interface ViewProductButtonPros{
    isAddingToCart: boolean,
    handleAddToCart: () => void;
    productQuantity?: number;
}


export default function AddToCartButton({handleAddToCart, isAddingToCart, productQuantity}: ViewProductButtonPros) {
  return (
    <>          

      <Button
      onClick={handleAddToCart}
          className="w-full"
          size="sm"
          disabled={isAddingToCart || (productQuantity !== undefined && productQuantity <= 0)}
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Box className="h-4 w-4 mr-2" />
          )}
          {productQuantity !== undefined && productQuantity <= 0 ? 'Out of stock' : 'Add to Cart'}
        </Button>
    </>
  )
}
