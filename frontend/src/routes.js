const api = '/api/v1/';

export default {
    loginPage: () => [api, 'login'].join(''),
    getData: () => [api, 'data'].join(''),
}