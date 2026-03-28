import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const CustomQRGenerator: React.FC = () => {
    const [link, setLink] = useState('');
    const [qrValue, setQrValue] = useState('');
    const [centerImage, setCenterImage] = useState<string>('/logo.png');
    const [usingCustomImage, setUsingCustomImage] = useState(false);
    const [qrSize, setQrSize] = useState<number>(256);
    const qrRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setCenterImage(result);
            setUsingCustomImage(true);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveCustomImage = () => {
        setCenterImage('/logo.png');
        setUsingCustomImage(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleGenerate = () => {
        if (!link.trim()) {
            toast.error('Please enter a valid link');
            return;
        }
        setQrValue(link.trim());
    };

    const handleDownload = () => {
        const qrContainer = qrRef.current;
        if (!qrContainer) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const qrSvg = qrContainer.querySelector('svg');
        if (!qrSvg) return;

        const exportSize = 512;
        const svgData = new XMLSerializer().serializeToString(qrSvg);
        const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8',
        });
        const svgUrl = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
            canvas.width = exportSize;
            canvas.height = exportSize;
            ctx.drawImage(img, 0, 0, exportSize, exportSize);
            URL.revokeObjectURL(svgUrl);

            const logo = new Image();
            logo.crossOrigin = 'anonymous';
            logo.onload = () => {
                const logoSize = 102;
                const logoX = (exportSize - logoSize) / 2;
                const logoY = (exportSize - logoSize) / 2;
                ctx.fillStyle = 'white';
                ctx.fillRect(
                    logoX - 10,
                    logoY - 10,
                    logoSize + 20,
                    logoSize + 20,
                );
                ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const downloadUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = 'custom_qr.png';
                        a.click();
                        URL.revokeObjectURL(downloadUrl);
                    }
                });
            };
            logo.src = centerImage;
        };
        img.src = svgUrl;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg"
        >
            <h2 className="mb-6 text-2xl font-bold text-gray-800">
                Generate QR Code
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        URL or Link
                    </label>
                    <input
                        type="text"
                        placeholder="https://your-link.com"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-black focus:border-[#902729]/75 focus:ring-2 focus:ring-[#902729]/75 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Center Image
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-[#902729]/65 hover:text-[#902729]/85"
                        >
                            {usingCustomImage
                                ? 'Replace image'
                                : 'Upload custom image'}
                        </button>
                        {usingCustomImage && (
                            <button
                                onClick={handleRemoveCustomImage}
                                className="rounded-lg bg-gray-100 px-3 py-3 text-sm text-gray-600 hover:bg-gray-200"
                            >
                                Use default
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>

                    {usingCustomImage && (
                        <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3"
                        >
                            <img
                                src={centerImage}
                                alt="Center image preview"
                                className="h-12 w-12 rounded-md border border-gray-200 bg-white object-contain"
                            />
                            <p className="text-sm font-medium text-green-700">
                                Custom image applied
                            </p>
                        </motion.div>
                    )}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        QR Code Size —{' '}
                        <span className="font-semibold text-[#902729]/85">
                            {qrSize}px
                        </span>
                    </label>
                    <input
                        type="range"
                        min={128}
                        max={512}
                        step={32}
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full accent-[#902729]/85"
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-400">
                        <span>128px</span>
                        <span>512px</span>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    className="w-full rounded-lg bg-[#902729]/85 py-3 font-medium text-white transition hover:bg-[#902729]/95 active:scale-95"
                >
                    Generate QR Code
                </button>
            </div>

            {qrValue && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 flex flex-col items-center gap-4"
                >
                    <div ref={qrRef}>
                        <QRCodeSVG
                            value={qrValue}
                            size={qrSize}
                            level="H"
                            imageSettings={{
                                src: centerImage,
                                height: Math.round(qrSize * 0.1875),
                                width: Math.round(qrSize * 0.1875),
                                excavate: true,
                            }}
                        />
                    </div>
                    <button
                        onClick={handleDownload}
                        className="w-full rounded-lg bg-green-600 py-3 font-medium text-white transition hover:bg-green-700 active:scale-95"
                    >
                        Download QR Code
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default CustomQRGenerator;
