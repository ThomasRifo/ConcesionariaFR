import { route } from '@inertiajs/react';

const DropdownLinkDashboard = ({ routeName, children }) => {
    const isActive = route().current(routeName);

    return (
        <Dropdown.Link
            href={route(routeName)}
            className={`block w-full px-4 py-2 text-start text-sm leading-5 ${isActive ? 'border-b-2 bg-gray-200 text-gray-900 focus:border-indigo-700' : 'hover:bg-gray-100'}`}
        >
            {children}
        </Dropdown.Link>
    );
};

export default DropdownLinkDashboard;