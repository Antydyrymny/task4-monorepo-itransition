import { useState, useMemo, useCallback } from 'react';
import { Container, Row, Table, Navbar, Button, FormCheck } from 'react-bootstrap';
import dayjs from 'dayjs';
import {
    useLogOutMutation,
    useGetUsersQuery,
    useBlockUsersMutation,
    useUnblockUsersMutation,
    useDeleteUsersMutation,
    User,
} from '../../app/services/api';
import { useAppSelector, useAppDispatch } from '../../app/storeHooks';
import { selectCurrentUser, clearAuth } from '../../features/auth/authSlice';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Lock from '../../assets/Lock';
import LockOpen from '../../assets/LockOpen';
import Trash from '../../assets/Trash';
import styles from './userTable.module.scss';

function UserTable() {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser) as User;
    const [logout] = useLogOutMutation();
    const handleLogout = () => {
        logout();
        dispatch(clearAuth());
    };

    const { data: users = [], isLoading, isSuccess, isFetching } = useGetUsersQuery();
    const [sorted, setSorted] = useState(true);
    const [selected, setSelected] = useState<string[]>([]);

    const sortedUsers = useMemo(
        () =>
            users
                .slice()
                .sort((a, b) =>
                    sorted ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
                ),
        [users, sorted]
    );

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelected(sortedUsers.map((user) => user._id));
        else setSelected([]);
    };

    const handleSelectOne = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) setSelected([...selected, id]);
        else setSelected(selected.filter((selectedId) => selectedId !== id));
    };

    const [blockUsers, blockUtils] = useBlockUsersMutation();
    const [unblockUsers, unblockUtils] = useUnblockUsersMutation();
    const [deleteUsers, deleteUtils] = useDeleteUsersMutation();

    const allowChanges =
        !isFetching &&
        !blockUtils.isLoading &&
        !unblockUtils.isLoading &&
        !deleteUtils.isLoading;

    const handleBlockingUsers = useCallback(
        (action: 'block' | 'unblock') => {
            const idsForRequest = selected.filter((userId) => {
                const userToFilter = sortedUsers.find((user) => user._id === userId);
                return action === 'block'
                    ? userToFilter?.status !== 'blocked'
                    : userToFilter?.status === 'blocked';
            });
            setSelected([]);
            if (!idsForRequest.length) return;
            if (action === 'block') blockUsers(idsForRequest);
            else unblockUsers(idsForRequest);
        },
        [blockUsers, unblockUsers, selected, sortedUsers]
    );

    const handleDeleteUsers = useCallback(() => {
        deleteUsers(selected);
        setSelected([]);
    }, [deleteUsers, selected]);

    return (
        <div className='vh-100 '>
            <Navbar bg='info'>
                <Navbar.Collapse className='justify-content-end'>
                    <Navbar.Text>
                        Hello,{' '}
                        <span className={styles.highlighted}>{currentUser.name}</span>!
                        <span
                            onClick={handleLogout}
                            className={`${styles.highlighted} ${styles.pi}`}
                        >
                            Logout
                        </span>
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
            <Container className='mt-5'>
                <Row className='mb-3 justify-content-md-start'>
                    <Button
                        disabled={!allowChanges}
                        onClick={() => handleBlockingUsers('block')}
                        variant='light'
                        className={styles.btn}
                    >
                        <Lock /> Block
                    </Button>
                    <Button
                        disabled={!allowChanges}
                        onClick={() => handleBlockingUsers('unblock')}
                        variant='light'
                        className={styles.btnSmall}
                    >
                        <LockOpen />
                    </Button>
                    <Button
                        disabled={!allowChanges}
                        onClick={handleDeleteUsers}
                        variant='danger'
                        className={styles.btnSmall}
                    >
                        <Trash />
                    </Button>
                </Row>
                <Table variant='light' className='table-bordered' table-responsive='lg'>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>
                                <FormCheck aria-label='check/uncheck all'>
                                    <FormCheck.Input
                                        className={styles.checkbox}
                                        checked={selected.length === sortedUsers.length}
                                        onChange={handleSelectAll}
                                    />
                                </FormCheck>
                            </th>
                            <th onClick={() => setSorted(!sorted)}>Name</th>
                            <th>Email</th>
                            <th>Last login</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isSuccess &&
                            sortedUsers.map((user) => (
                                <tr
                                    key={user._id}
                                    className={`${
                                        selected.includes(user._id)
                                            ? 'table-active '
                                            : null
                                    }`}
                                >
                                    <td style={{ textAlign: 'center' }}>
                                        <FormCheck aria-label='check/uncheck all'>
                                            <FormCheck.Input
                                                className={styles.checkbox}
                                                checked={selected.includes(user._id)}
                                                onChange={handleSelectOne(user._id)}
                                            />
                                        </FormCheck>
                                    </td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {dayjs(user.lastLogin).format(
                                            'HH:mm:ss, D MMM, YYYY'
                                        )}
                                    </td>
                                    <td>
                                        <div className='d-flex justify-content-around align-items-center'>
                                            {user.status}
                                            {user.status === 'online' ? (
                                                <div className={styles.online} />
                                            ) : user.status === 'offline' ? (
                                                <div className={styles.offline} />
                                            ) : (
                                                <Lock />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </Table>
                {isLoading && <LoadingSpinner color='black' centered />}
            </Container>
        </div>
    );
}

export default UserTable;
