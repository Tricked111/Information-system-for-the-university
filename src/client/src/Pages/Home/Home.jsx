import './Home.scss'
import Table from 'react-bootstrap/Table';
import { useEffect, useState, useContext } from 'react';
import createRequest from '../../Services/CreateRequest';
import LoadingIcon from '../../Components/LoadingIcon/LoadingIcon';
import { LoggedUserContext } from '../../Context/LoggedUser';
import { toast , ToastContainer} from 'react-toastify';

function Home() {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingRegistered, setIsLoadingRegistered] = useState(true)
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)


    useEffect(() => {
        if (courses.length === 0) {
            setIsLoading(true);

            createRequest({
                path: '/get-courses',
                method: 'GET'
            })
            .then(res => res.json())
            .then(res => {
                setIsLoading(false)
                setCourses(res.filter(el => el.approved))
            })
            .catch(err => {
                console.error(err)
                setIsLoading(false)
            })
        }
    }, [])


    useEffect(() => {
        if (loggedUser && loggedUser.role === 's') {
            setIsLoadingRegistered(true);

            if (loggedUser.id_person && !isLoading)
            createRequest({
                path: '/get-courses-by-user-id/' + loggedUser.id_person,
                method: 'GET'
            })
            .then(res => res.json())
            .then(res => {
                const registeredCoursesIds = res.map(el => el.id_course)
                setCourses(prev => prev.map(el => registeredCoursesIds.includes(el.id_course) ?
                    {...el, registered: true} :
                    {...el, registered: false}
                ))
                setIsLoadingRegistered(false)
            })
            .catch(err => {
                console.error(err)
                setIsLoadingRegistered(false)
            })
        }
        else setIsLoadingRegistered(false)
    }, [loggedUser, isLoading])

    const register = (course) => {
        createRequest({
            path: `/add-user-to-course/${loggedUser.id_person}/${course.id_course}`,
            method: 'PUT'
        })
        .then(res => {
            toast.success('User was successfully registered')
            setCourses(prev => prev.map(el => el.id_course === course.id_course ?
                {...el, registered: true}
                :
                el
            ))
        })
        .catch(err => {
            console.error(err)
            toast.error('Something went wrong')
            setIsLoading(false)
        })
    }

    const unregister = (course) => {
        createRequest({
            path: `/remove-user-from-course/${loggedUser.id_person}/${course.id_course}`,
            method: 'DELETE'
        })
        .then(res => {
            toast.success('User was successfully unregistered')
            setCourses(prev => prev.map(el => el.id_course === course.id_course ?
                {...el, registered: false}
                :
                el
            ))
        })
        .catch(err => {
            console.error(err)
            toast.error('Something went wrong')
            setIsLoading(false)
        })
    }
    return (
        <>
        <h2>
            Home
        </h2>
        <ToastContainer/>
        <div align='center'>
            <div className='subjectsTableContainer'>
                <Table bordered>
                    <thead className='bg-info'>
                        <tr>
                            <th style={{width: '50px'}}>Abbrv</th>
                            <th>Title</th>
                            <th style={{width: '150px'}}>Credits</th>
                            <th style={{width: '200px'}}>Garant</th>
                            {loggedUser.role === 's' && <th style={{width: '100px'}}>Registration</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading || isLoadingRegistered ?
                            <tr>
                                <td colSpan={5} className={'text-center'}><LoadingIcon/></td>
                            </tr>
                            :
                            courses.map((el, idx) => {
                                return (
                                    <tr key={el.abbrv}>
                                        <td>{el.abbrv}</td>
                                        <td><a href={`/course/${el.id_course}`}>{el.title}</a></td>
                                        <td>{el.credits}</td>
                                        <td>{el.garant.firstname} {el.garant.surname}</td>
                                        {loggedUser.role === 's' && <th style={{width: '100px'}}>
                                            {el.registered ?
                                                <a href="#" onClick={() => {unregister(el)}}> Unregister </a>
                                                :
                                                <a href="#" onClick={() => {register(el)}}> Register </a>
                                            }

                                        </th>}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </div>
        </>
    );
}

export default Home;