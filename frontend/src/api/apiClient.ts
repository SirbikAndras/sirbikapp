import { Configuration, HelloControllerApi } from './generated';

const config = new Configuration({
    basePath: '',
});

export const helloApi = new HelloControllerApi(config);
