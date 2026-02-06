import TargetIcon from "../icons/TargetIcon";
import FlagIcon from "../icons/FlagIcon";
import FlameIcon from "../icons/FlameIcon";
import PlusIcon from "../icons/PlusIcon";
import SettingsIcon from "../icons/SettingsIcon";
import { useQuery } from "@tanstack/react-query";
import { homeApi } from "../api/homeApi.ts";
import { useNavigate } from "react-router";

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
    const navigate = useNavigate();
    const { data: stats, isPending: isStatsPending } = useQuery({
        queryKey: ["homeStats"],
        queryFn: homeApi.getStats,
    });
    const { data: weeklyProgress, isPending: isProgressPending } = useQuery({
        queryKey: ["homeProgress", 7],
        queryFn: () => homeApi.getProgress(7),
    });

    const isPending = isStatsPending || isProgressPending;
    const progress = weeklyProgress || [];
    const knownWeights = progress
        .map((item) => item.weight)
        .filter((weight): weight is number => typeof weight === "number");
    const minWeight = knownWeights.length > 0 ? Math.min(...knownWeights) : 0;
    const maxWeight = knownWeights.length > 0 ? Math.max(...knownWeights) : 1;
    const range = Math.max(maxWeight - minWeight, 0.1);

    const chartItems = progress.map((point, index) => {
        const isToday = index === progress.length - 1;
        const barWeight = point.weight;
        const normalized = typeof barWeight === "number" ? (barWeight - minWeight) / range : 0;
        return {
            day: isToday
                ? "Today"
                : new Date(point.date).toLocaleDateString("en-US", { weekday: "short" }),
            height: typeof barWeight === "number" ? 40 + normalized * 60 : 12,
            isToday,
        };
    });

    const currentWeight = stats?.currentWeight;
    const goalWeight = stats?.goalWeight;
    const toGoWeight =
        typeof currentWeight === "number" && typeof goalWeight === "number"
            ? (currentWeight - goalWeight).toFixed(1)
            : null;

    return (
        <div className="p-8 flex flex-col gap-8 h-full">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl text-(--color-text-primary)">
                    Welcome back, {stats?.userName || "there"}
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
                    value={typeof currentWeight === "number" ? `${currentWeight.toFixed(1)} kg` : "-"}
                    subtext="Latest record"
                    accent
                />
                <StatCard
                    icon={FlagIcon}
                    label="Goal Weight"
                    value={typeof goalWeight === "number" ? `${goalWeight.toFixed(1)} kg` : "-"}
                    subtext={toGoWeight !== null ? `${toGoWeight} kg to go` : "Set your target"}
                />
                <StatCard
                    icon={FlameIcon}
                    label="Logging Streak"
                    value={`${stats?.streak ?? 0} days`}
                    subtext="Keep it up!"
                />
            </div>

            {/* Progress Section */}
            <div className="bg-(--color-card) rounded-2xl p-6 border border-(--color-border) flex flex-col gap-6">
                <h2 className="font-heading text-xl text-(--color-text-primary)">
                    Your Progress
                </h2>
                <div className="flex items-end justify-between gap-4 px-4">
                    {isPending ? (
                        <span className="font-body text-sm text-(--color-text-secondary)">Loading...</span>
                    ) : chartItems.length === 0 ? (
                        <span className="font-body text-sm text-(--color-text-secondary)">No data yet</span>
                    ) : (
                        chartItems.map((item) => (
                            <ProgressBar
                                key={item.day}
                                day={item.day}
                                height={item.height}
                                isToday={item.isToday}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/weight")}
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
                <button
                    onClick={() => navigate("/weight")}
                    className="flex items-center justify-center gap-2 h-13 px-6 rounded-xl font-body font-medium border border-(--color-border) text-(--color-text-primary) bg-transparent cursor-pointer transition-colors hover:border-(--color-text-secondary)"
                >
                    <SettingsIcon />
                    <span>Update Goal</span>
                </button>
            </div>
        </div>
    );
}
