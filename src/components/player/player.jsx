import React, { Component } from 'react';
import { connect } from 'react-redux';
import NormalPlayer from 'components/normal-player/normal-player';
import MiniPlayer from 'components/mini-player/mini-player';
import './index.styl';

class Player extends Component {
    render() {
        const { fullScreen, playList, currentSong } = this.props;
        return (
            <div className="player-wrapper">
                {playList.length > 0 && (
                    <div className="player">
                        {fullScreen ? (
                            <NormalPlayer currentSong={currentSong}/>
                        ) : (
                            <MiniPlayer currentSong={currentSong}/>
                        )}
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    fullScreen: state.fullScreen,
    playList: state.playList,
    currentSong: state.playList[state.currentIndex] || {}
})

export default connect(
    mapStateToProps
)(Player);