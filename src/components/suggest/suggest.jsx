import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { search } from 'api/search';
import { ERR_OK } from 'api/config';
import { createSong, isValidMusic } from 'common/js/song';
import Singer from 'common/js/singer';
import { setSinger, setPlayList, setSequenceList, setCurrentIndex, setPlayStatus } from 'store/actions';
import { findIndex } from 'common/js/util';
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
        showSinger: true
    }
    static propTypes = {
        query: PropTypes.string.isRequired,
        showSinger: PropTypes.bool.isRequired,
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
                    {!hasMore && <p className="no-more">没有更多了哦~~</p>}
                </div>
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
    insertSong: (song, {playList, sequenceList, currentIndex}) => {
        playList = playList.slice();
		sequenceList = sequenceList.slice();
		// 记录当前歌曲
		let currentSong = playList[currentIndex];
		// 查询当前播发的歌曲列表是否有待插入的歌曲并返回其索引
		let fpIndex = findIndex(playList, song);
		// 因为时插入歌曲 所以索引+1
		currentIndex++;
		// 插入这首歌到当前位置
		playList.splice(currentIndex, 0, song);
		// 如果播放列表已经包含了这首要插入的歌
		if (fpIndex > -1) {
			// 当要插入的这首歌的序号大于原播放列表里的序号时 则删除掉原来的歌曲
			if (currentIndex > fpIndex) {
				playList.splice(fpIndex, 1);
				currentIndex--;
			} else {  // 当要插入的这首歌的序号小于原播放列表里的序号时 则删除掉原来的歌曲
				playList.splice(fpIndex + 1, 1);
			}
		}

		// 记录当前播放歌曲在顺序播放列表中的位置，并且在这个位置之后需要插入待插入的歌曲
		let currentSIndex = findIndex(sequenceList, currentSong) + 1;
		// 查询顺序播放歌曲列表是否有待插入的歌曲并返回其索引
		let fsIndex = findIndex(sequenceList, song);
		// 在当前顺序播放列表中的当前播放歌曲之后插入待插入的歌曲
		sequenceList.splice(currentSIndex, 0, song);
		// 如果顺序播放列表已经包含了这首要插入的歌
		if (fsIndex > -1) {
			// 当要插入的这首歌的序号大于原顺序播放列表里的序号时 则删除掉原来的歌曲
			if (currentSIndex > fsIndex) {
				sequenceList.splice(fsIndex, 1);
			} else {  // 当要插入的这首歌的序号小于原顺序播放列表里的序号时 则删除掉原来的歌曲
				sequenceList.splice(fsIndex + 1, 1);
			}
		}
		dispatch(setPlayList(playList));
		dispatch(setSequenceList(sequenceList));
		dispatch(setCurrentIndex(currentIndex));
		dispatch(setPlayStatus(true));
    }
})

export default connect(
    mapStateToProps,
    mapDisPatchToProps
)(withRouter(Suggest));