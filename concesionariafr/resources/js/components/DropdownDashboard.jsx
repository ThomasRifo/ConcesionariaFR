import { useState } from 'react';
import { route } from '@inertiajs/react';

const DropdownDashboard = ({ title, routes, children }) => {
    const isActive = routes.some((routeName) => route().current(routeName));

    return (
        <div className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300">
            <Dropdown className="h-full w-full">
                <Dropdown.Trigger className={`w-full h-full ${isActive ? 'border-b-2 border-indigo-400 text-gray-900 focus:border-indigo-700' : ''}`}>
                    <span className="inline-flex rounded-md w-full h-full">
                        <button
                            type="button"
                            className="w-full h-full inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                        >
                            {title}
                        </button>
                    </span>
                </Dropdown.Trigger>
                {children}
            </Dropdown>
        </div>
    );
};

export default DropdownDashboard;