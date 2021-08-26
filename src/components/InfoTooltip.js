import successSign from "./../images/success-sign.png";
import failureSign from "../images/failure-sign.png";

const InfoTooltip = (props) => {
    return (
        <div className={`overlay  ${props.isOpen && 'overlay_opened'}`}>
            <div className="status overlay__container">
                <button className="overlay__close-button" type="button" onClick={props.onClose}/>
                <img className="status__image" src={props.isRegistered ? successSign : failureSign} alt="Success"/>
                <h3 className="status__header overlay__title">
                    {props.isRegistered ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так... Попробуйте ещё раз.'}
                </h3>
            </div>
        </div>
    );
}

export default InfoTooltip;
