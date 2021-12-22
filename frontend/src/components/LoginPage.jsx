import React, { Component } from "react";
import '../style/LoginPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    React.useEffect(() => {
        handleLogin();
    }, [])

    const handleLogin = async (event) => {
        axios.post('/api/users/login', {
            email: email,
            password: password,
        }).then((response) => {
            const { success } = response.data;
            if(success) {
                navigate('/home');
            }
        })
    }

    return (
        <div className="outer" >
            <div className="inner">
                <form>
                    <h3>Log in</h3>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email"onChange={(event) => setEmail(event.target.value)} className="form-control" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" onChange={(event) => setPassword(event.target.value)} className="form-control" placeholder="Enter password" />
                    </div>
                    <button type="submit" onClick={(event) => handleLogin(event)} className="btn btn-dark btn-lg btn-block">Sign in</button>
                </form>
            </div>
        </div>
    );

}
export default Login;