// import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useLogOutMutation } from '../../app/services/api';
import { useAppDispatch } from '../../app/storeHooks';
import { clearAuth } from '../../features/auth/authSlice';

function Table() {
    const dispatch = useAppDispatch();
    const [logout] = useLogOutMutation();
    // sortComparer: (a: User, b: User) => (a.name > b.name ? 1 : -1),
    return (
        <div
            onClick={() => {
                logout();
                dispatch(clearAuth());
            }}
        >
            Logout
        </div>
    );
}

export default Table;
