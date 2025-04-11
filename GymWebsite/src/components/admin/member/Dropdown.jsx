import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Dropdown({ onSelect, selectedOption }) {
  const [selectedType, setSelectedType] = useState('Select an option');
  useEffect(() => {
    setSelectedType(selectedOption);
  }, [selectedOption]);

  const handleMenuItemClick = (option, typeId) => {
    setSelectedType(option);
    onSelect(typeId); 
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center">
        <input
          type="text"
          value={selectedType}
          readOnly
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-s-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex items-center gap-x-1 rounded-s-none rounded-e-lg bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-600">
              <ChevronDown className="-mr-1 h-7 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>
          </div>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => handleMenuItemClick('Basic', 1)}
                      className={classNames(
                        active ? 'bg-gray-400 text-gray-900' : 'text-gray-100',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Basic
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => handleMenuItemClick('Standard', 2)}
                      className={classNames(
                        active ? 'bg-gray-400 text-gray-900' : 'text-gray-100',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Standard
                    </a>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => handleMenuItemClick('Premium', 3)}
                      className={classNames(
                        active ? 'bg-gray-400 text-gray-700' : 'text-gray-100',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Premium
                    </a>
                  )}
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  );
}
