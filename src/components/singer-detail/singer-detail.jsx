import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import './index.styl';

class SingerDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            in: false,
            songs: []
        }
    }
    componentWillMount() {
        this._getSingerDetail()
    }
    componentDidMount() {
        this.setState({
            in: true
        })
    }
    // 返回路由
    back = () => {
        this.setState({
            in: false
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 300);
    }
    // 获取歌手的歌曲
    _getSingerDetail = () => {
        if (!this.props.singer.id) {
            this.props.history.push('/singer');
            return;
        }
        getSingerDetail(this.props.singer.id).then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    songs: this._normalizeSongs(res.data.list)
                })
            }
        }) 
    }
    // 将歌曲数据处理成需要的格式
    _normalizeSongs = (list) => {
        let ret = [];
        list.forEach(item => {
            let { musicData } = item;
            if (isValidMusic(musicData)) {
                ret.push(createSong(musicData));
            }
        });
        return ret;
    }

    render() {
        const { songs } = this.state;
        const title = this.props.singer.name;
        const bgImage = this.props.singer.avatar;
        return (
            <CSSTransition classNames="slide" timeout={500} in={this.state.in}>
                <MusicList songs={songs} title={title} bgImage={bgImage} back={this.back}></MusicList>
            </CSSTransition>
        )
    }
}

// 将redux store状态树上的state映射到组件的props中
const mapStateToProps = (state) => {
    return {
        singer: state.singer
    }
} 

export default connect(
    mapStateToProps
)(SingerDetail);
