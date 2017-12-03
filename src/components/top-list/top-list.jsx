import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { getMusicList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic } from 'common/js/song';
import MusicList from 'components/music-list/music-list';

class TopList extends Component {
    state = {
        in: false,
        songs: []
    }
    
    rank = true;       // 显示排行榜样式图标

    componentWillMount() {
        this._getMusicList()
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
    // 获取指定排行榜歌单的歌曲
    _getMusicList = () => {
        if (!this.props.topList.id) {
            this.props.history.push('/rank');
            return
        }
        getMusicList(this.props.topList.id).then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    songs: this._normalizeSongs(res.songlist)
                })
            }
        })
    }
    // 将歌曲数据处理成需要的格式
    _normalizeSongs = (list) => {
        let ret = [];
        list.forEach(item => {
            let musicData = item.data
            if (isValidMusic(musicData)) {
                ret.push(createSong(musicData));
            }
        });
        return ret;
    }

    render() {
        const { songs } = this.state;
        const title = this.props.topList.topTitle;
        const bgImage = songs.length ? songs[0].image : '';
        return (
            <CSSTransition classNames="slide" timeout={500} in={this.state.in}>
                <MusicList songs={songs} title={title} bgImage={bgImage} back={this.back} rank={true}></MusicList>
            </CSSTransition>
        )
    }
}

// 将redux store状态树上的state映射到组件的props中
const mapStateToProps = (state) => {
    return {
        topList: state.topList
    }
} 

export default connect(
    mapStateToProps
)(TopList);
