import React from 'react';
import { cn } from '../../../lib/cn';

type Props = {
  items: { id: number; name: string }[];
  selectedId?: number;
  onItemClick: (id: number) => void;
  handleDeleteItem: (id: number) => void;
};

export const ListView = ({
  items,
  selectedId,
  onItemClick,
  handleDeleteItem,
}: Props): React.JSX.Element => {
  const handleItemClick = (id: number) => {
    onItemClick(id);
  };
  console.log('rerender ListView', items);

  return (
    <>
      <ul className="flex flex-col gap-2 p-1">
        {items?.map(item => (
          <li
            className={cn(
              'w-full flex justify-between text-justify overflow-ellipsis border border-main p-2 rounded hover:bg-gray hover:border hover:border-dark',
              {
                'bg-gray': selectedId && selectedId === item.id,
              },
            )}
            key={item.id}
            onClick={() => handleItemClick(item.id)}
          >
            {item.name}
            <button
              onClick={() => {
                handleDeleteItem(item.id);
              }}
              className="text-red-500 hover:text-red-700 "
            >
              x
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
