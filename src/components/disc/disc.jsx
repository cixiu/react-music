import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { getCdInfo } from 'api/recommend';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic } from 'common/js/song';
import MusicList from 'components/music-list/music-list';

class Disc extends Component {
    state = {
        in: false,
        songs: []
    }
    
    componentWillMount() {
        this._getCdInfo()
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
    _getCdInfo = () => {
        if (!this.props.disc.dissid) {
            this.props.history.push('/recommend');
            return
        }
        getCdInfo(this.props.disc.dissid).then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    songs: this._normalizeSongs(res.cdlist[0].songlist)
                })
            }
        })
    }
    // 将歌曲数据处理成需要的格式
    _normalizeSongs = (list) => {
        let ret = [];
        list.forEach(item => {
            if (isValidMusic(item)) {
                ret.push(createSong(item));
            }
        });
        return ret;
    }

    render() {
        const { songs } = this.state;
        const title = this.props.disc.dissname;
        const bgImage = this.props.disc.imgurl;
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
        disc: state.disc
    }
} 

export default connect(
    mapStateToProps
)(Disc);
