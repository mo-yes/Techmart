import React from 'react'
import { Button } from '../ui'
import { Box, Loader2} from 'lucide-react'
import Link from 'next/link';
import { Brand } from '@/interfaces';

interface ViewProductButtonPros{
    viewProduct:boolean,
    viewMode:string | boolean,
    brand:Brand,
    fetchBrandDetails: ()=> void;
}


export default function ViewButton({ fetchBrandDetails,viewProduct  , brand }:ViewProductButtonPros) {
return (
    <>          
    <Link href={`/brands/${brand?._id}`}>
    <Button
        onClick={fetchBrandDetails}
        className="w-full" 
        size="sm"
        >
        {viewProduct && <Loader2 className="animate-spin" />}
        <Box className="h-4 w-4 mr-2" />
        View Products
        </Button>
    </Link>
    </>
)
}
