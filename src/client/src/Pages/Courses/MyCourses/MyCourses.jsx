import './MyCourses.scss'
import Table from 'react-bootstrap/Table';
import { useContext, useEffect, useState } from 'react';
import createRequest from '../../../Services/CreateRequest';
import LoadingIcon from '../../../Components/LoadingIcon/LoadingIcon';
import EditCourseModal from '../../../Components/EditCourseModal/EditCourseModal';
import { LoggedUserContext } from '../../../Context/LoggedUser';

const MyCourses = () => {
    const [courses, setCourses] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    useEffect(() => {
        setIsLoading(true);
        if (loggedUser && loggedUser.role === 's' && loggedUser.id_person) {
            createRequest({
                path: '/get-courses-by-user-id/' + loggedUser.id_person,
                method: 'GET'
            })
            .then(res => res.json())
            .then(res => {
                setCourses(
                    res.map(el => (
                        {...el,
                        obtained_points: el.termins.reduce(
                            (sum, p) => sum + p.points,
                            0
                        )
                        })
                    )
                )
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err)
                setIsLoading(false)
            })
        }
    }, [loggedUser])

    return (
        <>
            <div align='center'>
            <div className='subjectsTableContainer'>
                <Table bordered>
                    <thead className='bg-info'>
                        <tr>
                            <th style={{width: '50px'}}>Abbrv</th>
                            <th>Title</th>
                            <th style={{width: '150px'}}>Credits</th>
                            <th style={{width: '200px'}}>Garant</th>
                            <th style={{width: '80px'}}>Points</th>
                            <th style={{width: '80px'}}>Termins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ?
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
                                        <td>{el.obtained_points} / 100 </td>
                                        <td><a href={`/termins/${el.id_course}`}>Termins</a></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </div>
        </>
    )
}
export default MyCourses