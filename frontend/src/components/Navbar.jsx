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

    const handleChange = (event) => {
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

    const handleSearch = (event) => {
        event.preventDefault();
        if(query.length){
            navigate("/projects/" + query[0].id);
            setQuery([]);
            event.target.value = '';
        }
    }

    return (
        <nav className="navbar" style={{ position: 'sticky' }}>
            <div className="brand-title">
                <form className="form-inline autocomplete" autoComplete="off" onSubmit={handleSearch} onChange={handleChange}>
                    <input  name="user" className="form-control mr-sm-2" type="search" placeholder="Search"/>
                    <div className="autocomplete-items">
                        {query.map(project =>
                            <div key={project.name} onClick={() => navigate("/projects/" + project.id)}>
                                <strong>{project.name.slice(0, searchWord.length)}</strong>
                                {project.name.slice(searchWord.length)}
                            </div>
                        )
                        }
                    </div>
                </form>
            </div>
            <div className="navbar-links">
                <ul className="nav-area">
                    <li className="navbar-list"><a className="cool-link" onClick={() => navigate('/projects')}>Projects</a></li>
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