import {createBrowserRouter, NavLink, RouterProvider} from "react-router";
import CounterView from "./view/CounterView.tsx";

function Root() {
    return <div>
        <NavLink to="/counter">Counter</NavLink>
    </div>
}

const router = createBrowserRouter([
    {path: "/", Component: Root},
    {path: "/counter", Component: CounterView},
]);

function App() {
    return <RouterProvider router={router}/>
}

export default App
