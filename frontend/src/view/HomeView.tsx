import TargetIcon from "../icons/TargetIcon";
import FlagIcon from "../icons/FlagIcon";
import FlameIcon from "../icons/FlameIcon";
import PlusIcon from "../icons/PlusIcon";
import SettingsIcon from "../icons/SettingsIcon";

const stats = {
    currentWeight: 75.2,
    goalWeight: 70.0,
    streak: 7,
};

const weeklyProgress = [
    { day: "Mon", height: 100 },
    { day: "Tue", height: 85 },
    { day: "Wed", height: 95 },
    { day: "Thu", height: 75 },
    { day: "Fri", height: 70 },
    { day: "Sat", height: 65 },
    { day: "Today", height: 60, isToday: true },
];

interface StatCardProps {
    icon: React.ComponentType;
    label: string;
    value: string;
    subtext: string;
    accent?: boolean;
}

function StatCard({ icon: Icon, label, value, subtext, accent }: StatCardProps) {
    return (
        <div
            className={`flex-1 bg-(--color-card) rounded-2xl p-6 flex flex-col gap-3 ${
                accent ? "border-2 border-(--color-accent)" : "border border-(--color-border)"
            }`}
        >
            <div className="flex items-center gap-2 text-(--color-text-secondary)">
                <Icon />
                <span className="font-body text-xs font-medium uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <span className="font-heading text-4xl text-(--color-text-primary)">{value}</span>
            <span className="font-body text-sm text-(--color-text-secondary)">{subtext}</span>
        </div>
    );
}

interface ProgressBarProps {
    day: string;
    height: number;
    isToday?: boolean;
}

function ProgressBar({ day, height, isToday }: ProgressBarProps) {
    const maxHeight = 120;
    const barHeight = (height / 100) * maxHeight;

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="w-6 rounded-md"
                style={{
                    height: `${barHeight}px`,
                    background: isToday
                        ? "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)"
                        : "var(--color-border)",
                }}
            />
            <span
                className={`font-body text-xs ${
                    isToday ? "text-(--color-accent) font-medium" : "text-(--color-text-secondary)"
                }`}
            >
                {day}
            </span>
        </div>
    );
}

export default function HomeView() {
    const toGoWeight = (stats.currentWeight - stats.goalWeight).toFixed(1);

    return (
        <div className="p-8 flex flex-col gap-8 h-full">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl text-(--color-text-primary)">
                    Welcome back, John
                </h1>
                <p className="font-body text-sm text-(--color-text-secondary)">
                    Here's your health journey at a glance
                </p>
            </div>

            {/* Stats Row */}
            <div className="flex gap-6">
                <StatCard
                    icon={TargetIcon}
                    label="Current Weight"
                    value={`${stats.currentWeight} kg`}
                    subtext="Updated today"
                    accent
                />
                <StatCard
                    icon={FlagIcon}
                    label="Goal Weight"
                    value={`${stats.goalWeight.toFixed(1)} kg`}
                    subtext={`${toGoWeight} kg to go`}
                />
                <StatCard
                    icon={FlameIcon}
                    label="Logging Streak"
                    value={`${stats.streak} days`}
                    subtext="Keep it up!"
                />
            </div>

            {/* Progress Section */}
            <div className="bg-(--color-card) rounded-2xl p-6 border border-(--color-border) flex flex-col gap-6">
                <h2 className="font-heading text-xl text-(--color-text-primary)">
                    Your Progress
                </h2>
                <div className="flex items-end justify-between gap-4 px-4">
                    {weeklyProgress.map((item) => (
                        <ProgressBar
                            key={item.day}
                            day={item.day}
                            height={item.height}
                            isToday={item.isToday}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <button
                    className="flex items-center justify-center gap-2 h-13 px-6 rounded-xl font-body font-medium cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                        background:
                            "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                        color: "var(--color-bg)",
                    }}
                >
                    <PlusIcon />
                    <span>Log Today's Weight</span>
                </button>
                <button className="flex items-center justify-center gap-2 h-13 px-6 rounded-xl font-body font-medium border border-(--color-border) text-(--color-text-primary) bg-transparent cursor-pointer transition-colors hover:border-(--color-text-secondary)">
                    <SettingsIcon />
                    <span>Update Goal</span>
                </button>
            </div>
        </div>
    );
}
