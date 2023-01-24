import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingIcon from '../../Components/LoadingIcon/LoadingIcon';
import createRequest from '../../Services/CreateRequest';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import './UsersOfTermin.scss'
import Button from 'react-bootstrap/esm/Button';
import { toast , ToastContainer} from 'react-toastify';

const UsersOfTermin = ( ) => {
    const {id} = useParams();
    const [areUsersDownloading, setAreUsersDownloading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setAreUsersDownloading(true);

        createRequest({
            path: '/points-of-termin/' + id,
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            setAreUsersDownloading(false)
            setUsers(res)
        })
        .catch(err => {
            console.error(err)
            setAreUsersDownloading(false)
        })
    }, [])

    const onSubmit = (e, user) => {
        e.preventDefault()
        let points = user.points
        if (e.target.points) points = parseInt(e.target.points.value);

        createRequest({
            path: `/add-points-to-user/${user.id_person}/${id}`,
            method: 'PUT',
            body: JSON.stringify({points: points})
        })
        .then(res => {
            toast.success('Points were updated for user ' + user.username)
        })
        .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
        })
    }

    if (areUsersDownloading)
    return (
        <div className='text-center'>
            <LoadingIcon/>
        </div>
    )
    else return (
        <>
            <ToastContainer/>
            {users.length > 0 ?
            <Table bordered>
                <thead className='bg-info'>
                    <tr  style={{borderRadius: '10px'}}>
                        <th style={{width: '50px'}}>ID</th>
                        <th>Login</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th style={{width: '190px'}}>Points</th>
                    </tr>
                </thead>
                <tbody>
                        {users.map((el, idx) => {
                            return (
                                <tr key={el.id_person}>
                                    <td>{el.id_person}</td>
                                    <td>{el.username}</td>
                                    <td>{el.firstname}</td>
                                    <td>{el.surname}</td>
                                    <td>{el.email}</td>
                                    <td>
                                        <Form onSubmit={e => {onSubmit(e, el)}}>
                                            <Form.Control type="number" name={'points'} max={el.termin.max_points} min={0} placeholder="30" className={'setPointsInput'} defaultValue={el.points}/>
                                            <Button type='submit' variant="primary" size={'sm'} className={'setPointsButton'}>
                                                Save
                                            </Button>
                                        </Form>
                                    </td>
                                </tr>
                            )})
                        }
                </tbody>
            </Table>
            :
            <div className='text-center'>
                No registered users
            </div>
            }
        </>
    )
}
export default UsersOfTermin