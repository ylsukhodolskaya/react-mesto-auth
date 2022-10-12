import mesto__logo from '../images/Mesto__logo.svg';
import { Link, useLocation } from 'react-router-dom';
import React from 'react';

function Header(props) {
  const { loggedIn, email, logOut } = props

  const location = useLocation();

  if (loggedIn) {
    return (
      <header className="header">
        <img
          src={mesto__logo}
          alt="Лого Место"
          className="header__logo"
        />
        <div className="header__info">
          <p className="header__email">{email}</p>
          <Link to="/sign-in" className="link header__link " onClick={logOut}>Выйти</Link>
        </div>
      </header>
    )
  }

  if (location.pathname === '/sign-in') {
    return (
      <header className="header">
        <img
          src={mesto__logo}
          alt="Лого Место"
          className="header__logo"
        />
        <div className="header__info">
          <Link to="/sign-up" className="link header__link ">Регистрация</Link>
        </div>
      </header>
    )
  }

  return (
    <header className="header">
      <img
        src={mesto__logo}
        alt="Лого Место"
        className="header__logo"
      />
      <div className="header__info">
        <Link to="/sign-in" className=" link header__link">Войти</Link>
      </div>
    </header>
  )
}

export default Header;