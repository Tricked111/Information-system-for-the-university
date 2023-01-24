import { useContext, useEffect, useState } from 'react'
import { LoggedUserContext } from '../../Context/LoggedUser'
import './MyProfile.scss'
import { useNavigate } from "react-router-dom";
import LoadingIcon from '../../Components/LoadingIcon/LoadingIcon';
import Button from 'react-bootstrap/Button';
import EditUserModal from '../../Components/EditUserModal/EditUserModal';

const MyProfile = () => {
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    const [modalOpen, setModalOpen] = useState(false)
    let navigate = useNavigate();
    useEffect(() => {
        if (!loggedUser.token) {
            navigate('/login')
        }
    }, [loggedUser])

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        setLoggedUser({})
        navigate('/login')
    }

    const onEditUser = (newUser) => {
        setLoggedUser({...loggedUser, ...newUser})
    }

    let role;

    switch(loggedUser.role) {
        case 's':
            role = 'Student';
            break;
        case 'g':
            role = 'Garant';
            break;
        case 'a':
            role = 'Administrator';
            break;
        case 'l':
            role = 'Lector';
            break;
        default:
            role = 'Not set';
    }

    if (!loggedUser.user_id)
    return (
        <div className='text-center'>
            <LoadingIcon/>
        </div>
    )
    else return (
        <div>
            <h2>
                My Profile
            </h2>
            <p>
                <span className='fw-bold'>Username</span> - {loggedUser.username || 'Not set'}
            </p>
            <p>
                <span className='fw-bold'>Email</span> - {loggedUser.email || 'Not set'}
            </p>
            <p>
                <span className='fw-bold'>First name</span> - {loggedUser.firstname || 'Not set'}
            </p>
            <p>
                <span className='fw-bold'>Last name</span> - {loggedUser.surname || 'Not set'}
            </p>
            <p>
                <span className='fw-bold'>Address</span> - {loggedUser.address || 'Not set'}
            </p>
            <p>
                <span className='fw-bold'>Phone number</span> - {loggedUser.telephone || 'Not set'}
            </p>
            <p>
                <span className='fw-bold'>Role</span> - {role}
            </p>
            <Button onClick={() => {setModalOpen(true)}} style={{marginRight: '1em'}}>
                Edit data
            </Button>
            <Button variant='danger' onClick={() => {logout()}}>
                Logout
            </Button>
            <EditUserModal isModalOpen={modalOpen} setModalOpen={setModalOpen} user={loggedUser} sideEffectOnChange={onEditUser}/>
        </div>
    )
}
export default MyProfile