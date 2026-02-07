import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useRef, useState} from "react";
import PlusIcon from "../icons/PlusIcon";
import {torrentApi} from "../api/apiClient.ts";
import type {TorrentSummaryDTO} from "../api/generated";

function formatBytes(value: number): string {
    if (!Number.isFinite(value) || value <= 0) {
        return "0 B";
    }

    const units = ["B", "KiB", "MiB", "GiB", "TiB"];
    let size = value;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
}

function formatSpeed(value: number): string {
    return `${formatBytes(value)}/s`;
}

function statusLabel(torrent: TorrentSummaryDTO): string {
    const percent = Math.round(torrent.progress! * 100);
    if (torrent.status === "DOWNLOADING") {
        return `${percent}% Downloading`;
    }

    if (torrent.status === "SEEDING") {
        return "Seeding";
    }

    if (torrent.status === "PAUSED") {
        return `Paused (${percent}%)`;
    }

    return "100% Complete";
}

function statusColor(status: string): string {
    switch (status) {
        case "DOWNLOADING":
            return "#F5F5F0";
        case "SEEDING":
            return "#4CAF50";
        case "PAUSED":
            return "#6E6E70";
        case "COMPLETED":
            return "#C9A962";
        default:
            return "#F5F5F0";
    }
}

export default function TorrentView() {
    const [selectedCategory, setSelectedCategory] = useState<string>('TV');
    const queryClient = useQueryClient();

    const {data: torrents = [], isPending: isTorrentsPending} = useQuery({
        queryKey: ["torrents"],
        queryFn: () => torrentApi.getTorrents(selectedCategory).then(resp => resp.data),
        refetchInterval: 5000,
    });

    const invalidateTorrents = async () => {
        await queryClient.invalidateQueries({queryKey: ["torrents"]});
    };

    const deleteMutation = useMutation({
        mutationFn: ({hash, deleteFiles}: { hash: string; deleteFiles: boolean }) =>
            torrentApi.deleteTorrent(hash, deleteFiles),
        onSuccess: invalidateTorrents,
    });

    return (
        <div className="p-8 flex flex-col gap-6 h-full overflow-auto">
            <div className="flex flex-col gap-2">
                <h1 className="font-heading text-4xl text-(--color-text-primary)">Active Torrents</h1>
                <p className="font-body text-sm text-(--color-text-secondary)">
                    Manage and monitor your torrent downloads
                </p>
            </div>

            <UpperBar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

            <div className="flex-1">
                {isTorrentsPending ? (
                    <div className="font-body text-(--color-text-secondary)">Loading torrents...</div>
                ) : torrents.length === 0 ? (
                    <div className="font-body text-(--color-text-secondary)">No torrents available for this
                        filter.</div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-4">
                        {torrents.map((torrent) => {
                            const progressPercent = Math.max(0, Math.min(100, Math.round(torrent.progress! * 100)));

                            return (
                                <div
                                    key={torrent.hash}
                                    className="bg-(--color-card) border border-(--color-border) rounded-2xl p-4 flex flex-col gap-3"
                                >
                                    <div
                                        className="font-body text-sm font-semibold text-(--color-text-primary) truncate">
                                        {torrent.name || torrent.hash}
                                    </div>

                                    <div className="h-1.5 rounded-full bg-(--color-border) overflow-hidden">
                                        <div
                                            className="h-full"
                                            style={{
                                                width: `${progressPercent}%`,
                                                background:
                                                    "linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                                            }}
                                        />
                                    </div>

                                    <div className="font-body text-xs font-semibold"
                                         style={{color: statusColor(torrent.status as string)}}>
                                        {statusLabel(torrent)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs font-body">
                                        <Label title="Category" value={torrent.category || "-"}/>
                                        <Label title="Size" value={formatBytes(torrent.size!)}/>
                                        <Label title="DL" value={formatSpeed(torrent.downloadSpeed!)}/>
                                        <Label title="UL" value={formatSpeed(torrent.uploadSpeed!)}/>
                                    </div>

                                    <div className="grid grid-cols-1 gap-2">
                                        <button
                                            onClick={() => {
                                                if (window.confirm("Delete torrent and remove downloaded files?")) {
                                                    deleteMutation.mutate({hash: torrent.hash!, deleteFiles: true});
                                                }
                                            }}
                                            className="h-9 rounded-lg border border-(--color-border) text-(--color-text-primary) font-body text-xs cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function UpperBar({selectedCategory, onCategoryChange}: { selectedCategory?: string, onCategoryChange?: (category: string) => void }) {

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const {data: categories} = useQuery({
        queryKey: ['categories'],
        queryFn: () => torrentApi.getCategories().then(resp => resp.data),
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            await torrentApi.addTorrent(file);
        },
        onSuccess: async () => {
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        },
    });

    return <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="h-11 px-5 rounded-xl flex items-center gap-2 text-(--color-bg) font-body font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                    background:
                        "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                }}
            >
                <PlusIcon/>
                <span>{uploadMutation.isPending ? "Uploading..." : "Add torrent"}</span>
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".torrent"
                className="hidden"
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        uploadMutation.mutate(file);
                    }
                }}
            />

            {categories && <select
                value={selectedCategory}
                onChange={(event) => onCategoryChange?.(event.target.value as string)}
                className="h-11 px-4 rounded-xl bg-transparent border border-(--color-border) text-(--color-text-primary) font-body"
            >
                {categories.map((cat) => (
                    <option key={cat.name} value={cat.name} className="bg-(--color-card)">
                        {cat.name}
                    </option>
                ))}
            </select>}
        </div>
    </div>
}

function Label({title, value}: { title: string, value: string }) {
    return <div className="w-full flex justify-between">
        <span className="text-(--color-text-secondary)">{title}</span>
        <span className="text-(--color-text-primary) text-right">{value}</span>
    </div>
}
