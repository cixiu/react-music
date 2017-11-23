import React, { Component } from 'react';
import './index.styl';

class MHeader extends Component {
    render() {
        return (
            <div className="m-header">
                <div className="icon"></div>
                <h1 className="text">Chicken Music</h1>
            </div>
        )
    }
}

export default MHeader;
