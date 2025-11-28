import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ComponentRegistryEntry } from '@/lib/types';

interface SelectControlProps {
  label: string;
  value: string | null;
  options: ComponentRegistryEntry[];
  onChange: (value: string | null) => void;
  nullable?: boolean;
}

export default function SelectControl({
  label,
  value,
  options,
  onChange,
  nullable = false,
}: SelectControlProps) {
  // Find the selected option to display its label
  const selectedOption = options.find((opt) => opt.id === value);
  const displayValue = selectedOption?.label || (nullable ? 'None' : 'Select...');

  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Label className="block text-sm font-semibold text-gray-800 mb-2">
            {label}
          </Listbox.Label>
          <Listbox.Button className="relative w-full min-h-[44px] cursor-pointer rounded-xl bg-white py-3 pl-4 pr-12 text-left shadow-md border-2 border-transparent transition-all duration-250 hover:border-halloween-orange-300 hover:shadow-lg focus:outline-none focus-visible:border-halloween-orange-500 focus-visible:ring-2 focus-visible:ring-halloween-orange-200 focus-visible:ring-offset-2 text-base font-medium text-gray-900">
            <span className="block truncate">{displayValue}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-6 w-6 text-halloween-orange-500 transition-transform duration-250"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-2xl ring-2 ring-halloween-orange-200 focus:outline-none">
              {nullable && (
                <Listbox.Option
                  value={null}
                  className={({ active }) =>
                    `relative cursor-pointer select-none min-h-[44px] py-3 pl-12 pr-4 transition-colors duration-150 ${
                      active ? 'bg-gradient-to-r from-halloween-orange-100 to-halloween-purple-100 text-gray-900' : 'text-gray-700'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        None
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-halloween-orange-600">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              )}
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option.id}
                  className={({ active }) =>
                    `relative cursor-pointer select-none min-h-[44px] py-3 pl-12 pr-4 transition-colors duration-150 ${
                      active ? 'bg-gradient-to-r from-halloween-orange-100 to-halloween-purple-100 text-gray-900' : 'text-gray-700'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-halloween-orange-600">
                          <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
