import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Loader2 } from 'lucide-react';

interface AddToCartButtonProps {
  productQuantity?: number;     
  handleAddToCart: () => Promise<void>;
  isAddingToCart?: boolean;      
}



export default function AddToCartButton({ handleAddToCart, productQuantity }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const onClick = async () => {
    setIsAdding(true);
    await handleAddToCart();
    setIsAdding(false);
  };

  return (
    <Button
      onClick={onClick}
      className="w-full"
      size="sm"
      disabled={isAdding || (productQuantity !== undefined && productQuantity <= 0)}
    >
      {isAdding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Box className="h-4 w-4 mr-2" />}
      {productQuantity !== undefined && productQuantity <= 0 ? 'Out of stock' : 'Add to Cart'}
    </Button>
  );
}
