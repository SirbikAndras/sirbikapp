import { useNavigate, useLocation } from "react-router";
import { JWT_TOKEN_KEY } from "../api/axiosInstance";
import HomeIcon from "../icons/HomeIcon";
import ScaleIcon from "../icons/ScaleIcon";
import LogOutIcon from "../icons/LogOutIcon";

interface MenuItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/weight", label: "Weight", icon: <ScaleIcon /> },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        sessionStorage.removeItem(JWT_TOKEN_KEY);
        navigate("/login");
    };

    const getUserInitials = () => {
        const token = sessionStorage.getItem(JWT_TOKEN_KEY);
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const email = payload.sub || "";
                return email.substring(0, 2).toUpperCase() || "U";
            } catch {
                return "U";
            }
        }
        return "U";
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className="w-60 bg-(--color-card) flex flex-col p-6 gap-6">
            {/* User Avatar */}
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-(--color-bg) font-semibold text-lg"
                style={{
                    background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                }}
            >
                {getUserInitials()}
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => (
                <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                        isActive(item.path)
                            ? "text-(--color-accent)"
                            : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    }`}
                    style={
                        isActive(item.path)
                            ? { background: "rgba(201, 169, 98, 0.1)" }
                            : undefined
                    }
                >
                    {item.icon}
                    <span className="font-body font-medium">{item.label}</span>
                </button>
            ))}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-(--color-border) text-(--color-text-secondary) hover:text-(--color-text-primary) hover:border-(--color-text-secondary) transition-colors cursor-pointer"
            >
                <LogOutIcon />
                <span className="font-body font-medium">Logout</span>
            </button>
        </aside>
    );
}
