import {createBrowserRouter, NavLink, RouterProvider} from "react-router";
import LoginView from "./view/LoginView.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import WeightView from "./view/WeightView.tsx";

function Root() {
    return <div>
        <NavLink to="/weight">Weight</NavLink>
        {' | '}
        <NavLink to="/login">Login</NavLink>
    </div>
}

const router = createBrowserRouter([
    // Public route
    {path: "/login", Component: LoginView},

    // Protected routes
    {
        Component: ProtectedRoute,
        children: [
            {path: "/", Component: Root},
            {path: "/weight", Component: WeightView},
        ],
    },
]);

function App() {

    const queryClient = new QueryClient();

    return <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
    </QueryClientProvider>;
}

export default App
