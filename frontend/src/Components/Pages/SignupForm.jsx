import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import apiPath from '../../routes.js';
import authContext from '../context';

const { signupPage } = apiPath;

const schema = yup.object().shape({
  username: yup.string().min(3, 'Имя должно содержать не менее 3 символов').max(20, 'Имя должно содержать не более 20 символов').required('Введите имя пользователя'),
  password: yup.string().min(6, 'Пароль должен содержать не менее 6 символов').required('Введите пароль'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
});

const SignupForm = () => {
  const [redirect, setRedirect] = useState(false);
  const [signupError, setSignupError] = useState(null);
    
  const context = useContext(authContext);
  const { login } = context;
  
  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const myHandleSubmit = async (values) => {
    try {
        const response = await axios.post(signupPage(), {
          username: values.username,
          password: values.password,
        });
  
        const { token, username } = response.data;
        login(token, username);
        setRedirect(true);
      } catch (error) {
        if (error.response.status === 409) {
          setSignupError('Такой пользователь уже существует');
        } else {
        setSignupError(error.message);
        }
      }
      
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="d-flex flex-column h-100 bg-light">
      <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
        <div className="container">
          <a className="navbar-brand" href="/">Hexlet Chat</a>
        </div>
      </nav>
      <div className="container-fluid h-100">
        <div className="row justify-content-center align-content-center h-100">
          <div className="col-12 col-md-8 col-xxl-6">
            <div className="card shadow-sm">
              <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                <Formik initialValues={initialValues} validationSchema={schema} onSubmit={myHandleSubmit}>
                  {({ handleSubmit, isSubmitting }) => (
                    <Form className="w-50" onSubmit={handleSubmit}>
                      <h1 className="text-center mb-4">Регистрация</h1>
                      <div className="form-floating mb-3">
                        <Field type="text" id="username" name="username" className="form-control" />
                        <label htmlFor="username" className="form-label">
                          Имя пользователя
                        </label>
                        <ErrorMessage name="username" component="div" className="text-danger" />
                      </div>
                      <div className="form-floating mb-3">
                        <Field type="password" id="password" name="password" className="form-control" />
                         <label htmlFor="password" className="form-label">
                          Пароль
                        </label>
                        <ErrorMessage name="password" component="div" className="text-danger" />
                      </div>
                      <div className="form-floating mb-4">
                        <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
                        <label htmlFor="confirmPassword" className="form-label">
                          Подтвердите пароль
                        </label>
                          {signupError !== null && (
                            <div className="text-danger">{signupError}</div>
                          )}
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                      </div>
                      <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Зарегистрироваться
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
