const Navbar = () => {
    return (
        <div className="flex h-screen flex-col">
            <div className="flex-shrink-0 overflow-y-auto bg-gray-800 p-4 text-white">
                <h1 className="text-xl font-bold">My Application</h1>
                <p className="mt-2">Scrollable content goes here...</p>
                <div className="mt-4 space-y-2">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className="rounded bg-gray-700 p-2">
                            Item {i + 1}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-shrink-0 bg-gray-900 p-4 text-white">
                <div className="flex justify-around">
                    <a
                        href="#"
                        className="flex-1 rounded py-2 text-center hover:bg-gray-700"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="flex-1 rounded py-2 text-center hover:bg-gray-700"
                    >
                        Categories
                    </a>
                    <a
                        href="#"
                        className="flex-1 rounded py-2 text-center hover:bg-gray-700"
                    >
                        Profile
                    </a>
                    <a
                        href="#"
                        className="flex-1 rounded py-2 text-center hover:bg-gray-700"
                    >
                        Settings
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
