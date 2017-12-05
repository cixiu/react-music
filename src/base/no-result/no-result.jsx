import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class NoResult extends Component {
    static defaultProps = {
        title: ''
    }
    static propTypes = {
        title: PropTypes.string.isRequired
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

export default NoResult;
