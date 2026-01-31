import {NavLink} from "react-router";
import {counterApi} from "../api/apiClient.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

export default function CounterView() {
    const queryClient = useQueryClient();

    const { data: counter, isPending: queryPending, error: counterError } = useQuery({
        queryKey: ['counter'],
        queryFn: async () => counterApi.getCounter().then(r => r.data),
        retry: false
    })

    const mutation = useMutation({
        mutationFn: async () => counterApi.incrementCounter().then(r => r.data),
        onSuccess: (newCounter) => {
            queryClient.setQueryData(['counter'], newCounter);
        }
    })

    if (counterError) {
        return <div><NavLink to="/">Home</NavLink>Error: {counterError.message}</div>
    }

    const isLoading = queryPending || mutation.isPending;

    return (
        <>
            <NavLink to="/">Home</NavLink>
            <div className="card">
                {isLoading ? <div>Api call...</div> : <button onClick={() => mutation.mutate()}>
                    count is {counter}
                </button>}
            </div>
        </>
    )
}