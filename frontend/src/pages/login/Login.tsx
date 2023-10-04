import { useState } from 'react';
import { useLoginMutation } from '../../app/services/api';
import useRedirectAuthenticated from '../../hooks/useRedirectAuthenticated';

function Login() {
    useRedirectAuthenticated('/');

    return <div>login</div>;
}

export default Login;
