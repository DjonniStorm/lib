import React from 'react';
import { ProductCardProps } from './ProductCard.props';
import { cn } from '../../../lib/cn';
import { Link } from 'react-router-dom';
import { Button } from '../../ui/Button';

export const ProductCard = ({
  name,
  image,
  link,
  icon,
}: ProductCardProps): React.JSX.Element => {
  return (
    <>
      <div className="flex flex-col justify-between border-2 border-gray-300 overflow-hidden shadow-lg h-[380px] w-[250px] bg-gray-300 rounded-lg">
        <div className="rounded-t-lg h-[300px] overflow-hidden bg-gray-300 flex justify-center items-center">
          <img
            className="object-contain w-full h-full p-4"
            src={image}
            alt={`${name} image`}
            loading="lazy"
          />
        </div>
        <div className="flex-1 px-5 flex justify-between items-center bg-gray-300">
          <span className="block text-xl overflow-hidden text-ellipsis max-w-[80%]">
            {name}
          </span>
          <Button
            className={cn(
              'bg-gray-300 rounded-xl border border-gray-900 cursor-pointer p-2 transition hover:bg-gray-700 active:bg-gray-700',
            )}
          >
            <Link to={link}>
              <img
                src={icon}
                className="w-[40px] h-[40px]"
                alt="add icon"
                loading="lazy"
              />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};
