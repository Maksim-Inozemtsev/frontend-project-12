import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Alert } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import apiPath from '../../routes.js';
import authContext from '../context';

const { signupPage } = apiPath;

const schema = yup.object().shape({
  username: yup.string().required('Введите имя пользователя'),
  password: yup.string().min(5, 'Пароль должен содержать не менее 5 символов').required('Введите пароль'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Подтвердите пароль'),
});

const SignupForm = () => {
  const [redirect, setRedirect] = useState(false);
  const [signupError, setSignupError] = useState(false);
    
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
        setSignupError(error.message);
      }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <Formik initialValues={initialValues} validationSchema={schema} onSubmit={myHandleSubmit}>
      {({ handleSubmit, isSubmitting }) => (
        <Form onSubmit={handleSubmit}>
          <h2>Регистрация</h2>
          {signupError !== false && (
            <Alert variant="danger">
              {signupError}
            </Alert>
          )}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Имя пользователя
            </label>
            <Field type="text" id="username" name="username" className="form-control" />
            <ErrorMessage name="username" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <Field type="password" id="password" name="password" className="form-control" />
            <ErrorMessage name="password" component="div" className="text-danger" />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Подтвердите пароль
            </label>
            <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
            <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
          </div>

          <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Зарегистрироваться
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
