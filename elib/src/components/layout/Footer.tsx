import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '/icon.svg';

export const Footer = (): React.JSX.Element => {
  return (
    <footer className="footer">
      <div className="footer__img">
        <img className="footer__img--content" src={Icon} alt="logo" />
      </div>
      <div className="flex-grow flex gap-4 justify-between">
        <div className="footer__links flex flex-col md:flex-row lg:flex-row gap-2">
          <Link to="/" className="link">
            Главная
          </Link>
          <Link to="/register" className="link">
            Регистрация
          </Link>
          <Link to="/sertificates" className="link">
            Купоны и бонусы
          </Link>
        </div>
        <div>2025 📚</div>
      </div>
    </footer>
  );
};
