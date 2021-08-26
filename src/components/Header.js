import logo from '../images/logo.svg';
import {Link, Switch, Route} from "react-router-dom";

const Header = (props) => {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt={"Mesto Russia"}/>
            <Switch>
                <Route exact path="/">
                    <div className="header__container">
                        <p className="header__mail">{props.userEmail}</p>
                        <Link to="/sign-in" className="header__button" onClick={props.onSingOut}>
                            Выход
                        </Link>
                    </div>
                </Route>
                <Route path="/sign-up">
                    <Link to="/sign-in" className="header__button">
                        Войти
                    </Link>
                </Route>
                <Route path="/sign-in">
                    <Link to="/sign-up" className="header__button">
                        Регистрация
                    </Link>
                </Route>
            </Switch>
        </header>
    );
}

export default Header;