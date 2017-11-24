import React, { Component } from 'react';
import Slider from 'base/slider/slider';
import { getRecommend } from 'api/recommend';
import { ERR_OK } from 'api/config';
import './index.styl';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommends: []
        }
    }

    componentWillMount() {
        this._getRecommend();
    }

    // 获取推荐数据
    _getRecommend = () => {
        getRecommend().then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    recommends: res.data.slider
                })
            }
        })
    }

    render() {
        const {recommends} = this.state;
        return (
            <div className="recommend">
                <div className="recommend-content">
                    {recommends.length > 0 ? (
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
                    ) : null
                    }
                    <div className="recommend-list">
                        <h1 className="list-title">热门歌单推荐</h1>
                    </div>
                </div>
            </div>
        )
    }
}

export default Recommend;
