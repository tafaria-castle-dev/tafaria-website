import { useEffect } from "react";

declare global {
  interface Window {
    displayBookNow?: (config: {
      siteId: number;
      elementId: string;
      key: string;
      autoSearch: boolean;
      singleProperty: boolean;
    }) => void;
  }
}

export default function BookNow() {
  useEffect(() => {
    // Add JavaScript dynamically
    const script = document.createElement("script");
    script.src = "https://nebulacrs.hti.app/hostech/booknow/static/js/booknow.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      if (typeof window.displayBookNow === "function") {
        window.displayBookNow({
          siteId: 35,
          elementId: "booknow",
          key: "-LfPKryEQVpcfp-acr6J",
          autoSearch: true,
          singleProperty: true,
        });
      } else {
        console.error("displayBookNow function not found!");
      }
    };

    // Add CSS dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://nebulacrs.hti.app/hostech/booknow/static/css/booknow.css";
    link.type = "text/css";

    document.head.appendChild(link);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return <div id="booknow"> Book</div>;
}
