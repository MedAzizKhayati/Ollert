import Login from './components/LoginPage';
import Home from './components/Home';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Projects from './components/Projects';
import CreateProject from './components/CreateProject';
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import React from 'react';
import { fetchUser }  from './api/users';
import ProjectTasks from './components/ProjectTasksPage';
import CreateTask from './components/CreateTaskPage';
import EditTask from './components/EditTaskPage';

function App() {
    const [user, setUser] = React.useState({});
    React.useEffect(async () => {
        setUser(await fetchUser());
    }, []);

    if (!user){
        return (
            <Router>
                <Routes>
                    <Route path="/*" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        );
    }
    return (
        <Router>
            <Navbar user={user}/>
            <Routes>
                <Route path="/" element={<Home user={user} />} />
                <Route path="/projects" element={<Projects user={user} />} />
                <Route path="/Projects/:id" element={<ProjectTasks user={user} />} />
                <Route path="/home" element={<Home user={user} />} />
                <Route path="/profile" element={<Profile user={user} />} />
                <Route path="/projects/:id/add" element={<CreateTask user={user} />} />
                <Route path="/projects/:id/edit/:idtask" element={<EditTask user={user} />} />
                <Route path="/projects/create" element={<CreateProject user={user} />} />
                <Route path="/profile" element={<Profile user={user} />} />       
            </Routes>
        </Router>
    );
}

export default App;
