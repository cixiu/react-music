import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import searchHOC from 'base/hoc/searchHOC';
import Switches from 'base/switches/switches';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import SearchList from 'base/search-list/search-list';
import TopTip from 'base/top-tip/top-tip';
import { saveSearchHistory, deleteSearchHistory, insertSong } from 'store/dispatchMultiple';
import Song from 'common/js/song';
import './index.styl';

class AddSong extends Component {
    state = {
        in: false,
        query: '',
        switches: [
            {id: 0, name: '最近播放'},
            {id: 1, name: '搜索历史'},
        ],
        currentIndex: 0,
        isOpenTopTip: false
    }
    componentDidMount() {
        this.setState({
            in: true
        })
    }
    static defaultProps = {
        hide: () => {
            console.log('请传入收起页面的操作')
        }
    }
    static propTypes = {
        hide: PropTypes.func.isRequired,
    }
    hide = () => {
        this.setState({
            in: false
        })
        // 延时是为了做滑出的动画
        setTimeout(() => {
            this.props.hide()
        }, 200)
    }
    // 同步query到state
    queryChange = (query) => {
        this.setState({
            query: query
        })
    }
    // 选中某个搜索结果进行存储
    selectSuggest = () => {
        this.saveSearch()
        this.setState({
            isOpenTopTip: true
        })
    }
    // 选择要显示哪个switch
    selectSwitch = (index) => {
        this.setState({
            currentIndex: index
        })
    }
    // 选择播放最近播放歌曲列表歌某一个
    selectSong = (song, index) => {
        if (index !== 0) {
            this.props.insertSong(new Song(song), this.props);
            this.setState({
                isOpenTopTip: true
            })
        }
    }
    // 收起TopTip提示
    hideTopTip = () => {
        this.setState({
            isOpenTopTip: false
        })
    }
    render() {
        const { query, switches, currentIndex, isOpenTopTip } = this.state;
        const { playHistory, searchHistory } = this.props;
        return (
            <CSSTransition classNames="slide" timeout={200} in={this.state.in}>
                <div className="add-song" onClick={(e) => e.stopPropagation()}>
                    <div className="header">
                        <h1 className="title">添加歌曲到列表</h1>
                        <div className="close" onClick={this.hide}>
                            <i className="icon-close"></i>
                        </div>
                    </div>
                    <div className="search-box-wrapper">
                        <SearchBox 
                                    placeholder="搜索歌曲" 
                                    queryChange={this.queryChange} 
                                    ref={searchBox => this.SearchBox = searchBox}
                        ></SearchBox>
                    </div>
                    {!query &&
                    <div className="shortcut">
                        <Switches 
                                    switches={switches} 
                                    currentIndex={currentIndex} 
                                    selectSwitch={this.selectSwitch}
                        ></Switches>
                        <div className="list-wrapper">
                            {currentIndex === 0 && 
                            <Scroll className="list-scroll">
                                <div className="list-inner">
                                    <SongList 
                                                songs={playHistory} 
                                                selectItem={this.selectSong}
                                    ></SongList>
                                </div>
                            </Scroll>
                            }
                            {currentIndex === 1 && 
                            <Scroll className="list-scroll">
                                <div className="list-inner">
                                    <SearchList 
                                                searches={searchHistory} 
                                                selectItem={this.addQuery} 
                                                deleteOne={this.deleteOne}
                                    ></SearchList>
                                </div>
                            </Scroll>
                            }
                        </div>
                    </div>}
                    {!!query && 
                    <div className="search-result">
                        <Suggest query={query} showSinger={false} saveSearch={this.selectSuggest} onBlur={this.inputBlur}></Suggest>
                    </div>}
                    {isOpenTopTip && 
                    <TopTip hideTopTip={this.hideTopTip}>
                        <div className="tip-title">
                            <i className="icon-ok"></i>
                            <span className="text">添加成功</span>
                        </div>
                    </TopTip>
                    }
                </div>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        searchHistory: state.searchHistory,
        playHistory: state.playHistory,
        playList: state.playList,
        sequenceList: state.sequenceList,
        currentIndex: state.currentIndex,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveSearch: (query) => {
            saveSearchHistory(dispatch, query);
        },
        deleteSearch: (query) => {
            deleteSearchHistory(dispatch, query);
        },
        insertSong: (song, {playList, sequenceList, currentIndex}) => {
            const props = {song, playList, sequenceList, currentIndex}
            insertSong(dispatch, props)
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(searchHOC(AddSong));