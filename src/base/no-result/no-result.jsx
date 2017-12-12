import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class NoResult extends Component {
    static defaultProps = {
        title: ''
    }
    
    render() {
        const { title } = this.props;    
        return (
            <div className="no-result">
                <div className="no-result-icon"></div>
                <p className="no-result-text">{title}</p>
            </div>
        )
    }
}
if (process.env.NODE_ENV === 'development') {
    NoResult.propTypes = {
        title: PropTypes.string.isRequired
    }
}

export default NoResult;
