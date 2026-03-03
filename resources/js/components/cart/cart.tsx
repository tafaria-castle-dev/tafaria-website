// app/components/Cart.tsx

import { useCart } from '@/hooks/hook/UseCart';
import { ImageGift } from '@/types';
import React, { useEffect, useState } from 'react';
import ItemsList from '../cart/ItemList';
import CartDetails from '../cart/cartDetails'; // Import CartDetails

const Cart: React.FC = () => {
    const {
        cart,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        handleSendToWhatsApp,
    } = useCart();
    const [isLoading, setIsloading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState<ImageGift[]>([]);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response: any = await fetch(
                    'https://website-cms.tafaria.com/api/image-gifts',
                );
                setData(response.data);
            } catch (error: any) {
                setError(error.toString());
            }
        };
        fetchCartItems();
    }, []);
    if (isLoading) return <p>Loading cart items...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={`p-4`}>
            <ItemsList items={data} />

            <CartDetails
                cart={cart}
                removeFromCart={removeFromCart}
                getTotalItems={getTotalItems}
                getTotalPrice={getTotalPrice}
                handleSendToWhatsApp={handleSendToWhatsApp}
            />
        </div>
    );
};

export default Cart;
