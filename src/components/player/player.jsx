import React, { Component } from 'react';
import { connect } from 'react-redux';
import NormalPlayer from 'components/normal-player/normal-player';
import MiniPlayer from 'components/mini-player/mini-player';
import { setFullScreen, setPlayStatus } from 'store/actions';
import './index.styl';

class Player extends Component {
    state = {
        songReady: false,
        currentTime: 0
    }
    componentDidUpdate() {
        if (this.audioDOM) {
            // this.audioDOM && this.audioDOM.play()
            this.props.playing ? this.audioDOM.play() : this.audioDOM.pause()
        }
    }
    // 歌曲播放暂停开关
    togglePlay = () => {
        this.props.setPlaying(!this.props.playing)
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
        this.setSongReady(true)
    }
    // 播发器播放时派发的timeUpdate事件所监听的函数
    updateTime = (e) => {
        this.setState({
            currentTime: e.target.currentTime
        })
    }
    // 播放进度条改变时执行
    percentChange = (percent) => {
        this.audioDOM.currentTime = this.props.currentSong.duration * percent;
        if (!this.props.playing) {
            this.togglePlay();
        }
    }

    render() {
        const { fullScreen, playList, currentSong, playing, setFullScreen  } = this.props;
        const { songReady, currentTime } = this.state;
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
                                    setSongReady={this.setSongReady}
                                    currentTime={currentTime}
                                    percent={percent}
                                    percentChange={this.percentChange}
                        />}
                        <MiniPlayer 
                                    currentSong={currentSong}
                                    playing={playing}
                                    togglePlay={this.togglePlay}
                                    setFullScreen={setFullScreen}
                                    playList={playList}
                                    percent={percent}
                        />
                        <audio  src={currentSong.url} 
                                ref={el => this.audioDOM = el}
                                onCanPlay={this.ready}
                                onError={this.error}
                                onTimeUpdate={this.updateTime}
                        ></audio>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    fullScreen: state.fullScreen,
    playList: state.playList,
    currentSong: state.playList[state.currentIndex] || {},
    playing: state.playing
})

const mapDispatchToProps = (dispatch) => {
    return {
        setFullScreen: (flag) => {
            dispatch(setFullScreen(flag))
        },
        setPlaying: (flag) => {
            dispatch(setPlayStatus(flag))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);