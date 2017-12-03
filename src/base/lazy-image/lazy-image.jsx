import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LazyImage extends Component {
    static defaultProps = {
        width: 50,
        height: 50
    }

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }

    render() {
        const { width, height } = this.props;
        return (
            <img width={width} height={height} src={require('../../common/image/default.png')} alt="加载中..."/>
        )
    }
}

export default LazyImage;
