import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';

class Scroll extends Component {
    static defaultProps = {
        probeType: 1,
        click: true,
        data: []
    }
    static propTypes = {
        probeType: PropTypes.number.isRequired,
        click: PropTypes.bool.isRequired,
        data: PropTypes.array.isRequired,
    }
    componentDidMount() {
        setTimeout(() => {
            this._initScroll();
        }, 20);
    }
    // 当组件接收的props变化时，刷新scroll
    // 由于this.props.children是根据父组件异步获取数据渲染的，
    // 所以在数据获取成功后，渲染的children就会改变，这时这个生命周期钩子函数就会调用
    componentWillReceiveProps() {
        setTimeout(() => {
            this.refresh();
        }, 20)
    }
    // 初始化better-scroll
    _initScroll = () => {
        if (!this.wrapper) {
            return
        }
        this.scroll = new BScroll(this.wrapper, {
            probeType: this.props.probeType,
            click: this.props.click
        })
    }
    enable = () => {
        this.scroll && this.scroll.enable();
    }
    disable = () => {
        this.scroll && this.scroll.disable();
    }
    refresh = () => {
        this.scroll && this.scroll.refresh();
    }

    render() {
        return (
            <div className={this.props.className + ' scroll'} ref={scroll => this.wrapper = scroll}>
                {this.props.children}
            </div>
        )
    }
}

export default Scroll;