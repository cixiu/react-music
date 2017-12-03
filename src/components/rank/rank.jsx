import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import LazyImage from 'base/lazy-image/lazy-image';
import Loading from 'base/loading/loading';
import Scroll from 'base/scroll/scroll';
import playListHOC from 'base/hoc/playListHOC';
import TopList from 'components/top-list/top-list';
import { getTopList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { setTopList } from 'store/actions';
import './index.styl';

class Rank extends Component {
    state = {
        topList: []
    }
    // 做图片懒加载所需要传个Scroll组件的属性
    probeType = 3;
    listenScroll = true;

    componentWillMount() {
        this._getTopList()
    }

    componentDidUpdate() {
        this.handlePlayList();
    }
    // 需要在高阶组件中定义要处理播放后屏幕适配的问题的事情
    handlePlayList = () => {
        throw new Error('component must implement handlePlayList method in HOC')
    }

    selectItem = (item) => {
        this.props.history.push(`/rank/${item.id}`);
        this.props.setTopList(item);
    }

    _getTopList = () => {
        getTopList().then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    topList: res.data.topList
                })
            }
        })
    }
    render() {
        const { topList } = this.state;
        return (
            <div className="rank" ref={el => this.listDOM = el}>
                <Scroll className="toplist" probeType={this.probeType} listenScroll={this.listenScroll}>
                    <ul>
                        {topList.map(item => (
                            <li className="item" key={item.id} onClick={() => this.selectItem(item)}>
                                <div className="icon">
                                    <LazyLoad height={100} once placeholder={<LazyImage width={100} height={100} />}>
                                        <img width="100" height="100" src={item.picUrl} alt={item.topTitle}/>
                                    </LazyLoad>
                                </div>
                                <ul className="songlist">
                                    {item.songList.map((song, index) => (
                                        <li className="song" key={index}>
                                            <span>{index + 1}&nbsp;&nbsp;</span>
                                            <span>{song.songname} - {song.singername}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    {topList.length === 0 && 
                        <div className="loading-container">
                            <Loading></Loading>
                        </div>
                    }
                </Scroll>
                <Route path="/rank/:id" component={TopList}/>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setTopList: (topList) => {
            dispatch(setTopList(topList))
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(playListHOC(Rank));
