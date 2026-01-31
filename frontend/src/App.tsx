import {createBrowserRouter, RouterProvider} from "react-router";
import LoginView from "./view/LoginView.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import WeightView from "./view/WeightView.tsx";
import MainLayout from "./layouts/MainLayout.tsx";
import HomeView from "./view/HomeView.tsx";

const router = createBrowserRouter([
    // Public route
    { path: "/login", Component: LoginView },

    // Protected routes
    {
        Component: ProtectedRoute,
        children: [
            {
                Component: MainLayout,
                children: [
                    { path: "/", Component: HomeView },
                    { path: "/weight", Component: WeightView },
                ],
            },
        ],
    },
]);

function App() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
}

export default App;
