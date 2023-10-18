import { useState } from 'react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import { classNames } from '../utils.js';


interface Item {
  label: string;
  secondary: string;
}

interface SelectWithSecondaryProps {
  items: Item[];
  label: string;
}


export default function SelectWithSecondary({items, label}: SelectWithSecondaryProps) {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  console.log(selectedItem)
  const filteredItems =
    query === ''
      ? items
      : items.filter(person => {
          return person.label.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedItem} onChange={setSelectedItem}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-400 text-left">{label}</Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
          displayValue={(person: any) => person?.label}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredItems.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map(person => (
              <Combobox.Option
                key={person.secondary}
                value={person}
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
                      <span className={classNames('truncate', selected && 'font-semibold')}>{person.label}</span>
                      <span
                        className={classNames(
                          'ml-2 truncate text-gray-500',
                          active ? 'text-indigo-200' : 'text-gray-500',
                        )}
                      >
                        {person.secondary}
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
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}


