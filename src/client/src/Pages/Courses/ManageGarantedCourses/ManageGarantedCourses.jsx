import './ManageGarantedCourses.scss'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useContext, useEffect, useState } from 'react';
import createRequest from '../../../Services/CreateRequest';
import LoadingIcon from '../../../Components/LoadingIcon/LoadingIcon';
import EditCourseModal from '../../../Components/EditCourseModal/EditCourseModal.jsx';
import { LoggedUserContext } from '../../../Context/LoggedUser';
const ManageGarantedCourses = () => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [courseToEdit, setCourseToEdit] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    useEffect(() => {
        if (loggedUser.id_person) {
            setIsLoading(true);
            createRequest({
                path: '/get_garant_courses/' + loggedUser.id_person,
                method: 'GET'
            })
            .then(res => res.json())
            .then(res => {
                setIsLoading(false)
                setCourses(res)
            })
            .catch(err => {
                console.error(err)
                setIsLoading(false)
            })
        }
    }, [loggedUser])

    const editCourseModalOpen = (course) => {
        setCourseToEdit(course)
        setModalOpen(true)
    }

    const onEditCourse = (editedCourse) => {
        setCourses(prev => {
            return prev.map(el => el.id_course === editedCourse.id_course ? editedCourse : el)
        })
    }

    const onAddCourse = (newCourse) => {
        console.log(newCourse)
        setCourses(prev => [...prev, newCourse])
    }

    return (
        <>
            <>
        <h2>
            Manage courses where I'm garant
        </h2>
        <div align='center'>
            <div className='subjectsTableContainer'>
                <Table bordered>
                    <thead className='bg-info'>
                        <tr>
                            <th style={{width: '50px'}}>Abbrv</th>
                            <th>Title</th>
                            <th>Garant</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ?
                            <tr>
                                <td colSpan={5} className={'text-center'}><LoadingIcon/></td>
                            </tr>
                            :
                            courses.length > 0 ? courses.map((el, idx) => {
                                return (
                                    <tr key={el.abbrv}>
                                        <td>{el.abbrv}</td>
                                        <td><a href={`/course/${el.id_course}`}>{el.title}</a></td>
                                        <td>{el.garant.firstname} {el.garant.surname}</td>
                                        <td><a href={`#`} onClick={() => {editCourseModalOpen(el)}}>Edit</a></td>
                                        <td><a href={`/termins/${el.id_course}`}>Termins</a></td>
                                    </tr>
                                )
                            })
                            :
                            <tr>
                                <td colSpan={5} className={'text-center'}>No courses</td>
                            </tr>
                        }
                    </tbody>
                </Table>

                <Button onClick={() => {setAddModalOpen(true)}}> Add course </Button>
            </div>
            <EditCourseModal isModalOpen={modalOpen} setModalOpen={setModalOpen} course={courseToEdit} sideEffectOnChange={onEditCourse}/>
            <EditCourseModal isModalOpen={addModalOpen} setModalOpen={setAddModalOpen} sideEffectOnChange={onAddCourse}/>
        </div>
        </>
        </>
    )
}
export default ManageGarantedCourses