import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../../app/services/api';
import useRedirectAuthenticated from '../../hooks/useRedirectAuthenticated';
import { isFetchError } from '../../utils/typeChecking';
import { Col, Button, Row, Container, Card, Form, Alert } from 'react-bootstrap';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './login.module.scss';
import useFadingAlerError from '../../hooks/useFadingAlerError';

export default function Login() {
    useRedirectAuthenticated('/usersTable');
    const [login, { isLoading, isError, error }] = useLoginMutation();
    const [loginState, setLoginState] = useState({ email: '', password: '' });
    const allowSubmit = !isLoading && loginState.email && loginState.password;
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
                                        Sign in
                                    </h2>
                                    <p className=' mb-5'>
                                        Please, enter your email and password!
                                    </p>
                                    <div className='mb-3'>
                                        <Form
                                            onSubmit={
                                                allowSubmit ? handleSubmit : undefined
                                            }
                                        >
                                            <Form.Group className='mb-3'>
                                                <Form.Label className='text-center'>
                                                    Email address
                                                </Form.Label>
                                                <Form.Control
                                                    type='email'
                                                    placeholder='Enter email'
                                                    required
                                                    value={loginState.email}
                                                    onChange={changeLoginState('email')}
                                                />
                                            </Form.Group>
                                            <Form.Group className='mb-3'>
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type='password'
                                                    placeholder='Password'
                                                    minLength={1}
                                                    required
                                                    value={loginState.password}
                                                    onChange={changeLoginState(
                                                        'password'
                                                    )}
                                                />
                                                <br />
                                            </Form.Group>
                                            <div className='d-grid'>
                                                <Button
                                                    variant='primary'
                                                    type='submit'
                                                    className={styles.loadingBtn}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        'Login'
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                        <div className='mt-3'>
                                            <p className='mb-0  text-center'>
                                                Don't have an account?{' '}
                                                <Link
                                                    to={'/register'}
                                                    className='text-primary fw-bold'
                                                >
                                                    Sign Up
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );

    function changeLoginState(param: 'email' | 'password') {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setLoginState((prevState) => ({ ...prevState, [param]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await login(loginState);
    }
}
