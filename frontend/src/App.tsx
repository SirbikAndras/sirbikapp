import {createBrowserRouter, NavLink, RouterProvider} from "react-router";
import CounterView from "./view/CounterView.tsx";
import HelloView from "./view/HelloView.tsx";

function Root() {
    return <div>
        <NavLink to="/counter">Counter</NavLink>
        {' | '}
        <NavLink to="/hello">Hello API</NavLink>
    </div>
}

const router = createBrowserRouter([
    {path: "/", Component: Root},
    {path: "/counter", Component: CounterView},
    {path: "/hello", Component: HelloView},
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App
