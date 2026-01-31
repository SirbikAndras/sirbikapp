import { useQuery, useQueryClient } from "@tanstack/react-query";
import { weightApi } from "../api/apiClient.ts";
import { useState } from "react";
import CalendarIcon from "../icons/CalendarIcon.tsx";
import TrendingDownIcon from "../icons/TrendingDownIcon.tsx";
import TrendingUpIcon from "../icons/TrendingUpIcon.tsx";
import HistoryIcon from "../icons/HistoryIcon.tsx";
import CheckIcon from "../icons/CheckIcon.tsx";

export default function WeightView() {
    const [newWeight, setNewWeight] = useState<string>("");

    const queryClient = useQueryClient();
    const { data: history, isPending } = useQuery({
        queryKey: ["weightHistory"],
        queryFn: async () => weightApi.getWeightHistory(0, 10).then((res) => res.data),
    });

    const addWeight = () => {
        const weightValue = parseFloat(newWeight);
        if (!isNaN(weightValue) && weightValue > 0) {
            weightApi
                .addWeight({ weight: weightValue })
                .then(async () => {
                    await queryClient.invalidateQueries({ queryKey: ["weightHistory"] });
                })
                .then(() => setNewWeight(""));
        }
    };

    const records = history?.content || [];

    const getChange = (index: number): number | null => {
        if (index >= records.length - 1) return null;
        const current = records[index]?.value;
        const previous = records[index + 1]?.value;
        if (current === undefined || previous === undefined) return null;
        return current - previous;
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getDateLabel = (dateString?: string): string => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return "Today";
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return formatDate(dateString);
    };

    const todayRecord = records[0];
    const yesterdayRecord = records[1];
    const todayChange = getChange(0);
    const yesterdayChange = getChange(1);

    return (
        <div className="p-8 flex flex-col gap-8">
            {/* Header */}
            <div>
                <h1 className="font-heading text-4xl text-(--color-text-primary) mb-2">Weight Tracker</h1>
                <p className="font-body text-(--color-text-secondary)">Track your daily weight and monitor progress</p>
            </div>

            {/* Input Section */}
            <div className="flex items-center gap-4">
                <input
                    type="number"
                    step="0.1"
                    placeholder="Enter weight (kg)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-50 px-4 py-3 rounded-lg bg-(--color-input-bg) border border-(--color-border) text-(--color-text-primary) placeholder:text-(--color-text-placeholder) font-body focus:outline-none focus:border-(--color-accent)"
                />
                <button
                    onClick={addWeight}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-(--color-bg) font-body font-semibold cursor-pointer transition-opacity hover:opacity-90"
                    style={{
                        background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                    }}
                >
                    <CheckIcon />
                    Save
                </button>
            </div>

            {/* Highlight Cards */}
            {isPending ? (
                <div className="text-(--color-text-secondary)">Loading...</div>
            ) : (
                <div className="flex gap-6">
                    {/* Today Card */}
                    <div
                        className="flex-1 p-6 rounded-xl bg-(--color-card) border-2"
                        style={{ borderColor: "var(--color-accent)" }}
                    >
                        <div className="flex items-center gap-2 text-(--color-text-secondary) mb-4">
                            <CalendarIcon />
                            <span className="font-body text-sm">Today</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="font-heading text-5xl text-(--color-text-primary)">
                                    {todayRecord?.value?.toFixed(1) ?? "-"}
                                </span>
                                <span className="font-body text-(--color-text-secondary) ml-2">kg</span>
                            </div>
                            {todayChange !== null && (
                                <div
                                    className="flex items-center gap-1 font-body text-sm"
                                    style={{ color: todayChange <= 0 ? "#4CAF50" : "#EF5350" }}
                                >
                                    {todayChange <= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                                    <span>
                                        {todayChange > 0 ? "+" : ""}
                                        {todayChange.toFixed(1)} kg
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Yesterday Card */}
                    <div
                        className="flex-1 p-6 rounded-xl bg-(--color-card) border"
                        style={{ borderColor: "var(--color-border)" }}
                    >
                        <div className="flex items-center gap-2 text-(--color-text-secondary) mb-4">
                            <CalendarIcon />
                            <span className="font-body text-sm">Yesterday</span>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="font-heading text-5xl text-(--color-text-primary)">
                                    {yesterdayRecord?.value?.toFixed(1) ?? "-"}
                                </span>
                                <span className="font-body text-(--color-text-secondary) ml-2">kg</span>
                            </div>
                            {yesterdayChange !== null && (
                                <div
                                    className="flex items-center gap-1 font-body text-sm"
                                    style={{ color: yesterdayChange <= 0 ? "#4CAF50" : "#EF5350" }}
                                >
                                    {yesterdayChange <= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                                    <span>
                                        {yesterdayChange > 0 ? "+" : ""}
                                        {yesterdayChange.toFixed(1)} kg
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* History Table */}
            <div className="flex-1">
                <div className="flex items-center gap-2 text-(--color-text-primary) mb-4">
                    <HistoryIcon />
                    <h2 className="font-heading text-2xl">Weight History</h2>
                </div>

                <div className="bg-(--color-card) rounded-xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 px-6 py-4 border-b border-(--color-border)">
                        <span className="font-body text-sm text-(--color-text-secondary)">Date</span>
                        <span className="font-body text-sm text-(--color-text-secondary)">Weight</span>
                        <span className="font-body text-sm text-(--color-text-secondary)">Change</span>
                    </div>

                    {/* Table Body */}
                    {isPending ? (
                        <div className="px-6 py-4 text-(--color-text-secondary)">Loading...</div>
                    ) : records.length === 0 ? (
                        <div className="px-6 py-4 text-(--color-text-secondary)">No records yet</div>
                    ) : (
                        records.map((record, index) => {
                            const change = getChange(index);
                            return (
                                <div
                                    key={record.date || index}
                                    className="grid grid-cols-3 px-6 py-4 border-b border-(--color-border) last:border-b-0"
                                >
                                    <span className="font-body text-(--color-text-primary)">
                                        {getDateLabel(record.date)}
                                    </span>
                                    <span className="font-body text-(--color-text-primary)">
                                        {record.value?.toFixed(1)} kg
                                    </span>
                                    <span
                                        className="font-body flex items-center gap-1"
                                        style={{
                                            color:
                                                change === null
                                                    ? "var(--color-text-secondary)"
                                                    : change <= 0
                                                      ? "#4CAF50"
                                                      : "#EF5350",
                                        }}
                                    >
                                        {change !== null ? (
                                            <>
                                                {change <= 0 ? <TrendingDownIcon /> : <TrendingUpIcon />}
                                                {change > 0 ? "+" : ""}
                                                {change.toFixed(1)} kg
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </span>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
