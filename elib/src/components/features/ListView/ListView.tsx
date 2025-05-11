import React from 'react';
import { cn } from '../../../lib/cn';

type Props = {
  items: { id: number; name: string }[];
  selectedId?: number;
  onItemClick: (id: number) => void;
};

export const ListView = ({
  items,
  selectedId,
  onItemClick,
}: Props): React.JSX.Element => {
  const handleItemClick = (id: number) => {
    onItemClick(id);
  };

  return (
    <>
      <ul className="flex flex-col gap-2 p-1">
        {items?.map(item => (
          <li
            className={cn(
              'w-full text-justify overflow-ellipsis hover:bg-gray',
              {
                'bg-gray': selectedId && selectedId === item.id,
              },
            )}
            key={item.id}
            onClick={() => handleItemClick(item.id)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </>
  );
};
