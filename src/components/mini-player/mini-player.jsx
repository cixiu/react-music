import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import ProgressCircle from 'base/progress-circle/progress-circle';
import PlayList from 'components/playlist/playlist';
// import { setFullScreen } from 'store/actions';

class MiniPlay extends Component {
    state = {
        in: false,
        isOpen: false
    }
    static defaultProps = {
        currentSong: {},
        playing: false,
        togglePlay: () => {
            console.log('请传入一个控制播放状态的函数')
        },
        setFullScreen: null,
        playList: [],
        percent: 0
    }
    static propTypes = {
        currentSong: PropTypes.object.isRequired,
        playing: PropTypes.bool.isRequired,
        togglePlay: PropTypes.func.isRequired,
        setFullScreen: PropTypes.func.isRequired,
        playList: PropTypes.array.isRequired,
        percent: PropTypes.number.isRequired,
    }
    componentDidMount() {
        this.setState({
            in: true
        })
    }
    open = () => {
        this.props.setFullScreen(true);  
    }
    togglePlay = (e) => {
        e.stopPropagation();
        this.props.togglePlay()
    }
    // 打开播放列表
    openPlayList = (e) => {
        e.stopPropagation();
        this.setState({
            isOpen: true
        })
    }
    // 关闭播放列表
    hide = () => {
        this.setState({
            isOpen: false
        })
    }

    render() {
        const { currentSong, playing, percent } = this.props;
        const { isOpen } = this.state;
        const cdRotateCls = playing ? 'play' : 'play pause';
        const MiniPlayIconCls = playing ? 'icon-pause-mini' : 'icon-play-mini'
        return (
            <React.Fragment>
                <CSSTransition classNames="mini" timeout={200} in={this.state.in}>
                    <div className="mini-player" onClick={this.open}>
                        <div className="icon">
                            <img width="40" height="40" className={cdRotateCls} src={currentSong.image} alt={currentSong.name}/>
                        </div>
                        <div className="text">
                            <h2 className="name" dangerouslySetInnerHTML={{__html: currentSong.name}}></h2>
                            <p className="desc" dangerouslySetInnerHTML={{__html: currentSong.singer}}></p>
                        </div>
                        <div className="control">
                            <ProgressCircle radius={32} percent={percent}>
                                <i className={`icon-mini ${MiniPlayIconCls}`} onClick={this.togglePlay}></i>
                            </ProgressCircle>
                        </div>
                        <div className="control" onClick={this.openPlayList}>
                            <i className="icon-playlist"></i>
                        </div>
                    </div>
                </CSSTransition>
                <PlayList isOpen={isOpen} hide={this.hide}></PlayList>
            </React.Fragment>
        )
    }
}

export default MiniPlay;
