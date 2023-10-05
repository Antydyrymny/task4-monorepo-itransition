import { FormCheck } from 'react-bootstrap';
import dayjs from 'dayjs';
import type { User } from '../../app/services/api';
import Lock from '../../assets/Lock';
import styles from './userTable.module.scss';

type UserRowProps = {
    user: User;
    selected: string[];
    handleSelectOne: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function UserRow({ user, selected, handleSelectOne }: UserRowProps) {
    return (
        <tr className={`${selected.includes(user._id) ? 'table-active ' : null}`}>
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
            <td>{dayjs(user.lastLogin).format('HH:mm:ss, D MMM, YYYY')}</td>
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
    );
}

export default UserRow;
