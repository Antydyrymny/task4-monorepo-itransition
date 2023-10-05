import { useState, useMemo } from 'react';
import { Table, FormCheck } from 'react-bootstrap';
import UserRow from './UserRow';
import type { User } from '../../app/services/api';
import dropDown from '../../assets/sortDown24.png';
import styles from './userTable.module.scss';

type UserTableProps = {
    users: User[];
    isSuccess: boolean;
    selected: string[];
    handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelectOne: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    allowChanges: boolean;
};

function UserTable({
    users,
    isSuccess,
    selected,
    handleSelectAll,
    handleSelectOne,
    allowChanges,
}: UserTableProps) {
    const [sorted, setSorted] = useState(true);
    const sortedUsers = useMemo(
        () =>
            users
                .slice()
                .sort((a, b) =>
                    sorted ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
                ),
        [users, sorted]
    );

    return (
        <Table
            variant='light'
            className={`table-bordered ${!allowChanges ? styles.fetching : null}`}
            table-responsive='lg'
        >
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
                    <th onClick={() => setSorted(!sorted)} className={styles.sort}>
                        Name
                        <img
                            src={dropDown}
                            className={`${!sorted ? styles.sortUp : null}`}
                        />
                    </th>
                    <th>Email</th>
                    <th>Last login</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {isSuccess &&
                    sortedUsers.map((user) => (
                        <UserRow
                            key={user._id}
                            user={user}
                            selected={selected}
                            handleSelectOne={handleSelectOne}
                        />
                    ))}
            </tbody>
        </Table>
    );
}

export default UserTable;
