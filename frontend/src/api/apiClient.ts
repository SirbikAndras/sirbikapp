import {Configuration, WeightControllerApi, LoginControllerApi, TorrentControllerApi} from './generated';
import axiosInstance from './axiosInstance';

const config = new Configuration({
    basePath: '',
});

export const loginApi = new LoginControllerApi(config, '', axiosInstance);
export const weightApi = new WeightControllerApi(config, '', axiosInstance);
export const torrentApi = new TorrentControllerApi(config, '', axiosInstance);
