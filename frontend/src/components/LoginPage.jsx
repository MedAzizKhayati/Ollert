import React from "react";
import '../style/LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState({});
    const [flash, setFlash] = React.useState({});
    const [login, setLogin] = React.useState(true);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!login) {
            setLogin(!login);
        } else {
            if (user.email && user.password)
                axios.post('/api/users/login', user).then((response) => {
                    const data = response.data;
                    if (data.success) {
                        navigate('/home');
                        window.location.reload();
                    } else {
                        setFlash(data);
                    }
                });
        }
    }

    const onFormChange = (event) => {
        const userTemp = user;
        userTemp[event.target.name] = event.target.value;
        setUser(userTemp);
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        if (login) {
            setLogin(!login);
        }
        else {
            if (user.email && user.password && user.password == user.confirm_password && user.username)
                axios.post('/api/users/create', user).then((response) => {
                    const data = response.data;
                    setFlash(data);
                    if (data.success) {
                        setLogin(!login);
                    } else if (data.error) {

                    }
                });
            else {
                setFlash({ error: 'Please check all the required fields.' })
            }
        }
    }

    const onConfirmPasswordChange = async (event) => {
        if (user.password != event.target.value) {
            setFlash({ passwordMismatch: true })
        }else{
            setFlash({ passwordMismatch: false })
        }
    }

    return (
        <div className="outer" >
            <div className="inner">
                <form className="form-row" onChange={event => onFormChange(event)}>
                    <h3>{login ? "Log in" : "Join now"}</h3>
                    {
                        !login ?
                            <div className="form-group">
                                <label>Username</label>
                                <input name="username" type="text" className="form-control" placeholder="Enter username" />
                            </div>
                            : null
                    }
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" className="form-control" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Enter password" />
                    </div>
                    {
                        !login ?
                            <div className="form-group">
                                <label>Confirm password</label>
                                <input type="password" onChange={event => onConfirmPasswordChange(event)} name="confirm_password" className="form-control" placeholder="Confirm your password" />
                                {flash.passwordMismatch ?
                                    <div className="alert alert-danger" role="alert">
                                        Password mismatch.
                                    </div>
                                    : null
                                }
                            </div>
                            : null
                    }
                    <br />
                    <button type="submit" onClick={event => handleLogin(event)} className="btn btn-dark btn-lg btn-block">Sign in</button>
                    <button type="submit" onClick={event => handleSignUp(event)} className="btn btn-danger btn-lg btn-block">Sign up</button>
                    <br />
                    <br />
                    {flash.success ?
                        <div className="alert alert-success" role="alert">
                            {flash.success}
                        </div>
                        : null
                    }
                    {flash.error ?
                        <div className="alert alert-danger" role="alert">
                            {flash.error}
                        </div>
                        : null
                    }

                </form>
            </div>
        </div>
    );

}
export default Login;