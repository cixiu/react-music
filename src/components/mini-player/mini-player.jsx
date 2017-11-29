import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setFullScreen } from 'store/actions';

class MiniPlay extends Component {
    open = () => {
        this.props.setFullScreen(true);
    }

    render() {
        const { currentSong } = this.props;
        return (
            <div className="mini-player" onClick={this.open}>
                <div className="icon">
                    <img width="40" height="40" src={currentSong.image} alt={currentSong.name}/>
                </div>
                <div className="text">
                    <h2 className="name">{currentSong.name}</h2>
                    <p className="desc">{currentSong.singer}</p>
                </div>
                <div className="control"></div>
                <div className="control">
                    <i className="icon-playlist"></i>
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
)(MiniPlay);
