import '../index.css';
import {useState, useEffect} from 'react';
import {Route, Switch, useHistory} from "react-router-dom";
import {CurrentUserContext, defaultUser} from '../contexts/CurrentUserContext';
import api from '../utils/api';
import * as auth from "../utils/auth.js";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmPopup from './ConfirmPopup';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
    // Для получения данных пользователя, данных карточек
    const [currentUser, setCurrentUser] = useState(defaultUser);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const history = useHistory();

    const [cards, setCards] = useState([]);

    // Для выбора карточки
    const [selectedCard, setSelectedCard] = useState({});

    // Для открытия-закрытия всплывающих окон
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isImagePopupOpen, setImagePopupOpen] = useState(false);
    const [isConfirm, setConfirm] = useState(false);

    const tokenCheck = () => { // TODO: ПЕРЕДЕЛАТЬ
        const token = localStorage.getItem('jwt');
        if (token) {
            auth.getContent(token)
                .then((res) => {
                    if (res) {
                        setUserEmail(res.data['email']);
                        setLoggedIn(true);
                        history.push('/');
                    }
                })
                .catch((err) => console.error(err));
        }
    };

    useEffect(() => {
        tokenCheck();
    }, []);

    // Асинхронное получение данных пользователя
    useEffect(() => {
        Promise.all([api.getUserData(), api.getCards()])
            .then(([user, cards]) => {
                setCurrentUser(user);
                setCards(cards);
            })
            .catch(err => console.error(err));
    }, []);

    const handleEditAvatarClick = () => {
        setIsEditAvatarPopupOpen(true);
    }

    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    }

    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    }

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setImagePopupOpen(true);
    }

    const handleConfirm = (card) => {
        setSelectedCard(card);
        setConfirm(true);
    }

    const handleInfoTooltipPopupOpen = () => {
        setIsInfoToolTipOpen(true);
    }

    // Обработчики для работы с API
    const handleCardLike = (card) => {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch(err => console.error(err));
    }

    const handleDeleteCard = (card) => {
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== card._id));
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    const handleUpdateUser = (data) => {
        api.setProfileInfo(data.name, data.about)
            .then(user => {
                setCurrentUser(user);
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    const handleAddPlaceSubmit = (data) => {
        api.addCard(data.name, data.link)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    const handleUpdateAvatar = (data) => {
        api.setUserAvatar(data.link)
            .then(user => {
                setCurrentUser(user);
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    // Регистрация пользователя
    const handleRegistration = (data) => {
        auth.register(data)
            .then(() => {
                    setIsRegistered(true);
                    handleInfoTooltipPopupOpen();
                    history.push('/sign-in');
                },
                (err) => {
                    console.error(err);
                    setIsRegistered(false);
                    handleInfoTooltipPopupOpen();
                })
            .catch(err => console.error(err));
    }

    const handleLogin = (password, email) => {
        auth.authorize(password, email)
            .then((data) => {
                setLoggedIn(true);
                localStorage.setItem('jwt', data.token);
                setUserEmail(email);
                history.push('/');
            })
            .catch(err => console.error(err));
    }

    const handleSignOut = () => {
        localStorage.removeItem('jwt');
        history.push('/login');
    }

    // Закрытие всплывающих окон
    const closeAllPopups = () => {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setImagePopupOpen(false);
        setConfirm(false);
        setSelectedCard({});
    }

    // Реализация открытия-закрытия по 'Esc'
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                closeAllPopups();
            }
        };

        if (isEditProfilePopupOpen || isEditAvatarPopupOpen || isAddPlacePopupOpen || isImagePopupOpen || isConfirm) {
            window.addEventListener('keyup', handleEsc);
        }

        return () => window.removeEventListener('keyup', handleEsc);

    }, [isEditProfilePopupOpen, isEditAvatarPopupOpen, isAddPlacePopupOpen, isImagePopupOpen, isConfirm]);

    useEffect(() => {
        if (loggedIn) {
            api.getUserData()
                .then((userData) => {
                    setCurrentUser(userData);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [loggedIn]);

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header
                    userEmail={userEmail}
                    onSingOut={handleSignOut}
                />
                <Switch>
                    <Route path="/sign-up">
                        <Register onRegistration={handleRegistration}/>
                    </Route>
                    <Route path="/sign-in">
                        <Login handleLogin={handleLogin}/>
                    </Route>
                    <ProtectedRoute
                        path="/"
                        loggedIn={loggedIn}
                        component={Main}
                        cards={cards}
                        onEditAvatar={handleEditAvatarClick}
                        onEditProfile={handleEditProfileClick}
                        onAddPlace={handleAddPlaceClick}
                        onCardClick={handleCardClick}
                        onLikeClick={handleCardLike}
                        onDeleteClick={handleConfirm}
                    />
                </Switch>
                {loggedIn && <Footer/>}
                <InfoTooltip
                    isRegistered={isRegistered}
                    isOpen={isInfoToolTipOpen}
                    onClose={closeAllPopups}
                />

                {/* Всплывающее окно для изменений в профиле */}
                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />

                {/* Всплывающее окно для изменений для добавления карточек */}
                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onClose={closeAllPopups}
                    onUpdatePlace={handleAddPlaceSubmit}
                />

                {/* Всплывающее окно для обновления аватара */}
                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onEditAvatar={handleUpdateAvatar}
                />

                {/* Всплывающее окно для принятия решения */}
                <ConfirmPopup
                    isOpen={isConfirm}
                    onClose={closeAllPopups}
                    onSubmit={handleDeleteCard}
                    card={selectedCard}
                />

                <ImagePopup
                    isOpen={isImagePopupOpen}
                    onClose={closeAllPopups}
                    card={selectedCard}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
