import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { getSingerList } from 'api/singer';
import { ERR_OK } from 'api/config';
import { setSinger } from 'store/actions';
import SingerData from 'common/js/singer';
import ListView from 'base/list-view/list-view';
import SingerDetail from 'components/singer-detail/singer-detail';
import playListHOC from 'base/hoc/playListHOC';    // 添加解决播放歌曲后滚动高度适配问题的高阶组件
import './index.styl';

const HOT_NAME = '热门';
const HOT_SINGER_LENGTH = 10;

class Singer extends Component {
    state = {
        singers: []
    }
    
    componentWillMount() {
        this._getSingerList();
    }

    componentDidUpdate() {
        // 如果高阶组件不传这个处理函数，则执行实例下的这个方法  否则执行高阶组件下的这个方法
        this.handlePlayList();
        
    }

    selectSinger = (singer) => {
        this.props.history.push(`/singer/${singer.id}`);
        this.props.setSinger(singer);
    }
    // 需要在高阶组件中定义要处理playList的事情
    handlePlayList = () => {
        throw new Error('component must implement handlePlayList method in HOC')
    }

    _getSingerList = () => {
        getSingerList().then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    singers: this._normalizeSingers(res.data.list)
                })
            }
        })
    }
    // 处理歌手列表数据变为有序数据
    _normalizeSingers = (list) => {
        let map = {
            hot: {
                title: HOT_NAME,
                items: []
            }
        };
        list.forEach(item => {
            if (item.Fsort <= HOT_SINGER_LENGTH) {
                map.hot.items.push(new SingerData({
                    id: item.Fsinger_mid,
                    name: item.Fsinger_name
                }))
            }
            const key = item.Findex;
            if (!map[key]) {
                map[key] = {
                    title: key,
                    items: []
                }
            }
            map[key].items.push(new SingerData({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
            }));
        });
        // 为了得到有序的列表数据，还需要在对map进行处理
        let hot = [];
        let ret = [];
        for (let key in map) {
            let value = map[key];
            if (value.title.match(/[a-zA-Z]/)) {
                ret.push(value);
            } else if (value.title === HOT_NAME) {
                hot.push(value)
            }
        }
        // 对字母序列进行排序
        ret.sort((a, b) => {
            return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        })
        return hot.concat(ret);
    }

    render() {
        return (
            <div className="singer" ref={el => this.listDOM = el}>
                <ListView data={this.state.singers} selectItem={this.selectSinger}></ListView>
                <Route path="/singer/:id" component={SingerDetail}/>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        playList: state.playList
    }
}

// 将dispatch方法映射到组件中
const mapDisPatchToProps = (dispatch) => ({
    setSinger: (singer) => {
        dispatch(setSinger(singer))
    }
})

export default connect(
    mapStateToProps,
    mapDisPatchToProps
)(playListHOC(Singer));
