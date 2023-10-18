import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { classNames } from '../utils.js';
import { CompleteAddress } from '@aztec/aztec.js';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { pxe } from '../../config.js';


const developerWalletNames = ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy'];

interface SelectWithSecondaryProps {
  onWalletChange: (wallet: CompleteAddress) => void;
}

export function useWallets(): UseQueryResult<CompleteAddress[]> {
  return useQuery({
      queryKey: ['getRegisteredAccounts'],
      queryFn: () => pxe.getRegisteredAccounts()
  });
}


export default function SelectWallet({onWalletChange}: SelectWithSecondaryProps) {
  const { data } = useWallets();
  const [selectedItem, setSelectedItem] = useState<CompleteAddress | null>(null);

  const nameForWallet = (selectedAddress: CompleteAddress | null) => {
    if (!selectedAddress || !data)
      return "";
    const index = data.findIndex((item) => item == selectedAddress)
    return developerWalletNames[index]
  }

  const onItemSelect = (selectedItem: CompleteAddress) => {
    setSelectedItem(selectedItem);
    onWalletChange(selectedItem);
  }

  useEffect(() => {
    if (!selectedItem && data && data.length > 0) {
      onItemSelect(data[0]);
    }
  }, [data]);

  return (
    <Listbox as="div" value={selectedItem} onChange={onItemSelect}>
      <div className="relative mt-2">
        <Listbox.Button className="text-left w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <span className="truncate">{nameForWallet(selectedItem)}</span>
          <span className="ml-2 truncate text-gray-500">{selectedItem?.address.toShortString()}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {(data || []).map((item, index) => (
            <Listbox.Option
              key={item.address.toString()}
              value={item}
              className={({ active }: { active: boolean }) =>
                classNames(
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                  active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                )
              }
            >
              {({ active, selected }: any) => (
                <>
                  <div className="flex">
                    <span className={classNames('truncate', selected && 'font-semibold')}>{developerWalletNames[index]}</span>
                    <span
                      className={classNames(
                        'ml-2 truncate text-gray-500',
                        active ? 'text-indigo-200' : 'text-gray-500',
                      )}
                    >
                      {item.address.toShortString()}
                    </span>
                  </div>

                  {selected && (
                    <span
                      className={classNames(
                        'absolute inset-y-0 right-0 flex items-center pr-4',
                        active ? 'text-white' : 'text-indigo-600',
                      )}
                    >
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
