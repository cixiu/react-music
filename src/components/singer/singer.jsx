import React, { Component } from 'react';
import { getSingerList } from 'api/singer';
import { ERR_OK } from 'api/config';
import SingerData from 'common/js/singer';
import ListView from 'base/list-view/list-view';
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
            <div className="singer">
                <ListView data={this.state.singers}/>>
            </div>
        )
    }
}

export default Singer;
