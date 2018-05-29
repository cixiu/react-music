import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LazyImage extends Component {
    static defaultProps = {
        width: 50,
        height: 50
    }

    render() {
        const { width, height } = this.props;
        return (
            <img width={width} height={height} src={require('../../common/image/default.jpg')} alt="加载中..."/>
        )
    }
}

if (process.env.NODE_ENV === 'development') {
    LazyImage.propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }
}

export default LazyImage;
