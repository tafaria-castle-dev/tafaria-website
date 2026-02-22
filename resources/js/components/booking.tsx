import { useEffect } from 'react';

const BookingEngine = () => {
    useEffect(() => {
        if (!document.getElementById('siteminder-script')) {
            const script = document.createElement('script');
            script.src = '//widget.siteminder.com/ibe.min.js';
            script.id = 'siteminder-script';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);

    return (
        <div
            className="ibe"
            data-widget="embed"
            data-mobile_fullscreen={false}
        ></div>
    );
};

export default BookingEngine;
