import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import apiPath from '../../routes.js';
import authContext from '../context';
import { useTranslation } from 'react-i18next';

const { signupPage } = apiPath;

const SignupForm = () => {
  const { t } = useTranslation();
  
  const schema = yup.object().shape({
    username: yup.string().min(3, t('errors.minName')).max(20, t('errors.maxName')).required(t('errors.userNameRequired')),
    password: yup.string().min(6, t('errors.shortPassword')).required(t('errors.passwordRequired')),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], t('errors.confirmPassword'))
      .required(t('errors.enterConfirmation')),
  });
  
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
          setSignupError(t('errors.existingUser'));
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
          <a className="navbar-brand" href="/">{t('title')}</a>
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
                      <h1 className="text-center mb-4">{t('signUpTitle')}</h1>
                      <div className="form-floating mb-3">
                        <Field type="text" id="username" name="username" className="form-control" />
                        <label htmlFor="username" className="form-label">
                          {t('nameUser')}
                        </label>
                        <ErrorMessage name="username" component="div" className="text-danger" />
                      </div>
                      <div className="form-floating mb-3">
                        <Field type="password" id="password" name="password" className="form-control" />
                         <label htmlFor="password" className="form-label">
                          {t('password')}
                        </label>
                        <ErrorMessage name="password" component="div" className="text-danger" />
                      </div>
                      <div className="form-floating mb-4">
                        <Field type="password" id="confirmPassword" name="confirmPassword" className="form-control" />
                        <label htmlFor="confirmPassword" className="form-label">
                          {t('confirmPassword')}
                        </label>
                          {signupError !== null && (
                            <div className="text-danger">{signupError}</div>
                          )}
                        <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                      </div>
                      <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {t('signUp')}
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
