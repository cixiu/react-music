import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
// import { setCurrentIndex, setPlayMode, setPlayList } from 'store/actions';
// import { playMode } from 'common/js/config';
// import { shuffle } from 'common/js/util';
import { prefixStyle } from 'common/js/dom';
import ProgerssBar from 'base/progress-bar/progress-bar';
import Scroll from 'base/scroll/scroll';
import playerHOC from 'base/hoc/playerHOC';

const transform = prefixStyle('transform');
const transitionDuration = prefixStyle('transitionDuration');

class NormalPlay extends Component {
    state = {
        in: false,
        currentShow: 'cd'
    }

    lyricLineGroup = [];    // 歌词行数集合
    touch = {};             // 用于存储touch事件的变量

    static defaultProps = {
        currentSong: {},
        playing: false,
        togglePlay: () => {
            console.log('请传入一个控制播放状态的函数')
        },
        setFullScreen: null,
        playList: [],
        songReady: false,
        currentTime: 0,
        percent: 0,
        percentChange: (percent) => {
            console.log('请输入一个改变percent的函数', percent)
        },
        mode: 0,
        currentLyric: null,
        currentLineNum: 0,
        playingLyric: '',
        next: () => {
            console.log('请输入next属性')
        },
        prev: () => {
            console.log('请输入prev属性')
        },
        favoriteList: []
    }
    
    componentDidMount() {
        this.setState({
            in: true
        })
    }
    
    back = () => {
        this.setState({
            in: false
        })
        setTimeout(() => {
            this.props.setFullScreen(false);
        }, 300)
    }
    // 将时间进行处理成：分：秒的形式
    format = (interval) => {
        interval = interval | 0;    // | 0 表示向下取整
        const minutes = interval / 60 | 0;
        const seconds = this._pad(interval % 60);
        return `${minutes}:${seconds}`
    }
    // 歌词滚动 用于父组件Player调用
    lyricScroll = (lineNum) => {
        if (lineNum > 5) {
            let lineEl = this.lyricLineGroup[lineNum - 5];
            this.Scroll.scrollToElement(lineEl, 1000)
        } else {
            this.Scroll.scrollTo(0, 0, 1000);
        }
    }
    // middle部分的touchstart事件函数
    middleTouchStart = (e) => {
        this.touch.initial = true;
        // 判断是否时移动
        this.touch.moved = false;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
    }
    // middle部分的touchmove事件函数
    middleTouchMove = (e) => {
        if (!this.touch.initial) {
            return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const deltaY = e.touches[0].pageY - this.touch.startY;
        // 如果在Y方向的移动距离大于X方向  应该return掉
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return
        }
        // 当在Y方向移动大于X方向时已经return掉了，所以当在Y方向移动时this.touch.moved依旧是false
        // 只有当在X方向移动大于Y方向时，下面的代码才会执行
        if (!this.touch.moved) {
            this.touch.moved = true;
        }
        const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
        this.ScrollDOM.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.ScrollDOM.style[transitionDuration] = '';
        this.middleLDOM.style.opacity = 1 - this.touch.percent;
        this.middleLDOM.style[transitionDuration] = '';
    }
    // middle部分的touchend事件函数
    middleTouchEnd = (e) => {
        // 当在Y方向移动大于X方向时，this.touch.moved依旧是false，此时抬起手指或者鼠标，则return掉
        if (!this.touch.moved) {
            return
        }

        let offsetWidth = 0;
        let opacity = 0;
        // 如果当前显示的是cd画面
        if (this.state.currentShow === 'cd') {
            if (this.touch.percent > 0.1) {
                offsetWidth = -window.innerWidth;
                this.setState({
                    currentShow: 'lyric'
                });
                opacity = 0;
            } else {
                offsetWidth = 0;
                opacity = 1;
            }
        } else {   // 当前显示的是歌词画面
            if (this.touch.percent < 0.9) {
                offsetWidth = 0;
                this.setState({
                    currentShow: 'cd'
                });
                opacity = 1
            } else {
                offsetWidth = -window.innerWidth;
                opacity = 0;
            }
        }
        const time = 300
        this.ScrollDOM.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.ScrollDOM.style[transitionDuration] = `${time}ms`;
        this.middleLDOM.style.opacity = opacity;
        this.middleLDOM.style[transitionDuration] = `${time}ms`;
    }
    // 补0函数
    _pad = (num, n = 2) => {
        let len = num.toString().length;
        while (len < n) {
            num = '0' + num;
            len++
        }
        return num;
    }
    
