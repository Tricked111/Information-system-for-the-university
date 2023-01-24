import './ManageAllCourses.scss'
import Table from 'react-bootstrap/Table';
import { useContext, useEffect, useState } from 'react';
import createRequest from '../../../Services/CreateRequest';
import LoadingIcon from '../../../Components/LoadingIcon/LoadingIcon';
import EditCourseModal from '../../../Components/EditCourseModal/EditCourseModal';
import { LoggedUserContext } from '../../../Context/LoggedUser';
import { toast , ToastContainer} from 'react-toastify';

const ManageAllCourses = () => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [courseToEdit, setCourseToEdit] = useState({})
    const [modalOpen, setModalOpen] = useState(false)
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    useEffect(()=> {
        setIsLoading(true);

        createRequest({
            path: '/get-courses',
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setIsLoading(false)
            setCourses(res)
        })
        .catch(err => {
            console.error(err)
            setIsLoading(false)
        })
    }, [])

    const editCourseModalOpen = (course) => {
        setCourseToEdit(course)
        setModalOpen(true)
    }

    const onEditCourse = (editedCourse) => {
        setCourses(prev => {
            return prev.map(el => el.id_course === editedCourse.id_course ? editedCourse : el)
        })
    }

    const onDeleteCourse = (deletedCourse) => {

        createRequest({
            path: `/remove-course/${deletedCourse.id_course}`,
            method: 'DELETE'
        })
        .then(res => {
            toast.success('Course was successfully deleted')
            setCourses(prev => {
                return prev.filter(el => el.id_course !== deletedCourse.id_course)
            })
        })
        .catch(err => {
            toast.error('Something went wrong')
            console.error(err)
        })
    }

    return (
        <>
        <ToastContainer/>
        <h2>
            Manage all courses
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
                            <th style={{width: '50px'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ?
                            <tr>
                                <td colSpan={6} className={'text-center'}><LoadingIcon/></td>
                            </tr>
                            :
                            courses.map((el, idx) => {
                                return (
                                    <tr key={el.abbrv}>
                                        <td>{el.abbrv}</td>
                                        <td><a href={`/course/${el.id_course}`}>{el.title}</a></td>
                                        <td>{el.garant.firstname} {el.garant.surname}</td>
                                        <td><a href={`#`} onClick={() => {editCourseModalOpen(el)}}>Edit</a></td>
                                        <td><a href={`/termins/${el.id_course}`}>Termins</a></td>
                                        <td><a href='#' onClick={() => {onDeleteCourse(el)}} className={'removeLink'}> Remove </a></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
            <EditCourseModal isModalOpen={modalOpen} setModalOpen={setModalOpen} course={courseToEdit} sideEffectOnChange={onEditCourse}/>
        </div>
        </>
    )
}
export default ManageAllCourses