import React, { Component } from "react";
import '../style/LoginPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(props.user);

    const handleUpdate = async (event) => {
        event.preventDefault();
        axios.put('/api/users/update', user).then((response) => {
            navigate('/home');
            window.location.reload();
        });
        if (user.file && user.file.type.startsWith('image')) {
            var formData = new FormData();
            formData.append("image", user.file);
            axios.post('/api/users/updateImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
    }

    const handleFormChange = (event) => {
        if (event.target.files)
            user[event.target.name] = event.target.files[0];
        else
            user[event.target.name] = event.target.value;
        setUser(user);
    }

    return (
        <div className="outer" >
            <div className="inner">
            <h1 style={{ textAlign: 'center' }}>Edit Profile</h1>
                <form onChange={handleFormChange}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>First name</label>
                            <input type="text" className="form-control" placeholder="First name" name='first_name' defaultValue={user.first_name} required />
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
                        <div className="custom-file">
                            <label className="custom-file-label">Select a photo</label>
                            <input type="file" name="file" className="custom-file-input" />
                        </div>
                    </div>
                    <br />
                    <input type="submit" className="btn btn-primary" onClick={handleUpdate} value="Update Profile" />
                </form>
            </div>
        </div>
    );

}
export default Profile;