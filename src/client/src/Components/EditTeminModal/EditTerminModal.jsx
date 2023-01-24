import './EditTerminModal.scss'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import createRequest from '../../Services/CreateRequest';
import { toast , ToastContainer} from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { LoggedUserContext } from '../../Context/LoggedUser';
import LoadingIcon from '../LoadingIcon/LoadingIcon';

const EditTerminModal = ({isModalOpen, setModalOpen, sideEffectOnChange, termin}) => {
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    const [classrooms, setClassrooms] = useState([])
    const [classroomsLoading, setClassroomsLoading] = useState(true)
    const onSubmit = (e) => {
        e.preventDefault()

        const data = {...termin};
        if (e.target.name) data.name = e.target.name.value;
        if (e.target.description) data.description = e.target.description.value;
        if (e.target.time_start) data.time_start = e.target.time_start.value;
        if (e.target.time_end) data.time_end = e.target.time_end.value;
        if (e.target.max_points) data.max_points = parseInt(e.target.max_points.value);
        if (e.target.capacita) data.capacita = parseInt(e.target.capacita.value);
        if (e.target.repeted) data.repeted = e.target.repeted.value === 'true';
        if (e.target.auto_register) data.auto_register = e.target.auto_register.value === 'true';
        if (e.target.type) data.type = e.target.type.value;
        if (e.target.weekday) data.weekday = e.target.weekday.value;
        if (e.target.classroom_id) data.classroom_id = parseInt(e.target.classroom_id.value);
        if (e.target.classroom_id) data.classroom = classrooms.find(el => el.id_classroom === e.target.classroom_id.value)

        createRequest({
            path: '/update-termin/' + termin.id_termin,
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(res => {
            if (sideEffectOnChange) sideEffectOnChange(data)
            toast.success('Termin was created successfully')
            setModalOpen(false)
        })
        .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
        })

    }

    useEffect(() => {
        setClassroomsLoading(true)
        createRequest({
            path: '/get-all-classrooms',
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            setClassroomsLoading(false)
            setClassrooms(res)
        })
        .catch(err => {
            console.error(err)
            setClassroomsLoading(false)
        })
    }, [])
    return (
        <>
        <ToastContainer/>
        <Modal show={isModalOpen} onHide={() => {setModalOpen(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Edit termin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={e => {onSubmit(e)}} id={'edit-termin' + termin.id_termin}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name='name' placeholder="Name of termin" defaultValue={termin.name}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={3} name='description' placeholder="Description of termin" defaultValue={termin.description}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Time start</Form.Label>
                        <Form.Control type="text" name='time_start' placeholder="12:00:00" defaultValue={termin.time_start}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Time finish</Form.Label>
                        <Form.Control type="text" name='time_end' placeholder="13:00:00" defaultValue={termin.time_end}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="text" name='date' placeholder="YYYY-MM-DD" defaultValue={termin.date}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Max points</Form.Label>
                        <Form.Control type="number" max={100} min={0} name='max_points' placeholder="30" defaultValue={termin.max_points}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Capacity</Form.Label>
                        <Form.Control type="number" max={1000} min={0} name='capacita' placeholder="500" defaultValue={termin.capacita}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Repeated</Form.Label>
                        <Form.Select name='repeted' defaultValue={termin.repeted}>
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Weekday (leave empty if not repeated)</Form.Label>
                        <Form.Control type="text" name='weekday' placeholder="Monday" defaultValue={termin.weekday}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Type</Form.Label>
                        <Form.Select name='type' defaultValue={termin.type}>
                            <option value={'l'}>Lecture</option>
                            <option value={'c'}>Exercise</option>;
                            <option value={'z'}>Exam</option>;
                            <option value={'p'}>Project</option>;
                            <option value={'h'}>Homework</option>;
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Auto registration</Form.Label>
                        <Form.Select name='auto_register' defaultValue={termin.auto_regist}>
                            <option value={true}>True</option>
                            <option value={false}>False</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Classroom</Form.Label>
                        {classroomsLoading ?
                        <div> <LoadingIcon/> </div>
                        :
                        <Form.Select name='classroom_id' defaultValue={termin.id_classroom_id}>
                            {classrooms.map(el => {
                                return (<option value={el.id_classroom} key={el.name}>{el.name}</option>)
                            })}
                        </Form.Select>
                        }
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setModalOpen(false)}}>
                    Close
                </Button>
                <Button type='submit' variant="primary" form={'edit-termin' + termin.id_termin}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
export default EditTerminModal;