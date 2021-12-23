import Login from './components/LoginPage';
import Home from './components/Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Projects from './components/ProjectsPage';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {fetchUser} from './api/users';


function App() {
    const [user, setUser] = React.useState(null);

    React.useEffect(async () => {
        setUser(await fetchUser());
    }, [])
//for testing purposes
    // const user = 1;

    return (
        <Router>
            {user ? <Navbar/> : null}
            <Routes>
                <Route path='/' element={<Login user={user}/>}/>
                <Route path="/sign-in" element={<Login user={user}/>}/>
                <Route path="/home" element={<Home user={user}/>}/>
                <Route path="/profile" element={<Profile user={user}/>}/>
                <Route path="/projects" element={<Projects user={user}/>}/>

            </Routes>
        </Router>
    );
}

export default App;