    render() {
        const {
            currentSong,
            playing,
            togglePlay,
            songReady,
            currentTime,
            percent,
            percentChange,
            currentLyric,
            currentLineNum,
            playingLyric
        } = this.props;
        const { currentShow } = this.state;
        const playIconCls = playing ? 'icon-pause' : 'icon-play';
        const cdRotateCls = playing ? 'play' : 'play pause';
        const disableCls = songReady ? '' : 'disable';
        const FormatCurrentTime = this.format(currentTime);
        const duration = this.format(currentSong.duration);
        return (
            <CSSTransition classNames="normal" timeout={300} in={this.state.in}>
                <div className="normal-player">
                    <div className="background">
                        <img width="100%" height="100%" src={currentSong.image} alt={currentSong.name}/>
                    </div>
                    <div className="top">
                        <div className="back" onClick={this.back}>
                            <i className="icon-back"></i>
                        </div>
                        <h1 className="title">{currentSong.name}</h1>
                        <h2 className="subtitle">{currentSong.singer}</h2>
                    </div>
                    <div className="middle"
                            onTouchStart={this.middleTouchStart}
                            onTouchMove={this.middleTouchMove}
                            onTouchEnd={this.middleTouchEnd}
                    >
                        <div className="middle-l" ref={el => this.middleLDOM = el}>
                            <div className="cd-wrapper" ref={el => this.cdWrapperDOM = el}>
                                <div className={`cd ${cdRotateCls}`}>
                                    <img className="image" src={currentSong.image} alt={currentSong.name}/>
                                </div>
                            </div>
                            <div className="playing-lyric-wrapper">
                                <div className="playing-lyric">{playingLyric}</div>
                            </div>
                        </div>
                        <Scroll className="middle-r" 
                                ref={scroll => this.Scroll = scroll} 
                                scrollRef={el => this.ScrollDOM = el}
                        >
                            <div className="lyric-wrapper">
                                {!!currentLyric && 
                                <div>
                                    {currentLyric.lines.map((line, index) => (
                                        <p 
                                            className={`${currentLineNum === index ? 'text current' : 'text'}`} 
                                            key={index}
                                            ref={el => this.lyricLineGroup[index] = el}
                                        >{line.txt}</p>
                                    ))}
                                </div>
                                }
                            </div>
                        </Scroll>
                    </div>
                    <div className="bottom">
                        <div className="dot-wrapper">
                            <span className={`${currentShow === 'cd' ? 'dot active' : 'dot'}`}></span>
                            <span className={`${currentShow === 'lyric' ? 'dot active' : 'dot'}`}></span>
                        </div>
                        <div className="progress-wrapper">
                            <span className="time timer-l">{FormatCurrentTime}</span>
                            <div className="progress-bar-wrapper">
                                <ProgerssBar percent={percent} percentChange={percentChange}></ProgerssBar>
                            </div>
                            <span className="time time-r">{duration}</span>
                        </div>
                        <div className="operators">
                            <div className="icon i-left" onClick={this.changePlayMode}>
                                <i className={this.IconMode()}></i>
                            </div>
                            <div className={`icon i-left ${disableCls}`}>
                                <i className="icon-prev" onClick={this.props.prev}></i>
                            </div>
                            <div className={`icon i-center ${disableCls}`}>
                                <i className={playIconCls} onClick={togglePlay}></i>
                            </div>
                            <div className={`icon i-right ${disableCls}`}>
                                <i className="icon-next" onClick={this.props.next}></i>
                            </div>
                            <div className="icon i-right">
                                <i className={this.getFavoriteIcon(currentSong)} 
                                    onClick={(e) => this.toggleFavorite(currentSong, e)}
                                >
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

if (process.env.NODE_ENV === 'development') {
    NormalPlay.propTypes = {
        currentSong: PropTypes.object.isRequired,
        playing: PropTypes.bool.isRequired,
        togglePlay: PropTypes.func.isRequired,
        setFullScreen: PropTypes.func.isRequired,
        playList: PropTypes.array.isRequired,
        songReady: PropTypes.bool.isRequired,
        currentTime: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
        percentChange: PropTypes.func.isRequired,
        mode: PropTypes.number.isRequired,
        currentLyric: PropTypes.object,
        currentLineNum: PropTypes.number.isRequired,
        playingLyric: PropTypes.string.isRequired,
        next: PropTypes.func.isRequired,
        prev: PropTypes.func.isRequired,
        favoriteList: PropTypes.array.isRequired,
    }
}

export default playerHOC(NormalPlay);
