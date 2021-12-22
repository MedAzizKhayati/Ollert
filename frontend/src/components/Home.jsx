import React from 'react';
import axios from 'axios';
import '../style/Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

export default () => {
    const navigate = useNavigate();
    const rows = 10;
    const [users, setUsers] = React.useState([]);
    const [page, setPage] = React.useState(1);

    React.useEffect(() => {
        axios.get('api/users/list/' + rows + '/' + page).then(users => {
            setUsers(users.data);
        })
    }, [page]);

    React.useEffect(() => {
        axios.post('api/users/login',{
            emai: '',
            password: ''
        }).catch(err => {
            navigate('/');
        })
    }, [])

    const handleClick = (step) => {
        if (page + step > 0)
            setPage(page + step);
    }

    return (
        <div id='Home' className='container'>
            <h1>Welcome to Ollert</h1>
            <h2>Simulation</h2>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas vitae suscipit velit. Praesent sit amet nisl bibendum, sollicitudin ligula sit amet, dignissim massa. In at ligula libero. Quisque vitae quam orci. Duis auctor, enim eu convallis vulputate, enim velit auctor purus, id mattis leo libero at dolor. Aliquam quis facilisis purus. Nam quis erat vel nibh suscipit efficitur at in magna. Pellentesque condimentum, mi sit amet porttitor gravida, enim nibh fringilla erat, sit amet bibendum tellus odio eget nisl. Quisque maximus magna tortor, a faucibus nibh bibendum eu. In consequat, nisl sed ultrices convallis, erat dolor suscipit ante, vel ornare arcu nisi sit amet lorem. Vestibulum ipsum velit, finibus nec nibh sed, placerat fringilla nisl. Nunc ultrices nisl eu rhoncus sagittis. Praesent cursus arcu neque, a cursus sem aliquam vel.
            </p>
            <nav style={{cursor: 'pointer'}}>
                <ul className="pagination pagination-sm justify-content-end">
                    <li className="page-item"><a className="page-link" onClick={() => handleClick(-1)}>Previous</a></li>
                    <li className="page-item"><a className="page-link" onClick={() => handleClick(1)}>Next</a></li>
                </ul>
            </nav>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Password</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr key={user.id} >
                            <th scope="row">{user.id}</th>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                        </tr>
                    )}
                </tbody>
            </table>

        </div>

    );
}