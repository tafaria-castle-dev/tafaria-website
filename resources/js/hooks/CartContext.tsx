import { ImageGift } from '@/types';
import React, { createContext, ReactNode, useState } from 'react';

interface CartItem extends ImageGift {
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: ImageGift) => void;
    removeFromCart: (item: ImageGift) => void;
    getItemQuantity: (id: string) => number;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    handleSendToWhatsApp: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined,
);

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Get item quantity
    const getItemQuantity = (id: string): number => {
        return cart.find((item) => item.id === id)?.quantity || 0;
    };

    const addToCart = (item: ImageGift) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem.id === item.id,
            );
            if (existingItem) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem,
                );
            } else {
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };

    // Decrease quantity or remove item
    const removeFromCart = (item: ImageGift) => {
        // Ensure it accepts GiftShop, not just id
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem.id === item.id,
            );
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map((cartItem) =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem,
                );
            } else {
                return prevCart.filter((cartItem) => cartItem.id !== item.id);
            }
        });
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    // Get total price
    const getTotalPrice = () => {
        return cart.reduce(
            (total, item) =>
                total + (item?.giftShop?.amount || 0) * item.quantity,
            0,
        );
    };

    // Generate WhatsApp message with cart items
    const handleSendToWhatsApp = () => {
        if (cart.length === 0) return alert('Your cart is empty!');

        const message = cart
            .map(
                (item) =>
                    `${item.title} (x${item.quantity}) - Kes ${(item?.giftShop?.amount || 0) * item.quantity}`,
            )
            .join('\n');

        const totalPrice = getTotalPrice();
        const whatsappMessage = `Hello, I would like to order:\n\n${message}\n\nTotal: Kes ${totalPrice}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(
            `https://wa.me/+254708877244?text=${encodedMessage}`,
            '_blank',
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                getItemQuantity,
                getTotalItems,
                getTotalPrice,
                handleSendToWhatsApp,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
