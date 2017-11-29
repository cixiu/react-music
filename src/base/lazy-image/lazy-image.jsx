import React, { Component } from 'react';

class LazyImage extends Component {
    render() {
        return (
            <img width="50" height="50" src={require('../../common/image/default.png')} alt="加载中..."/>
        )
    }
}

export default LazyImage;
