import axios from 'axios';


const fetchUser = async () => {
    let user;
    await axios.get('/api/users/getUser').then((response) => {
        if (response.data.user) {
            user = (response.data.user);
        }
    }).catch((err) => {
        user = (null);
    })
    return user;
}   

export {
    fetchUser
}
