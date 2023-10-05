import { useEffect } from 'react';
import { ActionCreator } from '@reduxjs/toolkit';

/**
 * Hydrates slice with respective localStorage state if it exists
 * @param key localStorage key for slice state
 * @param hydrateState action creator to populate the slice state
 */
export default function usePreservedState(
    key: string,
    hydrateState: ActionCreator<unknown>
) {
    useEffect(() => {
        const storedValue = window.localStorage.getItem(key);
        if (storedValue) hydrateState(JSON.parse(storedValue));
    }, [hydrateState, key]);
}
