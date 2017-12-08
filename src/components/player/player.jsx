import React, { Component } from 'react';
import { connect } from 'react-redux';
import NormalPlayer from 'components/normal-player/normal-player';
import MiniPlayer from 'components/mini-player/mini-player';
import { setFullScreen, setPlayStatus, setCurrentIndex } from 'store/actions';
import { savePlayHistory } from 'store/dispatchMultiple';
import { playMode } from 'common/js/config';
import Lyric from 'lyric-parser';
import { createSelector } from 'reselect';
import './index.styl';

class Player extends Component {
    state = {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        playingLyric: '',
        canPlayLyric: false
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
    componentDidUpdate(prevProps) {
        if (this.audioDOM && this.oldSong.id !== this.props.currentSong.id) {
            // 清除快递点击下一首或者上一首，歌词混乱的bug
            this.setSongReady(false);            
            if (this.state.currentLyric) {
                this.state.currentLyric.stop()
                // 重置为null
                this.setState({
                    currentLyric: null
                })
                this.setState({
                    currentTime: 0
                })
                this.setState({
                    playingLyric: ''
                })
                this.setState({
                    currentLineNum: 0
                })
            }
            this.audioDOM.src = this.props.currentSong.url;
            if (this.props.playing) {
                this.audioDOM.play()   
            }
            this.getLyric()
        }
        if (this.audioDOM && this.oldPlaying !== this.props.playing) {
            if (this.props.playing) {
                this.audioDOM.play();
                if (this.props.currentIndex === prevProps.currentIndex) {
                    this.props.savePlayHistory(this.props.currentSong);
                }
            } else {
                this.audioDOM.pause();
            }
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
        setTimeout(() => {
            this.setSongReady(true)            
        }, 500)
        // 当歌曲可以播放的时候，让歌词也开始播放
        this.setState({
            canPlayLyric: true
        })
        // 只有歌曲是播放状态才加入最近播放列表
        if (this.props.playing) {
            this.props.savePlayHistory(this.props.currentSong);
        }
    }
    pause = () => {
        this.props.setPlaying(false)
        if (this.state.currentLyric) {
          this.state.currentLyric.stop()
        }
    }
    // 音频请求错误时触发
    error = () => {
        this.setSongReady(true);
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
            if (currentSong.lyric !== lyric) {
                return;
            }
            this.setState({
                currentLyric: new Lyric(lyric, this.handleLyric)
            })
            if (this.props.playing && this.state.canPlayLyric) {
                // 这个时候有可能用户已经播放了歌曲，要切到对应位置
                this.state.currentLyric.seek(this.state.currentTime * 1000)
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
            // getWrappedInstance是connect函数下设置withRef: true下的方法，用于获取包裹组件的实例
            // 被高阶组件包裹的组件，通过ref并不能获取包裹组件的实例或者dom节点，因为Refs属性不能传递
            // getWrappedInstance时connect高阶组件提供的，使得ref用来传递
            // 由于NormalPlayer被二层connent高阶组件包裹，所以这里需要调用二次getWrappedInstance方法
            this.NormalPlayer.getWrappedInstance().lyricScroll(lineNum);
        }
        this.setState({
            playingLyric: txt
        })
    }

    render() {
        const { fullScreen, playList, currentSong, playing, setFullScreen, sequenceList, mode, favoriteList } = this.props;
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
                                    favoriteList={favoriteList}
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
                                onPlay={this.ready}
                                onError={this.error}
                                onTimeUpdate={this.updateTime}
                                onEnded={this.end}
                                onPause={this.pause}
                        ></audio>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

const getPlayList = state => state.playList;
const getCurrentIndex = state => state.currentIndex;

const getCurrentSong = createSelector(
    [getPlayList, getCurrentIndex],
    (playList, currentIndex) => {
        return playList[currentIndex]
    }
)

const mapStateToProps = (state) => ({
    fullScreen: state.fullScreen,
    sequenceList: state.sequenceList,
    playList: state.playList,
    currentIndex: state.currentIndex,
    currentSong: getCurrentSong(state) || {},
    playing: state.playing,
    mode: state.mode,
    favoriteList: state.favoriteList
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
        },
        savePlayHistory: (song) => {
            savePlayHistory(dispatch, song)
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Player);