import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import Switches from 'base/switches/switches';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import Song from 'common/js/song';
import playListHOC from 'base/hoc/playListHOC';
import NoResult from 'base/no-result/no-result';
import { insertSong, playRandom } from 'store/dispatchMultiple';
import './index.styl';

class UserCenter extends Component {
    state = {
        in: false,
        switches: [
            {id: 0, name: '我喜欢的'},
            {id: 1, name: '最近听的'}
        ],
        currentIndex: 0
    }
    componentDidMount() {
        this.setState({
            in: true
        })
    }
    componentDidUpdate() {
        // 如果高阶组件不传这个处理函数，则执行实例下的这个方法  否则执行高阶组件下的这个方法
        this.handlePlayList()
    }
    // 需要在高阶组件中定义要处理播放后屏幕适配的问题的事情
    handlePlayList = () => {
        throw new Error('component must implement handlePlayList method in HOC')
    }
    back = () => {
        this.setState({
            in: false
        })
        setTimeout(() => {
            this.props.history.goBack();
        }, 300)
    }
    // 选择展示的switch
    selectSwitch = (index) => {
        this.setState({
            currentIndex: index
        })
    }
    // 选择一首歌
    selectSong = (song) => {
        this.props.insertSong(new Song(song), this.props);
    }
    // 随机播放全部
    randomPlay = () => {
        let list = this.state.currentIndex === 0 ? this.props.favoriteList : this.props.playHistory;
        if (!list.length) {
            return
        }
        list = list.map(song => {
            return new Song(song);
        })
        this.props.randomPlay(list);
    }
    noResult = () => {
        if (this.state.currentIndex === 0) {
            return !this.props.favoriteList.length
        }
        return !this.props.playHistory.length
    }
    noResultDesc = () => {
        if (this.state.currentIndex === 0) {
            return '暂无收藏歌曲'
        }
        return '您最近还没有听过歌曲'
    }

    render() {
        const { switches, currentIndex } = this.state;
        const { playHistory, favoriteList } = this.props;
        return (
            <CSSTransition classNames="slide" timeout={300} in={this.state.in}>
                <div className="user-center">
                    <div className="back" onClick={this.back}>
                        <i className="icon-back"></i>
                    </div>
                    <div className="switches-wrapper">
                        <Switches switches={switches} currentIndex={currentIndex} selectSwitch={this.selectSwitch}></Switches>
                    </div>
                    <div className="play-btn" onClick={this.randomPlay}>
                        <i className="icon-play"></i>
                        <span className="text">随机播放全部</span>
                    </div>
                    <div className="list-wrapper" ref={el => this.listDOM = el}>
                    {currentIndex === 0 && 
                    <Scroll className="list-scroll">
                        <div className="list-inner">
                            <SongList 
                                        songs={favoriteList} 
                                        selectItem={this.selectSong}
                            ></SongList>
                        </div>
                    </Scroll>
                    }
                    {currentIndex === 1 && 
                    <Scroll className="list-scroll">
                        <div className="list-inner">
                            <SongList 
                                        songs={playHistory} 
                                        selectItem={this.selectSong}
                            ></SongList>
                        </div>
                    </Scroll>
                    }
                    </div>
                    {this.noResult() && 
                    <div className="no-result-wrapper">
                        <NoResult title={this.noResultDesc()}></NoResult>
                    </div>
                    }
                </div>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        favoriteList: state.favoriteList,
        playHistory: state.playHistory,
        playList: state.playList,
        sequenceList: state.sequenceList,
        currentIndex: state.currentIndex
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        insertSong: (song, {playList, sequenceList, currentIndex}) => {
            const props = {song, playList, sequenceList, currentIndex}
            insertSong(dispatch, props)
        },
        randomPlay: (list) => {
            playRandom(dispatch, list)
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(playListHOC(UserCenter));