import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  PROFILE_UPDATE,
  AUTHORIZED,
  UNAUTHORIZED,
} from './types';

//Update user profile
export const updateProfile = ({ countries, graphs }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ countries, graphs });

  try {
    const res = await axios.post('/api/user/profile', body, config);
    // console.log(res.data);
    dispatch({
      type: PROFILE_UPDATE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

//Load user
export const loadUser = () => async (dispatch) => {
  //Add token to headers
  if (localStorage.token) {
    console.log('Token is there!');
    setAuthToken(localStorage.token);
  } else return;
  // make request
  try {
    const res = await axios.get('/api/user');
    // console.log(res.data);
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/user', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
    });
    dispatch({
      type: AUTHORIZED,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert('Registration successful!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'warning')));
    }

    dispatch({
      type: UNAUTHORIZED,
    });
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login user
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
    });
    dispatch({
      type: AUTHORIZED,
      payload: res.data,
    });
    dispatch(loadUser());
    dispatch(setAlert('Login success!', 'success'));
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'warning')));
    }

    dispatch({
      type: UNAUTHORIZED,
    });
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

//Logout user
export const logout = () => (dispatch) => {
  dispatch({
    type: UNAUTHORIZED,
  });
  dispatch({
    type: LOGOUT,
  });
};