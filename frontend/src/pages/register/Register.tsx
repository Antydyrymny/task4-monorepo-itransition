import { useState } from 'react';
import { useRegisterMutation } from '../../app/services/api';
import useRedirectAuthenticated from '../../hooks/useRedirectAuthenticated';
import { isFetchError } from '../../utils/typeChecking';
import { Col, Button, Row, Container, Card, Form, Alert } from 'react-bootstrap';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './register.module.scss';
import useFadingAlerError from '../../hooks/useFadingAlerError';

export default function Register() {
    useRedirectAuthenticated('/usersTable');
    const [register, { isLoading, isError, error }] = useRegisterMutation();
    const [registerState, setRegisterState] = useState({
        name: '',
        email: '',
        password: '',
    });
    const allowSubmit = !isLoading && registerState.email && registerState.password;
    const showAlert = useFadingAlerError(isError);

    return (
        <div className='vh-100 d-flex justify-content-center align-items-center bg-primary '>
            {showAlert && (
                <Alert className='fixed-top' variant='danger'>
                    {isFetchError(error) ? error.data : 'Unknown error has occurred'}
                </Alert>
            )}
            <Container>
                <Row className='d-flex justify-content-center align-items-center'>
                    <Col md={8} lg={6} xs={12}>
                        <Card className='shadow'>
                            <Card.Body>
                                <div className='mb-3 mt-md-4'>
                                    <h2 className='fw-bold mb-2 text-uppercase '>
                                        Sign up
                                    </h2>
                                    <p className='mb-5'>Create your account now!</p>
                                    <div className='mb-3'>
                                        <Form
                                            onSubmit={
                                                allowSubmit ? handleSubmit : undefined
                                            }
                                        >
                                            <Form.Group className='mb-3'>
                                                <Form.Label className='text-center'>
                                                    Name
                                                </Form.Label>
                                                <Form.Control
                                                    type='text'
                                                    placeholder='Name'
                                                    required
                                                    value={registerState.name}
                                                    onChange={changeregisterState('name')}
                                                />
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label className='text-center'>
                                                    Email address
                                                </Form.Label>
                                                <Form.Control
                                                    type='email'
                                                    placeholder='Enter email'
                                                    required
                                                    value={registerState.email}
                                                    onChange={changeregisterState(
                                                        'email'
                                                    )}
                                                />
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    placeholder='Password'
                                                    minLength={1}
                                                    required
                                                    value={registerState.password}
                                                    onChange={changeregisterState(
                                                        'password'
                                                    )}
                                                />
                                                <br />
                                            </Form.Group>
                                            <div className='d-grid mb-3'>
                                                <Button
                                                    variant='primary'
                                                    type='submit'
                                                    className={styles.loadingBtn}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        'Register'
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );

    function changeregisterState(param: 'name' | 'email' | 'password') {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setRegisterState((prevState) => ({ ...prevState, [param]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await register(registerState);
    }
}
