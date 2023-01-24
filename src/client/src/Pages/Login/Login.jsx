import "./Login.scss"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import createRequest from "../../Services/CreateRequest";
import { LoggedUserContext } from "../../Context/LoggedUser";
import { useContext } from "react";
import { toast , ToastContainer} from 'react-toastify';
const Login = () => {
    const {loggedUser, setLoggedUser} = useContext(LoggedUserContext)
    const onSubmit = (e) => {
        e.preventDefault()
        const data = {
            username: e.target.username.value,
            password: e.target.password.value
        }
        createRequest({
            path: '/login',
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            toast.success('User was successfully signed-in')
            const token = btoa(data.username + ' ' + data.password)
            localStorage.setItem('token', token)
            localStorage.setItem('role', res.role)
            setLoggedUser({...res, token: token})
        })
        .catch(err => {
            if (err.status === 401)
                toast.error('Wrong username or password')
            else {
                toast.error('Something went wrong')
                console.log(err)
            }
        })
    }
    return(
        <>
            <ToastContainer/>
            <div className="text-center">
                <Form className={'signInForm'} onSubmit={e => {onSubmit(e)}}>
                    <h2>
                        Sign-in
                    </h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name='username' placeholder="xlogin00" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"  name='password' placeholder="Password" required/>
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
export default Login