// app/components/CartDetails.tsx
import { ImageGift } from '@/types';
import React from 'react';
import { IoIosRemoveCircle } from 'react-icons/io';

interface CartDetailsProps {
    cart: ImageGift[];
    removeFromCart: (item: ImageGift) => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    handleSendToWhatsApp: () => void;
}

const CartDetails: React.FC<CartDetailsProps> = ({
    cart,
    removeFromCart,
    getTotalItems,
    getTotalPrice,
    handleSendToWhatsApp,
}) => {
    return (
        <div className={`p-4`}>
            <div className="flex flex-col space-y-4 text-black">
                {cart.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center rounded-lg border p-4"
                    >
                        <img
                            src={item?.image_path}
                            alt={item.title}
                            className="mr-4 h-16 w-16 object-cover"
                            width={100}
                            height={100}
                        />
                        <div className="flex-1">
                            <h3 className="text-left text-lg font-bold">
                                {item.title}
                            </h3>
                            <h2 className="text-left">{item.description}</h2>
                            <p className="text-left text-sm">
                                Quantity: {item.quantity}
                            </p>
                        </div>
                        <p className="text-lg font-bold">
                            Kes{' '}
                            {(
                                item.giftShop?.amount ||
                                0 * (item.quantity || 1)
                            ).toFixed(2)}
                        </p>
                        <button
                            onClick={() => removeFromCart(item)}
                            className="ml-4 rounded-full bg-red-500 px-4 py-2 text-white"
                        >
                            <IoIosRemoveCircle />
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-black">
                <h2 className="text-xl font-bold">Summary</h2>
                <p>Total Items: {getTotalItems()}</p>
                <p>Total Price: Kes {getTotalPrice().toFixed(2)}</p>
                <button
                    className="mt-2 rounded bg-green-500 px-4 py-2 text-white"
                    onClick={handleSendToWhatsApp}
                >
                    Make Order
                </button>
            </div>
        </div>
    );
};

export default CartDetails;
