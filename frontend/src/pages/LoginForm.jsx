import { Formik, Field, ErrorMessage } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import apiPath from '../routes.js';
import authContext from '../context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';

const { loginPath, pages } = apiPath;

const LoginForm = () => {
  const { t } = useTranslation();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('errors.userNameRequired')),
    password: Yup.string().required(t('errors.passwordRequired')),
  });

  const location = useLocation();
  const navigate = useNavigate();

  const [signed, setSigned] = useState(true);
  const [netWorkError, setNetWorkError] = useState(false);
  const notify = () => toast(netWorkError);
  const context = useContext(authContext);
  const { login } = context;

  useEffect(() => {
    if (netWorkError !== false) {
      notify();
    }
  }, [netWorkError]);

  const myHandleSubmit = async (values) => {
    try {
      const response = await axios.post(loginPath(), {
        username: values.username,
        password: values.password,
      });

      const { token, username } = response.data;
      login(token, username);
      const { from } = location.state || { from: { pathname: pages.mainPage } };
      navigate(from);
    } catch (error) {
      if (error.response?.status === 401) {
        setSigned(false);
      } else {
        setNetWorkError(error.message);
      }
    }
  };

  return (
    <div className="h-100 bg-light">
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href={pages.mainPage}>{t('title')}</a>
              </div>
            </nav>
            <div className="container-fluid h-100">
              <div className="row justify-content-center align-content-center h-100">
                <div className="col-12 col-md-8 col-xxl-6">
                  <div className="card shadow-sm">
                    <div className="card-body p-5">
                      <Formik initialValues={{ username: '', password: '' }} validationSchema={validationSchema} onSubmit={myHandleSubmit}>
                        {({ handleSubmit, isSubmitting }) => (
                          <Form onSubmit={handleSubmit} className="mt-3 mt-mb-0">
                            <h1 className="text-center mb-4">{t('logIn')}</h1>
                            {signed === false && (
                              <Alert variant="danger">
                                {t('errors.userNotFound')}
                              </Alert>
                            )}
                            {netWorkError !== false && (
                              <Alert variant="danger">
                                {netWorkError}
                              </Alert>
                            )}
                            <Form.Group className="form-floating mb-3">
                              <Field className="form-control" type="text" id="username" name="username" />
                              <Form.Label htmlFor="username">{t('nickName')}</Form.Label>
                              <ErrorMessage name="username" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="form-floating mb-4">
                              <Field className="form-control" type="password" id="password" name="password" />
                              <Form.Label htmlFor="password">{t('password')}</Form.Label>
                              <ErrorMessage name="password" component="div" className="text-danger" />
                            </Form.Group>
                            <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting}>
                              {t('logIn')}
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="card-footer p-4">
                      <div className="text-center">
                        <span>{t('noAcc')}</span>
                        {' '}
                        <a href={pages.signupPage}>{t('signUpTitle')}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
