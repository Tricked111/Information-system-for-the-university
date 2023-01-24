import './TerminsTable.scss'
import Table from 'react-bootstrap/Table';
import { useContext, useEffect, useState } from 'react';
import createRequest from '../../Services/CreateRequest';
import LoadingIcon from '../LoadingIcon/LoadingIcon';
import { LoggedUserContext } from '../../Context/LoggedUser';
import EditTerminModal from '../EditTeminModal/EditTerminModal';
import { toast , ToastContainer} from 'react-toastify';

function TerminsTable({termins=[], repeated=false, onChangeSideEffect, onDeleteTermin}) {
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    const [terminToEdit, setTerminToEdit] = useState({})
    const [isModalEditOpened, setIsModalEditOpened] = useState(false)

    const editTermin = (termin) => {
        setTerminToEdit(termin);
        setIsModalEditOpened(true)
    }

    const unregisterUserFromTermin = (termin) => {
        createRequest({
            path: `/remove-user-from-termin/${loggedUser.id_person}/${termin.id_termin}`,
            method: 'DELETE'
        })
        .then(res => {
            toast.success('User was successfully unregistered')
            onChangeSideEffect({...termin, registered: false})
        })
        .catch(err => {
            console.error(err)
            toast.error('Something went wrong')
        })
    }
    const registerUserToTermin = (termin) => {
        createRequest({
            path: `/add-user-to-termin/${loggedUser.id_person}/${termin.id_termin}`,
            method: 'PUT'
        })
        .then(res => {
            toast.success('User was successfully registered')
            onChangeSideEffect({...termin, registered: true})
        })
        .catch(err => {
            console.error(err)
            toast.error('Something went wrong')
        })
    }

    const deleteTermin = (deletedTermin) => {

        createRequest({
            path: `/remove-termin/${deletedTermin.id_termin}`,
            method: 'DELETE'
        })
        .then(res => {
            toast.success('Termin was successfully deleted')
            onDeleteTermin(deletedTermin)
        })
        .catch(err => {
            toast.error('Something went wrong')
            console.error(err)
        })
    }
    return (
        <>
        <ToastContainer/>
        <div align='center'>
            <div className='terminsTableContainer'>
                <Table bordered>
                    <thead className='bg-info'>
                        <tr>
                            <th style={{width: '50px'}}>Name</th>
                            <th style={{width: '200px'}}>Description</th>
                            <th style={{width: '110px'}}>Time</th>
                            {repeated && <th style={{width: '50px'}}>Weekday</th>}
                            {!repeated && <th style={{width: '75px'}}>Date</th>}
                            <th style={{width: '60px'}}>Max-points</th>
                            {(loggedUser.role === 'a' || loggedUser.role === 'g') && <th style={{width: '50px'}}></th>}
                            {(loggedUser.role !== 's') && <th style={{width: '50px'}}></th>}
                            {(loggedUser.role === 's') && <th style={{width: '50px'}}>Obtained points</th>}
                            {(loggedUser.role === 's') && <th style={{width: '50px'}}>Register</th>}
                            {(loggedUser.role === 'g' || loggedUser.role === 'a') && <th style={{width: '50px'}}></th>}
                        </tr>
                    </thead>
                    <tbody>
                            {termins.map((el, idx) => (
                                    <tr key={el.name}>
                                        <td>{el.name}</td>
                                        <td>{el.description}</td>
                                        <td>{el.time_start} - {el.time_end}</td>
                                        {repeated && <td>{el.weekday}</td>}
                                        {!repeated && <td>{el.date}</td>}
                                        <td>{el.max_points}</td>
                                        {(loggedUser.role === 'a' || loggedUser.role === 'g') && <td><a href="#" onClick={() => {editTermin(el)}}> Edit</a></td>}
                                        {(loggedUser.role !== 's') && <td><a href={"/termins-users/" + el.id_termin}>Users</a></td>}
                                        {(loggedUser.role === 's') && <td> {el.points} </td>}
                                        {(loggedUser.role === 's') && <td> {el.registered ?
                                            <a href='#' onClick={() => {unregisterUserFromTermin(el)}}> Unregister </a>
                                            :
                                            <a href='#' onClick={() => {registerUserToTermin(el)}}> Register</a>
                                        } </td>}
                                        {(loggedUser.role === 'g' || loggedUser.role === 'a') && <td><a href='#' onClick={() => {deleteTermin(el)}} className={'removeLink'}> Remove </a></td>}
                                    </tr>
                                ))
                            }
                    </tbody>
                </Table>
                <EditTerminModal isModalOpen={isModalEditOpened} setModalOpen={setIsModalEditOpened} sideEffectOnChange={onChangeSideEffect} termin={terminToEdit}/>
            </div>
        </div>
        </>
    );
}

export default TerminsTable;