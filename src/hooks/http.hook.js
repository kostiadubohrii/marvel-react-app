import {useState, useCallback } from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false),
          [error, setError] = useState(null),
          [process, setProcess] = useState('waiting');

    const request = useCallback(async (url, method = 'GET', body = null, headers={'Content-Type': 'application/json'}) => {
        setLoading(true); // Спочатку завантаження ставиться true. Тобто ми проводимо анімацію завантаження. 
        setProcess('loading');

        try {
            const response = await fetch(url, {method, body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            const data = await response.json();

            setLoading(false); // Тут закінчуємо анімацію завантаження.
            setProcess('confirmed');
            return data;
        } catch(e) {
            setLoading(false);
            setProcess('error');
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null);
        setProcess('loading');
    }, []);
    
    return {loading, request, error, clearError, process, setProcess}
}