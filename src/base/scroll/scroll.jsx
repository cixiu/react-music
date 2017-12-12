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
        lazyLoad: false,         // 默认不进行懒加载
        listenScroll: false,    // 默认不进行滚动监听
        scroll: null,           // 监听滚动的回调函数
        scrollRef: null,        // 为了回去Scroll实例的dom节点做的一个函数属性
        pullUpLoad: false,       // 上拉加载更多配置
        loadMore: () => {
            console.log('请传入执行加载数据更多的异步数据请求')
        },
        beforeScroll: false,
        onBlur: () => {
            console.log('请传入一个让某个input框失去焦点的处理函数')
        }
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
            this.refresh()
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
            pullUpLoad: this.props.pullUpLoad,
        })
        // 是否滚动监听
        if (this.props.listenScroll) {
            this.scroll.on('scroll', (pos) => {
                this.props.lazyLoad && forceCheck();
                this.props.scroll && this.props.scroll(pos);
            })
        }
        // 是否上拉加载更多
        if (this.props.pullUpLoad) {
            this.scroll.on('scrollEnd', () => {
                if (this.scroll.y <= this.scroll.maxScrollX + 50) {
                    this.props.loadMore && this.props.loadMore()
                } 
            })
        }
        // 开始滚动前
        if (this.props.beforeScroll) {
            this.scroll.on('beforeScrollStart', () => {
                this.props.onBlur()
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
    stop = () => {
        this.scroll && this.scroll.stop();
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
            <div className={this.props.className + ' scroll'} ref={scroll => {
                this.wrapper = scroll;
                this.props.scrollRef && this.props.scrollRef(scroll);  // 对外暴露dom节点
            }}>
                {this.props.children}
            </div>
        )
    }
}

if (process.env.NODE_ENV === 'development') {
    Scroll.propTypes = {
        probeType: PropTypes.number.isRequired,
        click: PropTypes.bool.isRequired,
        data: PropTypes.array.isRequired,
        lazyLoad: PropTypes.bool,
        listenScroll: PropTypes.bool.isRequired,
        scroll: PropTypes.func,
        scrollRef: PropTypes.func,
        pullUpLoad: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.object
        ]),
        loadMore: PropTypes.func.isRequired,
        beforeScroll: PropTypes.bool.isRequired,
        onBlur: PropTypes.func.isRequired,
    }
}

export default Scroll;