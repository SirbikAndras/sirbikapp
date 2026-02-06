import axiosInstance from "./axiosInstance";

export interface HomeStatsResponse {
    userName: string;
    currentWeight?: number;
    goalWeight?: number;
    streak: number;
}

export interface HomeProgressPointResponse {
    date: string;
    weight?: number;
}

export const homeApi = {
    getStats: async (): Promise<HomeStatsResponse> =>
        axiosInstance.get<HomeStatsResponse>("/api/home/stats").then((res) => res.data),
    getProgress: async (days = 7): Promise<HomeProgressPointResponse[]> =>
        axiosInstance
            .get<HomeProgressPointResponse[]>("/api/home/progress", { params: { days } })
            .then((res) => res.data),
};
