import PropTypes from 'prop-types';
import React, { useState } from 'react';
const JoinRoom = () => {

    return (
        <div>
            do you join ?
        </div>
    );
};
JoinRoom.propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
};
export default JoinRoom;

