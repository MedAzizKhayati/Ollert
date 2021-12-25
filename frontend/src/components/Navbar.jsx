import React from 'react';
import axios from 'axios';
import '../style/Navbar.scss';
import { useNavigate } from 'react-router-dom';


const Navbar = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(props.user);
    const [query, setQuery] = React.useState([])
    const [searchWord, setSearchWord] = React.useState('')

    const handleLogout = () => {
        axios.get('/api/users/logout').then((response) => {
            console.log('Successfully logged out');
        });
        navigate('/');
        window.location.reload();
    }

    const handleSearch = (event) => {
        axios.get('/api/projects/search',
            {
                params: {
                    query: event.target.value
                }
            }
        ).then(response => {
            setQuery(response.data);
            setSearchWord(event.target.value);
        }).catch(err => console.log(err));
    }

    return (
        <nav className="navbar" style={{ position: 'sticky' }}>
            <div className="brand-title">

                <form className="form-inline autocomplete" autoComplete="off" onChange={handleSearch}>
                    <input name="user" className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                    <div className="autocomplete-items">
                        {query.map(project =>
                            <div key={project.name}>
                                <strong>{project.name.slice(0, searchWord.length)}</strong>
                                {project.name.slice(searchWord.length)}
                                <input type='hidden' className="autocomplete-active" value={project.name} />
                            </div>)
                        }
                    </div>
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
                    <li className="navbar-list">
                        <a className="title">
                            <div >
                                Ollert
                            </div>
                        </a>
                    </li>
                    <div className="dropdown ">
                        <li className="navbar-list">
                            <img width="65px" height="65px" style={{ borderRadius: '50%' }} src='/api/users/profilePicture/' id="Avatar" />
                        </li>
                        <div className="dropdown-content">
                            <li className="navbar-list"><a className="cool-link" onClick={() => navigate('/profile')}>Profile</a></li>
                            <li className="navbar-list"><a className="cool-link" onClick={handleLogout}>Logout</a></li>
                        </div>
                    </div>
                </ul>
            </div>
        </nav>

    );
}

export default Navbar;