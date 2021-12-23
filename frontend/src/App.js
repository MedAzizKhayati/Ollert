import Login from './components/LoginPage';
import Home from './components/Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {fetchUser} from './api/users';

function App() {
    const [user, setUser] = React.useState(null);

    React.useEffect(async () => {
        setUser(await fetchUser());
    },[])
    
    return (
        <Router>
            {user ? <Navbar/> : null}
            <Routes>
                <Route path='/' element={<Login user={user}/>} />
                <Route path="/sign-in" element={<Login user={user}/>} />
                <Route path="/home" element={<Home  user={user}/>} />
                <Route path="/profile" element={<Profile user={user}/>} />
            </Routes>
        </Router>
    );
}

export default App;
