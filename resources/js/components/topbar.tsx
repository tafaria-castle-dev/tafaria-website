import { useCart } from '@/hooks/hook/UseCart';
import { useState } from 'react';
import { FaAngleLeft, FaGift } from 'react-icons/fa';
import { PiCastleTurretFill } from 'react-icons/pi';
import CartDetails from './cart/cartDetails';
// import { useToC } from "../context/ToCContext";
import { useNavigation } from '@/hooks/NavigationContext';
import useScrollDirection from '@/hooks/hook/useScrollDirection';
import { router } from '@inertiajs/react';
// Configure font

const TopBar = ({ title }: { title: string }) => {
    const { history, goBack } = useNavigation();
    const {
        cart,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        handleSendToWhatsApp,
    } = useCart();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBackClick = () => {
        if (history.length > 0) {
            goBack();
            window.history.back();
        } else {
            router.get('/');
        }
    };

    const handleHome = () => {
        router.get('/');
    };

    // const { isOpen, setIsOpen } = useToC();
    const isScrollingUp = useScrollDirection();

    return (
        <div
            className={`flex w-full transition-opacity duration-300 ease-in-out ${
                isScrollingUp ? `opacity-100` : `opacity-0`
            }`}
        >
            <div
                className={`fixed z-10 mx-auto flex w-full items-center border-b-2 border-[#902729] bg-white px-4 py-4 text-center text-xl font-semibold tracking-tight text-[#902729] capitalize`}
            >
                <div
                    className={`container mx-auto flex items-center justify-between`}
                >
                    <a
                        onClick={handleBackClick}
                        className="cursor-pointer text-[#94723C] hover:underline"
                    >
                        <FaAngleLeft className="mr-2" />
                    </a>
                    <a
                        onClick={handleHome}
                        className="cursor-pointer text-[#94723C] hover:underline"
                    >
                        <PiCastleTurretFill className="mr-2 text-2xl" />
                    </a>
                    {title}
                    {/* <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-50% left-14 z-50 p-2 bg-[#902729] text-white rounded-md opacity-0"
          aria-label={
            isOpen ? "Close Table of Contents" : "Open Table of Contents"
          }
        >
          {isOpen ? (
            <X className="w-6 h-6 text-[#fff]" />
          ) : (
            <Menu className="w-6 h-6 text-[#fff]" />
          )}
        </button> */}
                    {title === 'Gift Shop' && (
                        <button
                            className="relative ml-5 rounded-full bg-gray-200 px-4 py-2"
                            onClick={() => setIsModalOpen(true)} // Open modal
                        >
                            <FaGift />
                            {getTotalItems() > 0 && (
                                <span className="absolute top-0 right-0 rounded-full bg-red-500 px-2 text-xs text-white">
                                    {getTotalItems()}
                                </span>
                            )}
                        </button>
                    )}
                    <div className="m-auto flex justify-center space-x-4"></div>
                </div>
            </div>
            {/* Modal for showing Cart Details */}
            {isModalOpen && (
                <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
                    <div className="relative h-full w-full max-w-lg rounded-lg bg-white p-6 shadow-lg sm:h-auto sm:w-[90vw] md:w-[60vw] lg:w-[50vw]">
                        <h3 className="mb-4 text-center text-lg font-semibold text-black">
                            Your Cart
                        </h3>
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)} // Close modal
                        >
                            ✕
                        </button>

                        {/* Show Cart Details in Modal */}
                        <CartDetails
                            cart={cart}
                            removeFromCart={removeFromCart}
                            getTotalItems={getTotalItems}
                            getTotalPrice={getTotalPrice}
                            handleSendToWhatsApp={handleSendToWhatsApp}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopBar;
