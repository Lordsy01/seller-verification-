import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'savedProductIds';

async function getSavedIds(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function useSaved(productId: string) {
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        getSavedIds().then((ids) => setIsSaved(ids.includes(productId)));
    }, [productId]);

    const toggleSaved = useCallback(async () => {
        const ids = await getSavedIds();
        const next = ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setIsSaved(!isSaved);
    }, [productId, isSaved]);

    return { isSaved, toggleSaved };
}