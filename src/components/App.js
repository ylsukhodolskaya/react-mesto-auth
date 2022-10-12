import { useState, useEffect } from 'react';
import '../App.css';
import Header from './Header.js';
import Footer from './Footer.js';
import Main from './Main.js';
import ImagePopup from './ImagePopup.js';
// Импортируем объект контекста
import { CurrentUserContext, defaultUserInfo } from '../contexts/CurrentUserContext.js';
import { api } from '../utils/Api.js';
import EditProfilePopup from './EditProfilePopup.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup.js';
import { Route, Switch, useHistory } from 'react-router-dom';
import Register from './Register.js';
import Login from './Login.js';
import InfoTooltipPopup from './InfoTooltip.js';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isPreviewCardPopupOpen, setIsPreviewCardPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [isLastOperationSuccess, setIsLastOperationSuccess] = useState(true);
  const [selectedCard, setSelectedCard] = useState({});
  // Переменная состояния пользователя
  const [currentUser, setCurrentUser] = useState(defaultUserInfo);
  const [cards, setCards] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  const [token, setToken] = useState(localStorage.getItem('jwt') || '');

  const history = useHistory();

  //переменная состояния currentUser и эффект при монтировании, который будет вызывать api.getUserInfo и обновлять стейт-переменную из полученного значения
  useEffect(() => {
    if (loggedIn) {
      api.getUserInfo()
        .then((data) => {
          setCurrentUser(data)
        })
        .catch((err) => {
          console.log('//////Ошибка api.getUserInfo//////', err);
          openInfoTooltipPopup(false);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      api.getInitialCards()
        .then((initialCards) => {
          setCards(initialCards);
        })
        .catch((err) => {
          console.log('//////Ошибка api.getInitialCards//////', err);
          openInfoTooltipPopup(false);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (token) {
      api.checkToken(token)
        .then((result) => {
          if (result && result.data) {
            setLoggedIn(true);
            history.push('/');
          }
        })
        .catch((err) => {
          console.log('//////Ошибка api.checkToken//////', err);
          openInfoTooltipPopup(false);
        });
    }
  }, [token]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleCardClick = (card) => {
    setIsPreviewCardPopupOpen(true);
    setSelectedCard(card)
  }

  const openInfoTooltipPopup = (isSuccess) => {
    setIsInfoTooltipPopupOpen(true);
    setIsLastOperationSuccess(isSuccess)
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsPreviewCardPopupOpen(false);
    setSelectedCard({});
    setIsInfoTooltipPopupOpen(false);
  };

  // Функция постановки лайков карточке
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((serverCards) => serverCards.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      });
  }

  // Функция удаления карточки
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((serverCards) => serverCards.filter((c) => c._id !== card._id))
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      })
  }

  // Изменение данных профиля
  function handleUpdateUser(userData) {
    api.editUserInfo(userData)
      .then((userDataServer) => {
        setCurrentUser(userDataServer)
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      })
      .finally(() => closeAllPopups());
  };

  // Изменение аватара профиля
  function handleUpdateAvatar(userAvatar) {
    api.editAvatar(userAvatar)
      .then((userAvatarServer) => {
        setCurrentUser(userAvatarServer)
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      })
      .finally(() => closeAllPopups());
  };

  // Добавление новой карточки
  function handleAddPlaceSubmit(card) {
    api.addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      })
      .finally(() => closeAllPopups());
  }

  // Регистрация пользователя
  function handleRegistration(registrationData) {
    api.register(registrationData)
      .then((result) => {
        if (result && result.data) {
          openInfoTooltipPopup(true);
          history.push('/sign-in');
        } else {
          openInfoTooltipPopup(false);
        }
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      })
  }

  // Аутентификация пользователя
  function handleLogin(loginData) {
    api.login(loginData)
      .then((result) => {
        if (result && result.token) {
          setEmail(loginData.email);
          setToken(result.token);
          localStorage.setItem('jwt', result.token);
        } else {
          openInfoTooltipPopup(false);
        }
      })
      .catch((err) => {
        console.log(err);
        openInfoTooltipPopup(false);
      })
  }

  // Выход из профиля
  function logOut() {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('jwt');
  }

  return (
    <>
      <CurrentUserContext.Provider value={currentUser}>
        <Header
          email={email}
          loggedIn={loggedIn}
          logOut={logOut}
        />
        <Switch>
          <ProtectedRoute
            path="/"
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
            component={Main}
            exact
            loggedIn={loggedIn}
          />
          <Route path="/sign-up" >
            <Register onRegister={handleRegistration} />
          </Route>
          <Route path="/sign-in" >
            <Login onLogin={handleLogin} />
          </Route>

        </Switch>
        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isPreviewCardPopupOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltipPopup
          isOpen={isInfoTooltipPopupOpen}
          onClose={closeAllPopups}
          isSuccess={isLastOperationSuccess}
        />
      </CurrentUserContext.Provider>
    </>
  );
}

export default App;