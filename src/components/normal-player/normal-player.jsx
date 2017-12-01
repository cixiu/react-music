import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { setCurrentIndex } from 'store/actions';
import ProgerssBar from 'base/progress-bar/progress-bar';

class NormalPlay extends Component {
    state = {
        in: false,
        songReady: true,     // songReady状态也可以放在player组件中，这里只是选择放在了normal-player组件中而已
    }
    static defaultProps = {
        currentSong: {},
        playing: false,
        togglePlay: () => {
            console.log('请传入一个控制播放状态的函数')
        },
        setFullScreen: null,
        playList: [],
        songReady: false,
        setSongReady: () => {
            console.log('请传入一个控制歌曲是否准备就绪的函数')
        },
        currentTime: 0,
        percent: 0,
        percentChange: (percent) => {
            console.log('请输入一个改变percent的函数', percent)
        }
    }
    static propTypes = {
        currentSong: PropTypes.object.isRequired,
        playing: PropTypes.bool.isRequired,
        togglePlay: PropTypes.func.isRequired,
        setFullScreen: PropTypes.func.isRequired,
        playList: PropTypes.array.isRequired,
        songReady: PropTypes.bool.isRequired,
        setSongReady: PropTypes.func.isRequired,
        currentTime: PropTypes.number.isRequired,
        percent: PropTypes.number.isRequired,
        percentChange: PropTypes.func.isRequired,
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
    // 播放下一首歌曲
    next = () => {
        // 如果歌曲没有准备好就点下一首，则什么都不做
        if (!this.props.songReady) {
            return
        }
        let index = this.props.currentIndex + 1;
        if (index === this.props.playList.length) {
            index = 0
        }
        this.props.setCurrentIndex(index);
        if (!this.props.playing) {
            this.props.togglePlay();
        }
        this.props.setSongReady(false);
    }
    // 播放上一首歌曲
    prev = () => {
        // 如果歌曲没有准备好就点下一首，则什么都不做
        if (!this.props.songReady) {
            return
        }
        let index = this.props.currentIndex - 1;
        if (index === -1) {
            index = this.props.playList.length - 1;
        }
        this.props.setCurrentIndex(index);
        if (!this.props.playing) {
            this.props.togglePlay();
        }
        this.props.setSongReady(false);
    }
    // 将时间进行处理成：分：秒的形式
    format = (interval) => {
        interval = interval | 0;    // | 0 表示向下取整
        const minutes = interval / 60 | 0;
        const seconds = this._pad(interval % 60);
        return `${minutes}:${seconds}`

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
        const { currentSong, playing, togglePlay, songReady, currentTime, percent, percentChange } = this.props;
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
                    <div className="middle">
                        <div className="middle-l">
                            <div className="cd-wrapper" ref={el => this.cdWrapperDOM = el}>
                                <div className={`cd ${cdRotateCls}`}>
                                    <img className="image" src={currentSong.image} alt={currentSong.name}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="progress-wrapper">
                            <span className="time timer-l">{FormatCurrentTime}</span>
                            <div className="progress-bar-wrapper">
                                <ProgerssBar percent={percent} percentChange={percentChange}></ProgerssBar>
                            </div>
                            <span className="time time-r">{duration}</span>
                        </div>
                        <div className="operators">
                            <div className="icon i-left">
                                <i className="icon-sequence"></i>
                            </div>
                            <div className={`icon i-left ${disableCls}`}>
                                <i className="icon-prev" onClick={this.prev}></i>
                            </div>
                            <div className={`icon i-center ${disableCls}`}>
                                <i className={playIconCls} onClick={togglePlay}></i>
                            </div>
                            <div className={`icon i-right ${disableCls}`}>
                                <i className="icon-next" onClick={this.next}></i>
                            </div>
                            <div className="icon i-right">
                                <i className="icon icon-not-favorite"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state) => ({
    currentIndex: state.currentIndex
})

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentIndex: (index) => {
            dispatch(setCurrentIndex(index))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        withRef: true
    }
)(NormalPlay);
