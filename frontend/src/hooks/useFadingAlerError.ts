import { useState, useEffect } from 'react';

/**
 * Allows for autodismissable alert
 * @param isError redux-query isError value
 * @param timeout for how long to show alert
 * @returns display alert controller
 */
export default function useFadingAlerError(isError: boolean, timeout: number = 2500) {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (isError) {
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), timeout);
        }
    }, [isError, timeout]);

    return showAlert;
}
