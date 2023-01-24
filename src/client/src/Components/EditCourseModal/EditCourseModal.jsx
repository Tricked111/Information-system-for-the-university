import './EditCourseModal.scss'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import createRequest from '../../Services/CreateRequest';
import { toast , ToastContainer} from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { LoggedUserContext } from '../../Context/LoggedUser';
import LoadingIcon from '../LoadingIcon/LoadingIcon';
const EditCourseModal = ({isModalOpen, setModalOpen, course, sideEffectOnChange}) => {
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    const [isLoadingGarants, setIsLoadingGarants] = useState(true)
    const [garants, setGarants] = useState([])

    const [isLoadingTeachers, setIsLoadingTeachers] = useState(true)
    const [teachers, setTeachers] = useState([])
    const [selectedTeachers, setSelectedTeachers] = useState([])

    useEffect(() => {
        if (course && course.lectors && course.lectors.length !== 0)
            setSelectedTeachers(course.lectors.map(el => el.id_teacher_id))
        else setSelectedTeachers([])
    }, [course])

    const onSubmit = (e) => {
        e.preventDefault()

        const data = {
            ...course,
        }
        if (e.target.abbrv) data.abbrv = e.target.abbrv.value;
        if (e.target.title) data.title = e.target.title.value;
        if (e.target.description) data.description = e.target.description.value;
        if (e.target.credits) data.credits = parseInt(e.target.credits.value);
        if (e.target.max_persons) data.max_persons = parseInt(e.target.max_persons.value);
        if (e.target.type) data.type = e.target.type.value;
        if (e.target.approved) data.approved = e.target.approved.value === 'true';
        if (e.target.garant_id) data.garant_id = parseInt(e.target.garant_id.value);
        if (!course) data.garant_id = parseInt(loggedUser.id_person)

        data.lectors_id = selectedTeachers.map(el => parseInt(el))
        data.lectors = data.lectors_id.map(el => ({id_teacher_id: el})) 

        createRequest({
            path: course ? '/course-edit/' + course.id_course : '/create-course',
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(res => {
            if (sideEffectOnChange) sideEffectOnChange({...data, garant: garants.find(el => el.id_person === data.garant_id)})
            toast.success(course ? 'Course was successfully edited' : 'Course was successfully added')
            setModalOpen(false)
        })
        .catch(err => {
            toast.error('Something went wrong')
            console.log(err)
        })
    }

    useEffect(() => {
        setIsLoadingGarants(true)
        createRequest({
            path: '/get-all-users?role=g',
            method: 'GET',
        })
        .then(res => res.json())
        .then(res => {
            setIsLoadingGarants(false)
            setGarants(res)
        })
        .catch(err => {
            console.error(err)
            setIsLoadingGarants(false)
        })

        setIsLoadingTeachers(true)
        createRequest({
            path: '/get-all-users?role=l',
            method: 'GET',
        })
        .then(res => res.json())
        .then(res => {
            setIsLoadingTeachers(false)
            setTeachers(res)
        })
        .catch(err => {
            console.error(err)
            setIsLoadingTeachers(false)
        })

    }, [])


    const selectTeacher = (idx, newValue) => {
        setSelectedTeachers(prev => prev.map((el, prevIdx) => prevIdx === idx ? newValue : el))
    }

    const removeTeacher = (idx) => {
        setSelectedTeachers(prev => prev.filter((el, prevIdx) => prevIdx !== idx))
    }

    const addTeacher = (idx) => {
        setSelectedTeachers(prev => [...prev, teachers[0].id_person])
    }

    const defaultValues = {
        abbrv: course ? course.abbrv : '',
        title: course ? course.title : '',
        description: course ? course.description : '',
        credits: course ? course.credits : '',
        max_persons: course ? course.max_persons : '',
        type: course ? course.type : '',
        approved: course ? course.approved : '',
        garant_id: course ? course.garant_id : '',
    }

    return (
        <>
        <ToastContainer/>
        <Modal show={isModalOpen} onHide={() => {setModalOpen(false)}}>
            <Modal.Header closeButton>
                <Modal.Title>Edit course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className={'editCourseForm'} onSubmit={e => {onSubmit(e)}} id={course ? 'Edit course' + course.id_course : 'Add course'}>
                    <Form.Group className="mb-3">
                        <Form.Label>Abbreviation</Form.Label>
                        <Form.Control type="text" name='abbrv' placeholder="IXX" defaultValue={defaultValues.abbrv}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name='title' placeholder="Name of course" defaultValue={defaultValues.title}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as='textarea' rows={3} name='description' placeholder="Description of course" defaultValue={defaultValues.description}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Credits</Form.Label>
                        <Form.Control type={'number'} min={1} max={15} name='credits' placeholder="2" defaultValue={defaultValues.credits}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Max students</Form.Label>
                        <Form.Control type={'number'} min={1} max={1000} name='max_persons' placeholder="100" defaultValue={defaultValues.max_persons}/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Winter or summer</Form.Label>
                        <Form.Select name='type' defaultValue={defaultValues.type}>
                            <option value={'w'}>Winter</option>
                            <option value={'s'}>Summer</option>;
                        </Form.Select>
                    </Form.Group>

                    {loggedUser.role === 'a' &&
                        <Form.Group className="mb-3">
                            <Form.Label>Garant</Form.Label>
                            {isLoadingGarants ?
                            <p><LoadingIcon/></p>
                            :
                            <Form.Select name='garant_id' defaultValue={defaultValues.garant_id}>
                                {garants.map(el =>
                                    <option  value={el.id_person} key={el.id_person + 'garant'}>
                                        {el.firstname} {el.surname}
                                    </option>
                                )}
                            </Form.Select>}
                        </Form.Group>
                    }

                    <Form.Group className="mb-3">
                        <Form.Label>Teachers</Form.Label>
                        {isLoadingTeachers ?
                            <p><LoadingIcon/></p>
                            :
                            <>
                            {selectedTeachers && selectedTeachers.map((selectedTeacher, idx) => {
                                return (
                                    <>
                                    <Form.Select defaultValue={selectedTeacher} onChange={(e) => {selectTeacher(idx, e.currentTarget.value)}}>
                                        {teachers.map(el =>
                                            <option value={el.id_person} key={el.id_person + 'teacher'}>
                                                {el.firstname} {el.surname}
                                            </option>
                                        )}
                                    </Form.Select>
                                    <div style={{marginBottom: '1em'}}>
                                        <a href="#" onClick={() => {removeTeacher(idx)}}>Remove</a>
                                    </div>
                                    </>
                                    )
                                })
                            }
                            <div>
                                <a href="#" onClick={() => {addTeacher()}}> Add </a>
                            </div>
                            </>
                        }
                    </Form.Group>

                    {loggedUser.role === 'a' &&
                    <Form.Group className="mb-3">
                        <Form.Label>Is approved</Form.Label>
                        <Form.Select name='approved' defaultValue={defaultValues.approved}>
                            <option value={true}>Approved</option>
                            <option value={false}>Not approved</option>;
                        </Form.Select>
                    </Form.Group>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => {setModalOpen(false)}}>
                    Close
                </Button>
                <Button type='submit' variant="primary" form={course ? 'Edit course' + course.id_course : 'Add course'}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}
export default EditCourseModal;