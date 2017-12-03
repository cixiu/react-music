import React, { Component } from 'react';
import { connect } from 'react-redux';
import NormalPlayer from 'components/normal-player/normal-player';
import MiniPlayer from 'components/mini-player/mini-player';
import { setFullScreen, setPlayStatus, setCurrentIndex } from 'store/actions';
import { playMode } from 'common/js/config';
import Lyric from 'lyric-parser';
import './index.styl';

class Player extends Component {
    state = {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        playingLyric: ''
    }
    componentWillUpdate(nextProps, nextState) {
        this.oldSong = this.props.currentSong;
        this.oldPlaying = this.props.playing;
        if (this.oldSong.id !== nextProps.currentSong.id) {
            // 当歌曲改变时，停止上一次的歌词
            if (this.state.currentLyric) {
                // 这里的stop是Lyric实例下的一个方法，即停止播放歌词
                this.state.currentLyric.stop();
            }
        }
    }
    componentDidUpdate() {
        if (this.audioDOM && this.oldSong.id !== this.props.currentSong.id) {
            // 清除快递点击下一首或者上一首，歌词混乱的bug
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.audioDOM.play()
                // 获取歌词
                this.getLyric();
            }, 1000)
        }
        if (this.oldPlaying !== this.props.playing) {
            this.props.playing ? this.audioDOM.play() : this.audioDOM.pause()
        }
    }
    // 歌曲播放暂停开关
    togglePlay = () => {
        const { songReady, currentLyric } = this.state;
        if (!songReady) {
            return
        }
        this.props.setPlaying(!this.props.playing)
        if (currentLyric) {
            // 这里的togglePlay时Lyric实例下的一个方法，即切换歌词播放状态
            currentLyric.togglePlay();
        }
    }
    // songReady标记位
    setSongReady = (flag) => {
        this.setState({
           songReady: flag 
        })
    }
    // 音频准备好了能够播放时触发
    ready = () => {
        this.setSongReady(true)
    }
    // 音频请求错误时触发
    error = () => {
        this.setSongReady(true);
        clearTimeout(this.errorTimer);
        this.errorTimer = setTimeout(() => {
            this.next();
        }, 20)
    }
    // 播发器播放时派发的timeUpdate事件所监听的函数
    updateTime = (e) => {
        this.setState({
            currentTime: e.target.currentTime
        })
    }
    // 播放下一首歌曲
    next = () => {
        // 如果歌曲没有准备好就点下一首，则什么都不做
        if (!this.state.songReady) {
            return
        }
        // 如果播放列表只有一首歌，点下一首则进行循环播放
        if (this.props.playList.length === 1) {
            this.loop();
            return
        } else {
            let index = this.props.currentIndex + 1;
            if (index === this.props.playList.length) {
                index = 0
            }
            this.props.setCurrentIndex(index);
            if (!this.props.playing) {
                this.togglePlay();
            }
        }
        this.setSongReady(false);
    }
    // 播放上一首歌曲
    prev = () => {
        // 如果歌曲没有准备好就点下一首，则什么都不做
        if (!this.state.songReady) {
            return
        }
        // 如果播放列表只有一首歌，点上一首则进行循环播放
        if (this.props.playList.length === 1) {
            this.loop();
            return
        } else {
            let index = this.props.currentIndex - 1;
            if (index === -1) {
                index = this.props.playList.length - 1;
            }
            this.props.setCurrentIndex(index);
            if (!this.props.playing) {
                this.togglePlay();
            }
        }
        this.setSongReady(false);
    }
    // 歌曲播放结束后
    end = () => {
        if (this.props.mode === playMode.loop) {
            this.loop();
        } else {
            this.next();
        }
    }
    // 单曲循环
    loop = () => {
        this.audioDOM.currentTime = 0;
        this.audioDOM.play();
        if (this.state.currentLyric) {
            // 这里的seek时Lyric实例下的一个方法，即将歌词切到指定的时间点
            this.state.currentLyric.seek(0)
        }
    }
    // 播放进度条改变时执行
    percentChange = (percent) => {
        const currentTime = this.props.currentSong.duration * percent
        this.audioDOM.currentTime = currentTime;
        if (!this.props.playing) {
            this.togglePlay();
        }
        if (this.state.currentLyric) {
            this.state.currentLyric.seek(currentTime * 1000);
        }
    }
    // 获取歌词
    getLyric = () => {
        const { currentSong } = this.props;
        // getLyric为Song实例下的方法
        currentSong.getLyric().then(lyric => {
            this.setState({
                currentLyric: new Lyric(lyric, this.handleLyric)
            })
            if (this.props.playing) {
                this.state.currentLyric.play()
            }
        }).catch(() => {
            this.setState({
                currentLyric: null,
                currentLineNum: 0,
                playingLyric: ''
            })
        })
    }
    // 歌词滚动到相应的位置
    handleLyric = ({lineNum, txt}) => {
        this.setState({
            currentLineNum: lineNum
        })
        // 单fullScreen=false时，normal-player组件并没有渲染，所以取不到组件实例下的方法和dom节点
        // 只有当fullScreen=true时，才能获取组件实例下的方法和dom节点
        if (this.props.fullScreen) {
            this.NormalPlayer.getWrappedInstance().lyricScroll(lineNum);
        }
        this.setState({
            playingLyric: txt
        })
    }

    render() {
        const { fullScreen, playList, currentSong, playing, setFullScreen, sequenceList, mode  } = this.props;
        const { songReady, currentTime, currentLyric, currentLineNum, playingLyric } = this.state;
        const percent = currentTime / currentSong.duration;
        return (
            <React.Fragment>
                {playList.length > 0 && (
                    <div className="player">
                        {fullScreen &&
                        <NormalPlayer
                                    currentSong={currentSong}
                                    playing={playing}
                                    togglePlay={this.togglePlay}
                                    setFullScreen={setFullScreen}
                                    playList={playList}
                                    songReady={songReady}
                                    currentTime={currentTime}
                                    percent={percent}
                                    percentChange={this.percentChange}
                                    mode={mode}
                                    sequenceList={sequenceList}
                                    currentLyric={currentLyric}
                                    currentLineNum={currentLineNum}
                                    playingLyric={playingLyric}
                                    next={this.next}
                                    prev={this.prev}
                                    ref={el => this.NormalPlayer = el}
                        />}
                        <MiniPlayer 
                                    currentSong={currentSong}
                                    playing={playing}
                                    togglePlay={this.togglePlay}
                                    setFullScreen={setFullScreen}
                                    playList={playList}
                                    percent={percent}
                                    sequenceList={sequenceList}
                        />
                        <audio  src={currentSong.url} 
                                ref={el => this.audioDOM = el}
                                onCanPlay={this.ready}
                                onError={this.error}
                                onTimeUpdate={this.updateTime}
                                onEnded={this.end}
                        ></audio>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    fullScreen: state.fullScreen,
    sequenceList: state.sequenceList,
    playList: state.playList,
    currentIndex: state.currentIndex,
    currentSong: state.playList[state.currentIndex] || {},
    playing: state.playing,
    mode: state.mode
})

const mapDispatchToProps = (dispatch) => {
    return {
        setFullScreen: (flag) => {
            dispatch(setFullScreen(flag))
        },
        setPlaying: (flag) => {
            dispatch(setPlayStatus(flag))
        },
        setCurrentIndex: (index) => {
            dispatch(setCurrentIndex(index))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);