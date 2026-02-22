import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const whatsappNumber = "+254708877244";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 bg-green-500 text-white rounded-full p-4 shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-40"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={24} />
    </a>
  );
};

export default WhatsAppButton;