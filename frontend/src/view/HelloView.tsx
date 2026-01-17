import {useEffect, useState, useTransition} from 'react';
import {helloApi} from '../api/apiClient';
import {NavLink} from "react-router";

function HelloView() {
    const [message, setMessage] = useState<string>();
    const [isPending, startTransition] = useTransition();

    const loadMessage = () => {
        startTransition(async () => {
            const axiosResponse = await helloApi.hello();
            setMessage(axiosResponse.data);
        });
    };

    useEffect(loadMessage, []);

    if (isPending || !message) return <div>Loading...</div>;

    return (
        <div>
            <NavLink to="/">Home</NavLink>
            <h1>Hello API Response</h1>
            <p>{message}</p>
            <button onClick={loadMessage}>Refresh</button>
        </div>
    );
}

export default HelloView;
