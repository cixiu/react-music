import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import Loading from 'base/loading/loading';
import playListHOC from 'base/hoc/playListHOC';    // 添加解决播放歌曲后滚动高度适配问题的高阶组件
import { prefixStyle } from 'common/js/dom';
import { selectPlay, playRandom } from 'store/dispatchMultiple';
import './index.styl';

const RESERVE_HEIGHT = 40;    // 保留的title高度
const transform = prefixStyle('transform');
const backdrop = prefixStyle('backdrop-filter');

class MusicList extends Component {
    probeType = 3;
    listenScroll = true;
    lazyLoad = false;

    static defaultProps = {
        bgImage: '',
        songs: [],
        title: '',
        back: () => {
            console.log('请传入一个路由返回操作的函数');
        },
        rank: false
    }
    
    shouldComponentUpdate(nextProps) {
        if (!nextProps.bgImage) {
            return false
        }
        return true
    }
    componentDidMount() {
        this.imageHeight = this.bgImageDOM.clientHeight;  
        this.minTranslateY = -this.imageHeight + RESERVE_HEIGHT;
        // this.listDOM获取的是Scroll组件暴露出的一个DOM子节点
        this.listDOM.style.top = `${this.imageHeight}px`;
    }
    componentWillUnmount() {
        // 点击返回按钮时停止对滚动的监听 消除报错
        // 当组件中的scroll还在进行momentum运动时，我们点击了返回上一路由时，这个组件即使被卸载，由于我们监听了滚动
        // 所以Scroll组件中的scroll事件依然会触发，也就是这里的scroll函数依然还在持续的被执行，由于这时已经点击了返回上一路由
        // 组件已经被卸载了，组件中的dom节点已经是undefined，这时还在执行的函数使用这些被卸载的dom就会报错
        // 所以在组件卸载的时候，应该让Scroll停止运行
        this.Scroll.stop();
    }
    componentDidUpdate() {
        // 如果高阶组件不传这个处理函数，则执行实例下的这个方法  否则执行高阶组件下的这个方法
        this.handlePlayList()
    }
    back = () => {
        this.props.back();
    }
    // 监听滚动时触发
    scroll = (pos) => {
        if (!this.props.songs.length) {
            return
        }
        let newY = pos.y;
        // 上滑效果
        let TranslateY = Math.max(this.minTranslateY, newY);
        let zIndex = 0;
        this.bgLayerDOM.style[transform] = `translate3d(0, ${TranslateY}px, 0)`;
        if (newY < this.minTranslateY) {
            zIndex = 10;
            this.bgImageDOM.style.paddingTop = 0;
            this.bgImageDOM.style.height = `${RESERVE_HEIGHT}px`;
            this.playWrapperDOM.style.display = 'none';
        } else {
            this.bgImageDOM.style.paddingTop = '70%';
            this.bgImageDOM.style.height = 0;
            this.playWrapperDOM.style.display = '';
        }

        // 下拉效果
        let scale = 1;
        let blur = 0;     // 上滑图片背景高斯模糊
        const percent = Math.abs(newY / this.imageHeight);
        if (newY > 0) {
            zIndex = 10;
            scale = 1 + percent;
        } else {
            blur = Math.min(20 * percent, 20);
        }
        this.bgImageDOM.style.zIndex = zIndex;
        this.bgImageDOM.style[transform] = `scale(${scale})`;
        this.filterDOM.style[backdrop] = `blur(${blur})px`;
    }
    // 选中歌曲进行播放
    selectItem = (song, index) => {
        const { songs, mode } = this.props;
        this.props.selectPlay(songs, index, mode);
    }
    // 点击随机播放按钮
    playRandom = () => {
        this.props.playRandom(this.props.songs);
    }
    // 需要在高阶组件中定义要处理playList的事情
    handlePlayList = () => {
        throw new Error('component must implement handlePlayList method in HOC')
    }
    bgImageRef = (el) => {
        if (el) {
            this.bgImageDOM = el
        }
    }

    render() {
        const {songs, title, bgImage, rank} = this.props;
        // console.log(this.props)
        return (
            <div className="music-list">
                <div className="back" onClick={this.back}>
                    <i className="icon-back"></i>
                </div>
                <h1 className="title">{title}</h1>
                <div 
                    className="bg-image" 
                    style={{backgroundImage: `url(${bgImage})`}} 
                    ref={this.bgImageRef.bind(this)}
                >
                    {songs.length > 0 &&
                        <div className="play-wrapper" ref={el => this.playWrapperDOM = el}>
                            <div className="play" onClick={this.playRandom}>
                                <i className="icon-play"></i>
                                <span className="text">随机播放全部</span>
                            </div>
                        </div>
                    }
                    <div className="filter" ref={el => this.filterDOM = el}></div>
                </div>
                <div className="bg-layer" ref={el => this.bgLayerDOM = el}></div>
                <Scroll 
                        className="list" 
                        scrollRef={el => this.listDOM = el}
                        probeType={this.probeType}
                        listenScroll={this.listenScroll}
                        scroll={this.scroll}
                        lazyLoad={this.lazyLoad}
                        ref={scroll => this.Scroll = scroll}
                >
                    <div className="song-list-wrapper">
                        <SongList songs={songs} selectItem={this.selectItem} rank={rank}></SongList>
                    </div>
                    {songs.length === 0 &&
                        <div className="loading-container">
                            <Loading></Loading>
                        </div>
                    }
                </Scroll>
            </div>
        )
    }
}

if (process.env.NODE_ENV === 'development') {
    MusicList.propTypes = {
        bgImage: PropTypes.string.isRequired,
        songs: PropTypes.array.isRequired,
        title: PropTypes.string.isRequired,
        back: PropTypes.func.isRequired,
        rank: PropTypes.bool.isRequired
    }
}

const mapStateToProps = (state) => {
    return {
        mode: state.mode,
        playList: state.playList
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        // 选择播放歌曲
        selectPlay: (list, index, mode) => {
            selectPlay(dispatch, list, index, mode)
        },
        // 随机播放全部
        playRandom: (list) => {
            playRandom(dispatch, list)
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(playListHOC(MusicList)));
