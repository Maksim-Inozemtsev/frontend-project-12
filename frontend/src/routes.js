const api = '/api/v1/';

export default {
  loginPath: () => [api, 'login'].join(''),
  getDataPath: () => [api, 'data'].join(''),
  signupPath: () => [api, 'signup'].join(''),
  pages: {
    mainPage: '/',
    loginPage: '/login',
    signupPage: '/signup',
    notFoundPage: '*',
  },
};
