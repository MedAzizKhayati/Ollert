import axios from 'axios';


const fetchUser = async () => {
    let user = null;
    await axios.get('/api/users/getUser').then((response) => {
        if (response.data.user)
            user = (response.data.user);
    });
    return user;
}   

export {
    fetchUser
}
