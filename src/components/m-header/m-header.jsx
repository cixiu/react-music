import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.styl';

class MHeader extends Component {
    render() {
        return (
            <div className="m-header">
                <div className="icon"></div>
                <h1 className="text">React Music</h1>
                <Link className="mine" to="/user-center">
                    <i className="icon-mine"></i>
                </Link>
            </div>
        )
    }
}

export default MHeader;
