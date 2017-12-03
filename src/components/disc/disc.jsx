import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic } from 'common/js/song';
import MusicList from 'components/music-list/music-list';
import './index.styl';

class Disc extends Component {
    state = {
        in: false,
        songs: []
    }
    
    componentWillMount() {
        this._getSongList()
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
    // 获取歌单的歌曲
    _getSongList = () => {
        
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
)(Disc);
