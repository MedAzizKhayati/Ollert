import Login from './components/LoginPage';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import axios from 'axios';

function App() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        axios.get('/api/users/getUser').then((response) => {
            if (response.data.user) {
                setUser(response.data.user);
            }
        }).catch((error) => {
            setUser(null);
        })
    },[])

    return (
        <Router>
            {user ? <Navbar user={user}/> : null}
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path="/sign-in" element={<Login />} />
                <Route path="/home" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
