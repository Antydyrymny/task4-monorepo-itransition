// import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { useLogOutMutation } from '../../app/services/api';

function Table() {
    const [logout] = useLogOutMutation();
    // sortComparer: (a: User, b: User) => (a.name > b.name ? 1 : -1),
    return <div onClick={() => logout()}>Logout</div>;
}

export default Table;
