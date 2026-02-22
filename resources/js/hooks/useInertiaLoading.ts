import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export const useInertiaLoading = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleFinish = () => setIsLoading(false);

        const removeStartListener = router.on('start', handleStart);
        const removeFinishListener = router.on('finish', handleFinish);

        return () => {
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    return isLoading;
};
