import React, { Component } from 'react';
import LazyLoad from 'react-lazyload';
import Slider from 'base/slider/slider';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getRecommend, getDiscList } from 'api/recommend';
import { ERR_OK } from 'api/config';
import './index.styl';

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
            <div className="recommend">
                <Scroll className="recommend-content" probeType={3} listenScroll={true}>
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
                                    <li className="item" key={item.dissid}>
                                        <div className="icon">
                                            <LazyLoad throttle={200} height={60} overflow={true}>
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
            </div>
        )
    }
}

export default Recommend;
