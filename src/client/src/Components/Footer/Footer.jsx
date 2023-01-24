import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Footer.scss'

const Footer = () => {
    return (
        <footer>
            <Container className='footer-container'>
                <Row className='pt-3'>
                    <Col>
                        <p className="text-muted">&copy; 2022 IIS Project</p>
                    </Col>
                    <Col>
                        <p className="text-muted text-end">xteam00</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer