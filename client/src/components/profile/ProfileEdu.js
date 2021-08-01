import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEdu = ({ education: { school, degree, feildofstudy, current, to, from, description } }) => {
    return (
        <div>
            <h3 className='text-dark'>
                {school}
            </h3>
            <p>
                <Moment format='YYYY/MM/DD'>{from}</Moment> - {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
            </p>
            <p>
                <strong>Position: </strong> {degree}
            </p>
            {feildofstudy ? <p>
                <strong>Field Of Study </strong> {feildofstudy}
            </p> : ''}

            <p>
                <strong>Description: </strong> {description}
            </p>
        </div>
    )
}

ProfileEdu.propTypes = {
    education: PropTypes.array.isRequired,
}

export default ProfileEdu
