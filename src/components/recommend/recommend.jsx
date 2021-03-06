import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import Slider from 'base/slider/slider';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import LazyImage from 'base/lazy-image/lazy-image';
import playListHOC from 'base/hoc/playListHOC';    // 添加解决播放歌曲后滚动高度适配问题的高阶组件
import { getRecommend, getDiscList } from 'api/recommend';
import { ERR_OK } from 'api/config';
import { setDisc } from 'store/actions';
import './index.styl';
// 路由懒加载
import Loadable from 'react-loadable';
const Disc = Loadable({
    loader: () => import('components/disc/disc'),
    loading: Loading
})

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommends: [],
            discList: []
        }
    }

    componentWillMount() {
        this._getRecommend();
        this._getDiscList();
    }

    componentWillUnmount() {
        // 所以在组件卸载的时候，应该让Scroll停止运行
        this.Scroll.stop();
    }

    componentDidUpdate() {
        // 如果高阶组件不传这个处理函数，则执行实例下的这个方法  否则执行高阶组件下的这个方法
        this.handlePlayList()
    }
    // 需要在高阶组件中定义要处理播放后屏幕适配的问题的事情
    handlePlayList = () => {
        throw new Error('component must implement handlePlayList method in HOC')
    }
    // 选择歌单进行路由跳转
    selectItem = (item) => {
        this.props.history.push(`/recommend/${item.dissid}`);
        this.props.setDisc(item);
    }

    // 获取推荐的slider数据
    _getRecommend = () => {
        getRecommend().then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    recommends: res.data.slider
                })
            }
        })
    }
    // 获取歌单推荐
    _getDiscList = () => {
        getDiscList().then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    discList: res.data.list
                })
            }
        })
    }

    render() {
        const {recommends, discList} = this.state;
        return (
            <div className="recommend" ref={el => this.listDOM = el}>
                <Scroll 
                        className="recommend-content" 
                        probeType={3} 
                        listenScroll={true} 
                        lazyLoad={true}
                        ref={scroll => this.Scroll = scroll}
                >
                    <div>
                        {
                            recommends.length > 0 &&
                            <div className="slider-wrapper">
                                <div className="slider-content">
                                    <Slider>
                                        {recommends.map(item => (
                                            <div key={item.id}>
                                                <a href={item.linkUrl}>
                                                    <img src={item.picUrl} alt=""/>
                                                </a>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        }
                        <div className="recommend-list">
                            <h1 className="list-title">热门歌单推荐</h1>
                            <ul>
                                {discList.map(item => (
                                    <li className="item" key={item.dissid} onClick={() => this.selectItem(item)}>
                                        <div className="icon">
                                            <LazyLoad height={60} debounce={300} once placeholder={<LazyImage />}>
                                                <img width="60" height="60" src={item.imgurl} alt={item.dissname}/>
                                            </LazyLoad>
                                        </div>
                                        <div className="text">
                                            <h2 className="name">{item.dissname}</h2>
                                            <p className="desc">{item.creator.name}</p>
                                            <span className="listen-num">播放量: {(item.listennum / 1000).toFixed(1)}万</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {
                        discList.length === 0 && 
                        <div className="loading-container">
                            <Loading />
                        </div>
                    }
                </Scroll>
                <Route path="/recommend/:id" component={Disc}/>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        playList: state.playList
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setDisc: (disc) => {
            dispatch(setDisc(disc))
        }
    }
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(playListHOC(Recommend));
