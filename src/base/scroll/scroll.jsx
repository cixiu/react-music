import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import {forceCheck} from 'react-lazyload';
/* 
react-lazyload和better-scroll结合使用的问题
    better-scroll拦截了原生的scroll事件，而react-lazyload懒加载的原理是基于scroll和resize这2个事件的，
    所以使用react-lazyload之后的懒加载不起作用，
    因此，需要在使用better-scroll做滚动的时候，要监听滚动事件，在滚动事件的回调函数中调用forceCheck方法，
    来强制核查图片或者组件是否在视口区，如果在视口区则加载，如果不在视口区则展示<LazyLoad>组件中的placeholder属性
*/

class Scroll extends Component {
    static defaultProps = {
        probeType: 1,
        click: true,
        data: [],
        listenScroll: false,
        scroll: null
    }
    static propTypes = {
        probeType: PropTypes.number.isRequired,
        click: PropTypes.bool.isRequired,
        data: PropTypes.array.isRequired,
        listenScroll: PropTypes.bool.isRequired,
        scroll: PropTypes.func,
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
            click: this.props.click,
        })
        // 是否滚动监听
        if (this.props.listenScroll) {
            this.scroll.on('scroll', (pos) => {
                forceCheck();
                this.props.scroll && this.props.scroll(pos);
            })
        }
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
    scrollTo = (...rest) => {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, rest);
    }
    scrollToElement = (...rest) => {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, rest);
        forceCheck();
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