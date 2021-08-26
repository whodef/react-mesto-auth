import {useState} from "react";

const Login = (props) => {
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
        props.handleLogin(email, password);
    }

    return (
        <div className="entrance">
            <form className="entrance-form" onSubmit={handleSubmit}>
                <h2 className="entrance-form__header">Вход</h2>
                <input className="entrance-form__input" name="email" type="email" placeholder="E-mail" value={email}
                       onChange={handleEmailChange}/>
                <input className="entrance-form__input" name="password" type="password" placeholder="Пароль"
                       value={password} onChange={handlePasswordChange}/>
                <button className="entrance-form__submit-button" type="submit">Войти</button>
            </form>
        </div>
    );
}

export default Login;
