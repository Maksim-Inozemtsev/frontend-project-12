import { Formik, Field, ErrorMessage } from 'formik';
import { Navigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Form, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiPath from '../../routes.js';
import authContext from '../context';

const { loginPage } = apiPath;

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
});

const LoginForm = () => {
  const [redirect, setRedirect] = useState(false);
  const [signed, setSigned] = useState(true);
  const [netWorkError, setNetWorkError] = useState(false);
  const context = useContext(authContext);
  const { login } = context;

  const myHandleSubmit = async (values) => {
    try {
      const response = await axios.post(loginPage(), {
        username: values.username,
        password: values.password,
      });

      const { token, username } = response.data;
      login(token, username);
      setRedirect(true);
    } catch (error) {
      if (error.response.status === 401) {
        setSigned(false);
      } else {
        setNetWorkError(error.message);
      }
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <body className="h-100 bg-light">
      <div className="h-100">
        <div className="h-100" id="chat">
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">Hexlet Chat</a>
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
                            <h1 className="text-center mb-4">Войти</h1>
                            {signed === false && (
                              <Alert variant="danger">
                                {'Пользователь не найден!'}
                              </Alert>
                            )}
                            {netWorkError !== false && (
                              <Alert variant="danger">
                                {netWorkError}
                              </Alert>
                            )}
                            <Form.Group className="form-floating mb-3">
                              <Field className="form-control" type="text" id="username" name="username" />
                              <Form.Label htmlFor="username">Ваш ник</Form.Label>
                              <ErrorMessage name="username" component="div" className='text-danger'/>
                            </Form.Group>
                            <Form.Group className="form-floating mb-4">
                              <Field className="form-control" type="password" id="password" name="password" />
                              <Form.Label htmlFor="password">Пароль</Form.Label>
                              <ErrorMessage name="password" component="div" className='text-danger' />
                            </Form.Group>
                            <button className="w-100 mb-3 btn btn-outline-primary" type="submit" disabled={isSubmitting}>
                              Войти
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="card-footer p-4">
                      <div className="text-center"><span>Нет аккаунта?</span> <a href="/signup">Регистрация</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="Toastify"></div>
        </div>
      </div>
    </body>
  );
};

export default LoginForm;
