import {useState} from "react";
import {Link} from "react-router-dom";

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        props.onRegistration({
            email,
            password
        });
    }

    return (
        <div className="entrance">
            <form className="entrance-form" onSubmit={handleSubmit}>
                <h2 className="entrance-form__header">Регистрация</h2>
                <input className="entrance-form__input" placeholder="E-mail" name="email" type="email" value={email}
                       onChange={handleEmailChange} required/>
                <input className="entrance-form__input" placeholder="Пароль" name="password" type="password"
                       value={password} onChange={handlePasswordChange} required/>
                <button className="entrance-form__submit-button" type="submit"
                        onSubmit={handleSubmit}>Зарегистрироваться
                </button>
                <p className="entrance-form__notification">Уже зарегистрированы?
                    <Link to="/sign-in" className="entrance-form__link"> Войти</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
