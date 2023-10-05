import { useState, useCallback } from 'react';
import { Container, Row, Navbar, Button } from 'react-bootstrap';
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
import UserTable from './UserTable';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Lock from '../../assets/Lock';
import LockOpen from '../../assets/LockOpen';
import Trash from '../../assets/Trash';
import styles from './userTable.module.scss';

function TablePage() {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser) as User;
    const [logout] = useLogOutMutation();
    const handleLogout = () => {
        logout();
        dispatch(clearAuth());
    };

    const { data: users = [], isLoading, isSuccess, isFetching } = useGetUsersQuery();

    const [selected, setSelected] = useState<string[]>([]);

    const handleSelectAll = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) setSelected(users.map((user) => user._id));
            else setSelected([]);
        },
        [users]
    );
    const handleSelectOne = useCallback(
        (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) setSelected([...selected, id]);
            else setSelected(selected.filter((selectedId) => selectedId !== id));
        },
        [selected]
    );

    const [blockUsers, blockUtils] = useBlockUsersMutation();
    const [unblockUsers, unblockUtils] = useUnblockUsersMutation();
    const [deleteUsers, deleteUtils] = useDeleteUsersMutation();

    const allowChanges =
        !isFetching &&
        !blockUtils.isLoading &&
        !unblockUtils.isLoading &&
        !deleteUtils.isLoading;

    const handleBlockingUsers = useCallback(
        async (action: 'block' | 'unblock') => {
            const idsForRequest = selected.filter((userId) => {
                const userToFilter = users.find((user) => user._id === userId);
                return action === 'block'
                    ? userToFilter?.status !== 'blocked'
                    : userToFilter?.status === 'blocked';
            });
            if (!idsForRequest.length) {
                setSelected([]);
                return;
            }
            if (action === 'block') await blockUsers(idsForRequest);
            else await unblockUsers(idsForRequest);
            setSelected([]);
        },
        [blockUsers, unblockUsers, selected, users]
    );

    const handleDeleteUsers = useCallback(async () => {
        await deleteUsers(selected);
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
                    {!isLoading && !allowChanges && (
                        <LoadingSpinner color='black' inline />
                    )}
                </Row>
                <UserTable
                    users={users}
                    isSuccess={isSuccess}
                    selected={selected}
                    handleSelectAll={handleSelectAll}
                    handleSelectOne={handleSelectOne}
                    allowChanges={allowChanges}
                />
                {isLoading && <LoadingSpinner color='black' centered />}
            </Container>
        </div>
    );
}

export default TablePage;
