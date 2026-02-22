import '../css/app.css';
import '../css/styles.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { Category, Metadata, Schemas } from './types';

import AppLayout from '@/layouts/app-layout';
import { Toaster } from 'react-hot-toast';
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        gtag_report_conversion: (url?: string) => boolean;
    }
}

window.gtag_report_conversion = function (url?: string) {
    const callback = () => {
        if (typeof url !== 'undefined') {
            window.location.href = url;
        }
    };
    window.gtag('event', 'conversion', {
        send_to: 'AW-993824301/2ThFCPrXsqIbEK2c8tkD',
        event_callback: callback,
    });
    return false;
};
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

interface GlobalPageProps {
    metadata: Metadata;
    categories?: Category[];
    schemas: Schemas;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const page = resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        );

        return page.then((module: any) => {
            if (module.default.layout === undefined) {
                module.default.layout = (
                    page: React.ReactNode & { props: GlobalPageProps },
                ) => {
                    const { metadata, categories, schemas } = page.props;

                    return (
                        <AppLayout
                            metadata={metadata}
                            categories={categories}
                            schemas={schemas}
                        >
                            {page}
                        </AppLayout>
                    );
                };
            }
            return module;
        });
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <App {...props} />
                <Toaster position="top-right" />
            </>,
        );
    },
    progress: false,
});
