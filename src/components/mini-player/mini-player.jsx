import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import ProgressCircle from 'base/progress-circle/progress-circle';
// import { setFullScreen } from 'store/actions';

class MiniPlay extends Component {
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
    state = {
        in: false
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

    render() {
        const { currentSong, playing, percent } = this.props;
        const cdRotateCls = playing ? 'play' : 'play pause';
        const MiniPlayIconCls = playing ? 'icon-pause-mini' : 'icon-play-mini'
        return (
            <CSSTransition classNames="mini" timeout={200} in={this.state.in}>
                <div className="mini-player" onClick={this.open}>
                    <div className="icon">
                        <img width="40" height="40" className={cdRotateCls} src={currentSong.image} alt={currentSong.name}/>
                    </div>
                    <div className="text">
                        <h2 className="name">{currentSong.name}</h2>
                        <p className="desc">{currentSong.singer}</p>
                    </div>
                    <div className="control">
                        <ProgressCircle radius={32} percent={percent}>
                            <i className={`icon-mini ${MiniPlayIconCls}`} onClick={this.togglePlay}></i>
                        </ProgressCircle>
                    </div>
                    <div className="control">
                        <i className="icon-playlist"></i>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

// const mapStateToProps = (state) => ({
//     currentSong: state.playList[state.currentIndex] || {},
//     playing: state.playing
// })

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setFullScreen: (flag) => {
//             dispatch(setFullScreen(flag))
//         }
//     }
// }

export default connect(
    // mapStateToProps,
    // mapDispatchToProps
)(MiniPlay);
