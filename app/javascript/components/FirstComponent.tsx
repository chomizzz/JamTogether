import PropTypes from 'prop-types';
import React, { useState } from 'react';
const FirstComponent = (props) => {
    const [name, setName] = useState(props.name);
    return (
        <div>
            page acceuil
        </div>
    );
};
FirstComponent.propTypes = {
    name: PropTypes.string.isRequired, // this is passed from the Rails view
};
export default FirstComponent;

