import {createBrowserRouter, NavLink, RouterProvider} from "react-router";
import CounterView from "./view/CounterView.tsx";
import LoginView from "./view/LoginView.tsx";

function Root() {
    return <div>
        <NavLink to="/counter">Counter</NavLink>
        {' | '}
        <NavLink to="/login">Login</NavLink>
    </div>
}

const router = createBrowserRouter([
    {path: "/", Component: Root},
    {path: "/counter", Component: CounterView},
    {path: "/login", Component: LoginView},
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App
