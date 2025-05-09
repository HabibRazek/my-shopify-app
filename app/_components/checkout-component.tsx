'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CheckoutModal from '@/components/CheckoutModal';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useCart();

    if (cart.length === 0) {
        router.push('/products');
        return null;
    }

    const handleClose = () => {
        router.back();
    };

    return (
        <CheckoutModal 
            isOpen={true} 
            onClose={handleClose}
            onError={(error: string) => {
                toast.error(error);
            }}
        />
    );
}