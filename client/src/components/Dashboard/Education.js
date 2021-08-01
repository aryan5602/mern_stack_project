import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import { deleteEducation, deleteExperience } from '../../actions/profile'

const Education = ({ education, deleteEducation }) => {

    const educations = education.map(exp => (
        <tr key={exp._id}>
            <td>{exp.school}</td>
            <td className='hide=sm'>{exp.degree}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{exp.from}</Moment> - {' '}
                {exp.to == null ? (
                    'now') : (<Moment format='YYYY/MM/DD'>{exp.to}</Moment>
                )}
            </td>
            <td><button onClick={() => deleteExperience(exp._id)} className='btn btn-danger'>Delete</button></td>
        </tr>
    ))

    return (
        <Fragment>
            <h2 className='my-2'>Education Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {educations}
                </tbody>
            </table>
        </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.object.isRequired,
}

export default connect(null, { deleteEducation })(Education)
