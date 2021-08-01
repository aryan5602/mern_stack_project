import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { deleteAccount, getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Dashboardactions from './Dashboardactions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = ({ deleteAccount, getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile]);

    return loading && profile == null ? <Spinner /> : <Fragment >
        <h1 class="large text-primary">Dashboard</h1>
        <p class="lead ">
            <i class="fas fa-users"></i> Welcome {user && user.name}
        </p>
        {profile !== null ?
            <Fragment>
                <Dashboardactions />
                <Experience experience={profile.experience} />
                <Education education={profile.education} />
                <div className='my-2'>
                    <button className='btn btn-danger' onClick={() => deleteAccount()} >
                        <i className='fas fa-user-minus'></i> Delete My Account
                    </button>
                </div>
            </Fragment> :
            <Fragment>
                <p>You dont have a Profile , please create one</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
            </Fragment>}
    </Fragment>

}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
    deleteAccount: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
