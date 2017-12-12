import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import {addClass} from 'common/js/dom';
import './index.styl';

class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dots: [],
            currentPage: 0
        }
    }
    static defaultProps = {
        loop: true,      // 是否循环
        autoPlay: true,  // 是否自动播放
        interval: 4000,  // 播发间隔
        click: true      // 能否点击
    }
    
    componentDidMount() {
        setTimeout(() => {
            this._setSliderWidth();
            this._initDots();
            this._initSlider();
            if (this.props.autoPlay) {
                this._play();
            }
        }, 20);
        // 绑定窗口resize事件
        window.addEventListener('resize', () => {
            if (!this.slider || !this.slider.enabled) {
                return
            }
            this.resizeTimer = setTimeout(() => {
                // 如果slider正在轮播中
                if (this.slider.isInTransition) {
                    this._onScrollEnd();
                } else {
                    if (this.props.autoPlay) {
                        this._play();
                    }
                }
                this.refresh();
            }, 60)
        });
    }
    // 组件卸载时禁用 better-scroll和关闭定时器
    componentWillUnmount() {
        this.slider.disable();
        clearTimeout(this.timer);
    }
    refresh = () => {
        this._setSliderWidth(true);
        this.slider.refresh();
    }
    // 设置slider的宽度
    _setSliderWidth = (isResize) => {
        this.children = this.sliderGroup.children;
        let width = 0;
        let sliderWidth = this.sliderDOM.clientWidth;

        for (let i = 0, len = this.children.length; i < len; i++) {
            let child = this.children[i];
            addClass(child, 'slider-item');
            child.style.width = sliderWidth + 'px';
            width += sliderWidth;
        }

        if (this.props.loop && !isResize) {
            width += 2 * sliderWidth;
        }
        this.sliderGroup.style.width = width + 'px';
    }
    // 初始化dots
    // new Array(5).map(() => 1)返回的并不是[1,1,1,1,1]，这样就会导致下面的dots.map()返回的不是我们想要的结果
    // 所以这里将new Array()生成的数组进行填充处理
    _initDots() {
        this.setState({
            dots: new Array(this.children.length).fill(null)
        })
    }
    // 初始化Slider
    _initSlider = () => {
        this.slider = new BScroll(this.sliderDOM, {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: {
                loop: this.props.loop,
                threshold: 0.3,
                speed: 400
            },
            click: this.props.click
        });
        // 滚动结束时触发的事件scrollEnd
        this.slider.on('scrollEnd', this._onScrollEnd);
        // 滚动开始之前触发（鼠标或者手指按下也触发）
        this.slider.on('beforeScrollStart', () => {
            if (this.props.autoPlay) {
                clearTimeout(this.timer);
            }
        })
        // 鼠标或者手指抬起时触发
        this.slider.on('touchEnd', () => {
            if (this.props.autoPlay) {
                this._play();
            }
        })
    }
    _onScrollEnd = () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        if (this.props.loop) {
            pageIndex -= 1;
        }
        this.setState({
            currentPage: pageIndex
        });
        // 滚动结束后清除定时器，再执行_play方法以达到自动滚动的效果
        if (this.props.autoPlay) {
            clearTimeout(this.timer);
            this._play();
        }
    }
    // 自动滚动的函数
    _play = () => {
        let pageIndex = this.state.currentPage + 1;
        if (this.props.loop) {
            pageIndex += 1;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.slider.goToPage(pageIndex, 0, 400);
        }, this.props.interval);
    }

    render() {
        const {dots, currentPage} = this.state;
        return (
            <div className="slider" ref={slider => this.sliderDOM = slider}>
                <div className="slider-group" ref={div => this.sliderGroup = div}>
                    {this.props.children}
                </div>
                <div className="dots">
                    {dots.map((dot,index) => (
                        <span key={index} className={currentPage === index ? 'dot active' : 'dot'}></span>
                    ))}
                </div>
            </div>
        )
    }
}

if (process.env.NODE_ENV === 'development') {
    Slider.propTypes = {
        loop: PropTypes.bool.isRequired, 
        autoPlay: PropTypes.bool.isRequired, 
        interval: PropTypes.number.isRequired,
        click: PropTypes.bool.isRequired
    }
}

export default Slider;
