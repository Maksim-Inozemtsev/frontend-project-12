import { Formik, Field, ErrorMessage } from 'formik';
import { Navigate } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Button, Form, Alert } from 'react-bootstrap';
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
    <Formik initialValues={{ username: '', password: '' }} validationSchema={validationSchema} onSubmit={myHandleSubmit}>
    {({ handleSubmit, isSubmitting }) => (
      <Form onSubmit={handleSubmit} className="justify-content-center align-items-center">
        <h1>Войти</h1>
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
      <Form.Group className="mb-3 w-50">
        <Form.Label htmlFor="username">Username:</Form.Label>
        <Field className="form-control" type="text" id="username" name="username" />
        <ErrorMessage name="username" component="div" className='text-danger'/>
      </Form.Group>
      <Form.Group className="mb-3 w-50">
        <Form.Label htmlFor="password">Password:</Form.Label>
        <Field className="form-control" type="password" id="password" name="password" />
        <ErrorMessage name="password" component="div" className='text-danger' />
      </Form.Group>
      <Button type="submit" disabled={isSubmitting}>
        Войти
      </Button>
    </Form>
    )}
  </Formik>
  );
};

export default LoginForm;
