import axios from 'axios';
import { setAlert } from './alert';
import { CLEAR_PROFILE, DELETE_ACCOUNT, GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, GET_PROFILES } from './types';

// Get current users profile

export const getCurrentProfile = () => async dispatch => {
    try {

        const res = await axios.get("/api/profile/me");

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });
    }
}

// create or update a profile 

export const createProfile = (formData, history, edit = false) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('/api/profile', formData, config);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert(edit ? 'profile updated' : 'profile created', 'success'));

        if (!edit) {
            history.push('/dashboard');
        }

    } catch (err) {

        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });
    }
}

// Add experience

export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/experience', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experince Added', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });
    }
}

// Add education

export const addEducation = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const res = await axios.put('/api/profile/education', formData, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Education Added', 'success'));
        history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });
    }
}

//Delete experience 

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`api/profile/experience/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Experience Deleted', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });
    }
}


//Delete experience 

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`api/profile/education/${id}`);

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })
        dispatch(setAlert('Education Deleted', 'success'));
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.data.msg, status: err.response.status }
        });
    }
}

//Delete account and profile


export const deleteAccount = () => async dispatch => {

    if (window.confirm('Are you sure? This cannot be UNDONE!')) {
        try {
            await axios.delete('api/profile');

            dispatch({ type: CLEAR_PROFILE })
            dispatch({
                type: DELETE_ACCOUNT
            })


            dispatch(setAlert('Your account has been deleted successfully', 'success'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.data.msg, status: err.response.status }
            });
        }
    }

}


// Get all profiles

export const getAllProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    try {
        const res = await axios.get('/api/profile');

        dispatch({
            type: GET_PROFILES,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};


// get profile by id


export const getProfileById = userID => async dispatch => {
    try {
        const res = await axios.get(`/api/profile/user/${userID}`);

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
};
