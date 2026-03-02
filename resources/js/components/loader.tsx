const LoadingComponent: React.FC = () => (
    <div className="fixed top-[70px] right-0 bottom-0 left-0 z-40 flex flex-col items-center justify-center bg-white">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-[#94723C]"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">
            Once Upon a Dream...
        </p>
    </div>
);
export default LoadingComponent;
