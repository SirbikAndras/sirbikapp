import { Configuration, LoginControllerApi } from './generated';

const config = new Configuration({
    basePath: '',
});

export const loginApi = new LoginControllerApi(config);
