import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    return (
        <div className="flex h-screen bg-(--color-bg)">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
