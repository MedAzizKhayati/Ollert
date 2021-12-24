import React from "react";
import '../style/LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [flash, setFlash] = React.useState({});

    const handleLogin = async (event) => {
        axios.post('/api/users/login', {
            email: email,
            password: password,
        }).then((response) => {
            const { success, error } = response.data;
            if (success) {
                navigate('/home');
            } else if (error) {
                setFlash({ 'error': error })
            }
        })
    }

    return (
        <div className="outer" >
            <div className="inner">
                <form className="form-row">
                    <h3>Log in</h3>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" onChange={(event) => setEmail(event.target.value)} className="form-control" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" onChange={(event) => setPassword(event.target.value)} className="form-control" placeholder="Enter password" />
                    </div>
                    <br />
                    <button type="submit" onClick={(event) => handleLogin(event)} className="btn btn-dark btn-lg btn-block">Sign in</button>
                </form>
            </div>
        </div>
    );

}
export default Login;