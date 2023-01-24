import './SignUp.scss'
import { toast , ToastContainer} from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import createRequest from "../../Services/CreateRequest";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    const onSubmit = (e) => {
        e.preventDefault()

        if (e.target.password.value === e.target.passwordRepeat.value) {
            const data = {
                username: e.target.username.value,
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                email: e.target.email.value,
                password: e.target.password.value,
            }

            createRequest({
                path: '/register',
                method: 'POST',
                body: JSON.stringify(data)
            })
            .then(res => {
                toast.success('User was successfully signed-up')
                navigate('/login')
            })
            .catch(err => {
                toast.error('Something went wrong')
                console.log(err)
            })
        } else {
            toast.error('Passwords are not the same')
        }
    }
    return(
        <>
            <ToastContainer/>
            <div className="text-center">
                <Form className={'signUpForm'} onSubmit={e => {onSubmit(e)}}>
                    <h2>
                        Sign-Up
                    </h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name='username' placeholder="xlogin00" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" name='firstName' placeholder="Name" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" name='lastName' placeholder="Last name" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name='email' placeholder="example@mail.com" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"  name='password' placeholder="Password" required/>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Repeat password</Form.Label>
                        <Form.Control type="password"  name='passwordRepeat' placeholder="Repeat password" required/>
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
export default SignUp