import {createContext} from "react";

export const CurrentUserContext = createContext();

export const defaultUser = {
    _id: '',
    about: 'Загрузка...',
    avatar: 'https://64.media.tumblr.com/1d6abee87aa71fc219c2312ba0c7c7c5/tumblr_p69s21P7KM1w3y4ilo1_500.gifv',
    name: 'Загрузка...'
};