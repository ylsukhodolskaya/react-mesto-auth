import React from "react";
import { Link } from 'react-router-dom';


function Login(props) {

  const {onLogin} = props

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  // // После загрузки текущего пользователя из API
  // // его данные будут использованы в управляемых компонентах.
  // React.useEffect(() => {
  //   setEmail(currentUser.name);
  //   setPassword(currentUser.about);
  // }, [currentUser, isOpen]);

  // Обработчик формы при submit
  function handleSubmit(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onLogin({
      email,
      password
    });
  }

  return (
    <main className="content">
      <form className="popup__form form form_full-page form_centered form_theme_black" onSubmit={handleSubmit} name="sign-in">
        <div className="form__element-wrapper form_centered">
          <h2 className="popup__title popup__title_theme_black">Вход</h2>
          <label className="popup__label">
            <input
              type="email"
              className="popup__input popup__input_theme_black"
              name="email"
              id="input-email"
              placeholder="Email"
              required=""
              onChange={handleChangeEmail}
              />
            <span className="input-email-error" />
          </label>
          <label className="popup__label">
            <input
              type="password"
              className="popup__input popup__input_theme_black"
              name="password"
              id="input-password"
              placeholder="Пароль"
              minLength={8}
              maxLength={200}
              onChange={handleChangePassword}
              />
            <span className="input-password-error" />
          </label>
        </div>

        <div className="form__element-wrapper form_centered">
          <button type="submit" className="button popup__save-button popup__save-button_theme_black" >Войти</button>
          <span>Еще нет аккакнта? <Link to="/sign-up" className="link">Зарегистрироваться</Link></span>
        </div>
      </form>
    </main>
  )
}

export default Login;