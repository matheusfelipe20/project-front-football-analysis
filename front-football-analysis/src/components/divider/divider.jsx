import React from 'react';
import './Divider.css';

const Divider = ({ color = '#000000', width = '72vw', height, margin }) => {
    return <hr className="divider" style={{ backgroundColor: color, width: width, height: height, margin: margin }} />;
};

export default Divider;