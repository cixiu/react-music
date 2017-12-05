import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import NoResult from 'base/no-result/no-result';
import { search } from 'api/search';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic } from 'common/js/song';
import Singer from 'common/js/singer';
import { setSinger } from 'store/actions';
import { insertSong } from 'store/dispatchMultiple'
import './index.styl';

const TYPE_SINGER = 'singer';
const perpage = 20;

class Suggest extends Component {
    state = {
        page: 1,
        result: [],
        pullUpLoad: true,
        hasMore: true
    }
    static defaultProps = {
        query: '',
        showSinger: true,
        onBlur: () => {
            console.log('请传入一个让某个input框失去焦点的处理函数')
        },
        saveSearch: () => {
            console.log('请传入处理选中搜索词进行存储的函数')
        }
    }
    static propTypes = {
        query: PropTypes.string.isRequired,
        showSinger: PropTypes.bool.isRequired,
        onBlur: PropTypes.func.isRequired,
        saveSearch: PropTypes.func.isRequired,
    }
    // 因为我们在父组件中使用的时条件渲染
    // 当父组件的query不为空时，suggest组件首次挂载，那么在componentDidUpdate生命周期是不会执行的
    // 所以suggest组件挂载时也就是query不为空时就要发生请求了    
    componentDidMount() {    
        this.search()              
    }
    componentDidUpdate(prevProps, prevState) {
        const oldQuery = prevProps.query;
        const newQuery = this.props.query;
        if (oldQuery !== newQuery) {
            this.search();
        }
    }
    // 查询搜索词的相关数据
    search = () => {
        // 每次新的请求搜索时，重置相关数据
        this.setState({
            page: 1,
            hasMore: true
        })
        this.Scroll.scrollTo(0, 0)
        search(this.props.query, this.state.page, this.props.showSinger, perpage).then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    result: this._genResult(res.data)
                })
                this._checkMore(res.data)
            }
        })
    }
    // 加载更多
    loadMore = () => {
        // 没有更多了就return
        if (!this.state.hasMore) {
            return
        }
        this.setState(({page}) => ({
                page: page + 1
        }))
        search(this.props.query, this.state.page, this.props.showSinger, perpage).then(res => {
            if (res.code === ERR_OK) {
                this.setState(({result}) => ({
                    result: result.concat(this._genResult(res.data))
                }))
                this._checkMore(res.data)
            }
        })
    }
    // 选择搜索的内容进行点击
    selectItem = (item) => {
        if (item.type === TYPE_SINGER) {
            const singer = new Singer({
                id: item.singermid,
                name: item.singername
            })
            this.props.history.push(`/search/${singer.id}`)
            this.props.setSinger(singer);
        } else {
            this.props.insertSong(item, this.props)
        }
        this.props.saveSearch()
    }
    // 根据result数据来判断每条suggest前面的图标
    getIconCls = (item) => {
        if (item.type === TYPE_SINGER) {
            return 'icon-mine';
        } else {
            return 'icon-music';
        }
    }
    // 根据result数据来判断每条suggest要显示的名字
    getDisplayName = (item) => {
        if (item.type === TYPE_SINGER) {
            return item.singername;
        } else {
            return `${item.name} - ${item.singer}`;
        }
    }
    // 将search-box中的input框中的失焦处理传个scroll组件进行处理
    onBlur = () => {
        this.props.onBlur();
    }
    // 处理搜索词的相关数据
    _genResult = (data) => {
        let ret = [];
        if (data.zhida && data.zhida.singerid) {
            ret.push({...data.zhida,...{type: TYPE_SINGER}});
        }
        if (data.song) {
            ret = ret.concat(this._normalizeSongs(data.song.list));
        }
        return ret;
    }
    // 将歌曲数据处理成需要的格式
    _normalizeSongs = (list) => {
        let ret = [];
        list.forEach(item => {
            let musicData = item
            if (isValidMusic(musicData)) {
                ret.push(createSong(musicData));
            }
        });
        return ret;
    }
    // 检查是否还有更多数据可以加载
    _checkMore = (data) => {
        const song = data.song;
        if (!song.list.length || (song.curnum + song.curpage * perpage >= song.totalnum)) {
            this.setState({
                hasMore: false
            })
        }
    }

    render() {
        const { result, pullUpLoad, hasMore } = this.state;
        return (
            <Scroll className="suggest" 
                    pullUpLoad={pullUpLoad}
                    loadMore={this.loadMore}
                    lazyLoad={false}
                    beforeScroll={true}
                    onBlur={this.onBlur}
                    ref={Scroll => this.Scroll = Scroll}
            >
                <div>
                    <ul className="suggest-list">
                        {result.map((item, index) => (
                            <li className="suggest-item" key={index} onClick={() => this.selectItem(item)}>
                                <div className="icon">
                                    <i className={this.getIconCls(item)}></i>
                                </div>
                                <div className="name">
                                    <span className="text" dangerouslySetInnerHTML={{__html: this.getDisplayName(item)}}></span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {hasMore && <Loading></Loading>}
                    {!hasMore && result.length !==0 && <p className="no-more">没有更多了哦~~</p>}
                </div>
                {!hasMore && result.length === 0 && 
                    <div className="no-result-wrapper">
                        <NoResult title="抱歉，暂无搜索结果！"></NoResult>
                    </div>
                }
            </Scroll>
        )
    }
}

const mapStateToProps = (state) => {
    const { playList, sequenceList, currentIndex } = state;
    return {
        playList,
        sequenceList,
        currentIndex
    }
}

const mapDisPatchToProps = (dispatch) => ({
    setSinger: (singer) => {
        dispatch(setSinger(singer))
    },
    // 插入一首歌
    insertSong: (song, {playList, sequenceList, currentIndex}) => {
        const props = {song, playList, sequenceList, currentIndex}
        insertSong(dispatch, props)
    }
})

export default connect(
    mapStateToProps,
    mapDisPatchToProps
)(withRouter(Suggest));