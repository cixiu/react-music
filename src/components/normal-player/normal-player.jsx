import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFullScreen } from 'store/actions';

class NormalPlay extends Component {
    back = () => {
        this.props.setFullScreen(false);
    }
    
    render() {
        const { currentSong } = this.props;
        return (
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
                        <div className="cd-wrapper">
                            <div className="cd">
                                <img className="image" src={currentSong.image} alt={currentSong.name}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="operators">
                        <div className="icon i-left">
                            <i className="icon-sequence"></i>
                        </div>
                        <div className="icon i-left">
                            <i className="icon-prev"></i>
                        </div>
                        <div className="icon i-center">
                            <i className="icon-play"></i>
                        </div>
                        <div className="icon i-right">
                            <i className="icon-next"></i>
                        </div>
                        <div className="icon i-right">
                            <i className="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    currentSong: state.playList[state.currentIndex] || {}
})

const mapDispatchToProps = (dispatch) => {
    return {
        setFullScreen: (flag) => {
            dispatch(setFullScreen(flag))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NormalPlay);
