import React from 'react';
import PropTypes from 'prop-types';
import './divider.css';

const Divider = ({ color = '#000000', width = '72vw', height, margin }) => {
    return <hr className="divider" style={{ backgroundColor: color, width: width, height: height, margin: margin }} />;
};

Divider.propTypes = {
    color: PropTypes.string,
    width: PropTypes.string,
    height: PropTypes.string,
    margin: PropTypes.string,
};

export default Divider;