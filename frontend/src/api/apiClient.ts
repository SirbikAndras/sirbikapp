import {Configuration, WeightControllerApi, LoginControllerApi} from './generated';
import axiosInstance from './axiosInstance';

const config = new Configuration({
    basePath: '',
});

export const loginApi = new LoginControllerApi(config, '', axiosInstance);
export const weightApi = new WeightControllerApi(config, '', axiosInstance);
