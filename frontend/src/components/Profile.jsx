import React, { Component } from "react";
import '../style/LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(props.user);

    React.useEffect(() => {
        if(!user)
            navigate('/home');
    },[])
        

    const handleUpdate = async (event) => {
        event.preventDefault();
        axios.put('/api/users/update', user).then((response) => {
            navigate('/home');
            window.location.reload();
        })
    }

    const handleFormChange = (event) => {
        user[event.target.name] = event.target.value;
        setUser(user);
    } 

    return (
        <div className="outer" >
            <div className="inner">
                <form onChange={handleFormChange}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First name</label>
                            <input type="text" className="form-control" placeholder="First name" name='first_name'  defaultValue={user.first_name} required />
                        </div>
                        <div className="form-group">
                            <label>Last name</label>
                            <input type="text" className="form-control" placeholder="Last name" name='last_name' defaultValue={user.last_name} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">@</span>
                                </div>
                                <input type="email" className="form-control" name='email' placeholder="Email" defaultValue={user.email} required />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <input type="submit" className="btn btn-primary" onClick={handleUpdate} value="Update Profile"/>
                </form>
            </div>
        </div>
    );

}
export default Profile;