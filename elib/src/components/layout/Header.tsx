import React, { use } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '/icon.svg';
import SearchIcon from '/images/icons/search.svg';
import AccountIcon from '/images/icons/account.svg';

export const Header = (): React.JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const pathname = useLocation().pathname;

  return (
    <header className="border-b flex justify-between">
      <Link to="/" className="">
        <img src={Icon} alt="Elib logo" />
      </Link>
      <section className="flex-grow flex justify-around md:justify-around lg:justify-between items-center gap-2 px-2">
        {pathname !== '/login' && pathname !== '/register' && (
          <>
            <form
              onSubmit={e => e.preventDefault()}
              className="flex-grow flex max-w-[500px] items-center gap-2"
            >
              <input
                name="search"
                className="flex-grow w-full border rounded py-3 px-5 bg-gray "
                type="text"
                placeholder="Поиск"
                spellCheck
              />
              <button
                type="submit"
                className="py-3 px-3 w-full h-full max-w-[50px] border bg-gray rounded hover:bg-gray-300"
              >
                <img src={SearchIcon} alt="search icon" />
              </button>
            </form>
            <nav className="relative">
              <div
                className="bg-gray py-3 px-3 border rounded hover:bg-gray-300 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img src={AccountIcon} alt="user icon" />
              </div>
              <ul
                className={`absolute right-0 mt-2 w-48 bg-gray border rounded shadow-lg ${
                  isDropdownOpen ? 'block' : 'hidden'
                }`}
              >
                <li>
                  <Link
                    to="/user"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    user
                  </Link>
                </li>
                <li>
                  <Link
                    to="/certificates"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Сертификаты
                  </Link>
                </li>
                <li>
                  <hr className="border-t" />
                </li>
                <li>
                  <Link
                    to="/logout"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Выйти
                  </Link>
                </li>
              </ul>
            </nav>
          </>
        )}
        {(pathname === '/login' || pathname === '/register') && (
          <h1 className="text-2xl">Elib - онлайн библиотека</h1>
        )}
      </section>
    </header>
  );
};
