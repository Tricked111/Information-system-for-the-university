import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingIcon from '../../Components/LoadingIcon/LoadingIcon';
import createRequest from '../../Services/CreateRequest';
import './CourseDetails.scss'

const CourseDetails = () => {
    const {id} = useParams();
    const [course, setCourse] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        createRequest({
            path: `/get-course-by-id/${id}`,
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            setLoading(false)
            setCourse(res)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [])

    if (loading)
    return (
        <div className='text-center'>
            <LoadingIcon/>
        </div>
    )
    else
    return (
        <>
            <h2>
                {course.title}
            </h2>
            <p>
                {course.description}
            </p>
            <p>
                <span className='fw-bold'>Garant</span> - {course.garant.firstname} {course.garant.surname}
            </p>
            <p>
                <span className='fw-bold'>Semester</span> - {course.type === 's' ? 'Summer' : 'Winter'}
            </p>
            <p>
                <span className='fw-bold'>Credits</span> - {course.credits}
            </p>
            <p>
                <span className='fw-bold'>Max persons</span> - {course.max_persons}
            </p>
        </>
    )
}
export default CourseDetails