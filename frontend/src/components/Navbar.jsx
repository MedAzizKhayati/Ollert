import React from 'react';
import axios from 'axios';
import '../style/Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Navbar = (props) => {
    const navigate = useNavigate();
    const user = props.user;

    const handleLogout = () => {
        axios.get('/api/users/logout').then((response) => {
            console.log('Successfully logged out');
        });
        navigate('/');
    }
    return (
        <nav className="navbar">
            <div className="brand-title">
                <form className="form-inline">
                    <input name="user" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                </form>
            </div>
            <a href="#" className="toggle-button">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </a>
            <div className="navbar-links">
                <ul className="nav-area">
                    <li className="navbar-list"><a className="cool-link">Projects</a></li>
                    <li className="navbar-list"><a className="cool-link" onClick={() => navigate('/home')}>Home</a></li>
                    <div className="dropdown ">
                        <li className="navbar-list">
                            <img width="50" height="50" style={{ borderRadius: '50%' }} src="{{ asset('images/profile/uploads/' ~ app.user.photo) }}" id="Avatar" />
                        </li>
                        <div className="dropdown-content">
                            <li className="navbar-list"><a className="cool-link">Account</a></li>
                            <li className="navbar-list"><a className="cool-link" onClick = {handleLogout}>logout</a></li>
                        </div>
                    </div>
                </ul>
            </div>
        </nav>

    );
}

export default Navbar;