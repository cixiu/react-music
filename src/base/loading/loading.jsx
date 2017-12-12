import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class Loading extends Component {
    static defaultProps = {
        title: '正在加载···'
    }
    
    render() {
        return (
            <div className="loading">
                <img width="24" height="24" src={require('./loading.gif')} alt="正在加载..."/>
                <p className="desc">{this.props.title}</p>
            </div>
        )
    }
}
if (process.env.NODE_ENV === 'development') {
    Loading.propTypes = {
        title: PropTypes.string.isRequired
    }
}

export default Loading;