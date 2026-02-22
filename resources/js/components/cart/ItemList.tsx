import { useCart } from '@/hooks/hook/UseCart';
import { ImageGift } from '@/types';
import React from 'react';

interface ItemsListProps {
    items: ImageGift[] | undefined;
}

const ItemsList: React.FC<ItemsListProps> = ({ items }) => {
    const { addToCart, removeFromCart, getItemQuantity } = useCart(); // Get cart actions and quantity getter

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {items?.map((item) => {
                const quantity = getItemQuantity(item.id); // Get current quantity

                return (
                    <div key={item.id} className="rounded-lg border p-4">
                        <img
                            width={100}
                            height={100}
                            src={item.image_path || ''}
                            alt={item.title}
                            className="mb-2 w-full object-cover"
                        />
                        <h3 className="text-left text-lg font-bold text-black">
                            {item.title}
                        </h3>
                        <p className="text-left text-lg font-bold text-black">
                            Kes {item.giftShop?.amount}
                        </p>

                        {quantity > 0 ? (
                            <div className="mt-2 flex items-center space-x-2">
                                <button
                                    onClick={() => removeFromCart(item)} // Pass entire item
                                    className="rounded bg-red-500 px-3 py-1 text-white"
                                >
                                    -
                                </button>
                                <span className="text-lg font-bold text-black">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => addToCart(item)}
                                    className="rounded bg-green-500 px-3 py-1 text-white"
                                >
                                    +
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => addToCart(item)}
                                className="float-left mt-2 rounded bg-[#94723C] px-4 py-2 text-white"
                            >
                                Add to Cart
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ItemsList;
