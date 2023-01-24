import { useEffect, useState } from 'react'
import './Rooms.scss'
import { toast , ToastContainer} from 'react-toastify';
import LoadingIcon from '../../Components/LoadingIcon/LoadingIcon';
import createRequest from '../../Services/CreateRequest';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Rooms = () => {
    const [rooms, setRooms] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true);
        createRequest({
            path: '/get-all-classrooms',
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            setIsLoading(false)
            setRooms(res)
        })
        .catch(err => {
            console.error(err)
            setIsLoading(false)
        })
    }, [])

    const deleteRoom = (room) => {
        createRequest({
            path: `/delete-room/${room.id_classroom}`,
            method: 'DELETE'
        })
        .then(res => {
            setRooms(prev => prev.filter(el => el.name !== room.name))
            toast.success('Classroom was successfully deleted')
        })
        .catch(err => {
            toast.error('Something went wrong')
            console.error(err)
        })
    }

    const onAdd = (e) => {
        e.preventDefault()
        const data = {name: e.target.name.value}

        createRequest({
            path: `/add-room`,
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(res => {
            setRooms(prev => [...prev, data])
            toast.success('Classroom was successfully added')
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
                Classrooms
            </h2>
            {isLoading ?
            <div className='text-center'> <LoadingIcon/> </div>
            :
            rooms.map(el => (
                <div key={el.name}>{el.name} <a onClick={() => {deleteRoom(el)}} className={'removeLink'}> Delete </a></div>
            ))
            }

            <h4 className='mt-3'> Add Classroom</h4>
            <div style={{maxWidth: '300px'}}>
            <Form onSubmit={e => {onAdd(e)}}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name='name' placeholder="Name of room" required/>
                </Form.Group>
                <Form.Group className="text-end">
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form.Group>
            </Form>
            </div>

        </>
    )
}

export default Rooms