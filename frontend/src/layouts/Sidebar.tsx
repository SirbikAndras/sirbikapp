import { useNavigate, useLocation } from "react-router";
import { JWT_TOKEN_KEY } from "../api/axiosInstance";
import HomeIcon from "../icons/HomeIcon";
import ScaleIcon from "../icons/ScaleIcon";
import LogOutIcon from "../icons/LogOutIcon";
import DownloadIcon from "../icons/DownloadIcon";

interface MenuItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
    { path: "/", label: "Home", icon: <HomeIcon /> },
    { path: "/weight", label: "Weight", icon: <ScaleIcon /> },
    { path: "/torrent", label: "Torrents", icon: <DownloadIcon /> },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem(JWT_TOKEN_KEY);
        navigate("/login");
    };

    const getUserInitials = () => {
        const token = localStorage.getItem(JWT_TOKEN_KEY);
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
        <aside className="w-60 bg-(--color-card) flex flex-col px-4 py-6">
            <div className="flex flex-col gap-6">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-(--color-bg) font-semibold text-lg"
                    style={{
                        background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                    }}
                >
                    {getUserInitials()}
                </div>

                <div className="flex flex-col gap-1">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`h-11 flex items-center gap-3 px-3 rounded-[10px] cursor-pointer transition-colors ${
                                    active
                                        ? "bg-(--color-border) text-(--color-text-primary)"
                                        : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                                }`}
                            >
                                <span className={active ? "text-(--color-accent)" : "text-(--color-text-secondary)"}>
                                    {item.icon}
                                </span>
                                <span className="font-body text-sm font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex-1" />

            <button
                onClick={handleLogout}
                className="h-11 flex items-center gap-3 px-3 rounded-[10px] border border-(--color-border) text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors cursor-pointer"
            >
                <LogOutIcon />
                <span className="font-body text-sm font-medium">Logout</span>
            </button>
        </aside>
    );
}
