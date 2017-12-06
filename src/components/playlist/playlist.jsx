import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import { playMode } from 'common/js/config';
import * as types from 'store/actions';
import { deleteSong, clearSongList } from 'store/dispatchMultiple';
import './index.styl';

class PlayList extends Component {
    state = {
        isOpen: false
    }
    groupList = [];

    static defaultProps = {
        isOpen: false,
        hide: () => {
            console.log('请传入隐藏播放列表的处理函数')
        }
    }
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        hide: PropTypes.func.isRequired,
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen === prevProps.isOpen && prevProps.currentSong.id === this.props.currentSong.id) {
            return
        }
        // 加定时器时防止滚动位置不正确
        setTimeout(() => {
            this.Scroll.refresh();
            this.scrollToCurrent(this.props.currentSong);
        }, 120)
    }
    // 关闭播放列表
    hide = () => {
        this.props.hide();
    }
    // 设置当前播放歌曲的icon
    getCurrentIcon = (item) => {
        if (this.props.currentSong.id === item.id) {
            return 'icon-play'
        } else {
            return ''
        }
    }
    // 选择歌曲播放
    selectItem = (item, index) => {
        if (this.props.mode === playMode.random) {
            index = this.props.playList.findIndex(song => {
                return song.id === item.id
            })
        }
        this.props.setCurrentIndex(index);
        this.props.setPlaying(true);
    }
    // 滚动到当前播放的歌曲
    scrollToCurrent = (current) => {
        const index = this.props.sequenceList.findIndex(song => {
            return song.id === current.id
        })
        this.Scroll.scrollToElement(this.groupList[index], 300);
    }
    // 删除一首歌
    deleteOne = (item, index, e) => {
        e.stopPropagation();
        this.props.deleteSong(item, this.props);
        if (!this.props.playList.length) {
            this.hide()
        }
    }
    // 使用类的绑定函数可以避免 ref 回调以内联函数的方式定义，在更新期间它会被调用两次，第一次参数是 null ，之后参数是 DOM 元素的问题
    getListRef = (index, el) => {
        if (!el) {
            return
        }
        this.groupList[index] = el;
    }
    // 点击垃圾桶，打开提示弹窗
    showConfirm = () => {
        this.setState({
            isOpen: true
        })
    }
    // 取消清空
    cancel = () => {
        this.setState({
            isOpen: false
        })
    }
    // 确定清空
    confirm = () => {
        this.props.clearSongList();
        this.setState({
            isOpen: false
        })
    }

    render() {
        const { isOpen, sequenceList } = this.props;
        // 这一步是有必要的
        this.groupList = [];  
        return (
            <CSSTransition classNames="list-fade" timeout={300} in={isOpen}>
                <div className="playlist" style={{display: `${isOpen ? '' : 'none'}`}} onClick={this.hide}>
                    <div className="list-wrapper" onClick={(e) => e.stopPropagation()}>
                        <div className="list-header">
                            <h1 className="title">
                                <i className="icon"></i>
                                <span className="text"></span>
                                <span className="clear" onClick={this.showConfirm}>
                                    <i className="icon-clear"></i>
                                </span>
                            </h1>
                        </div>
                        <Scroll className="list-content" ref={scroll => this.Scroll = scroll}>
                            <div>
                                <TransitionGroup component="ul">
                                    {sequenceList.map((item, index) => (
                                        <CSSTransition classNames="list" timeout={200} key={item.id}>
                                            <li className="item" 
                                                onClick={() => this.selectItem(item, index)}
                                                ref={this.getListRef.bind(this, index)}
                                            >
                                                <i className={`current ${this.getCurrentIcon(item)}`}></i>
                                                <span className="text">{item.name}</span>
                                                <span className="like">
                                                    <i className="icon-not-favorite"></i>
                                                </span>
                                                <span className="delete" onClick={(e) => this.deleteOne(item, index, e)}>
                                                    <i className="icon-delete"></i>
                                                </span>
                                            </li>
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                                <div className="list-operate">
                                    <div className="add">
                                        <i className="icon-add"></i>
                                        <span className="text">添加歌曲到队列</span>
                                    </div>
                                </div>
                            </div>
                        </Scroll>
                        <div className="list-close" onClick={this.hide}>
                            <span>关闭</span>
                        </div>
                    </div>
                    <Confirm    isOpen={this.state.isOpen} 
                                text="确定要清空播放列表？" 
                                confirmBtnText="清空"
                                cancel={this.cancel}
                                confirm={this.confirm}
                    ></Confirm>
                </div>
            </CSSTransition>
        )
    }
}

const mapStateToProps = (state) => {
    const { sequenceList, currentIndex, playList, mode } = state;
    const currentSong = playList[currentIndex];
    return {
        sequenceList,
        playList,
        currentIndex,
        currentSong,
        mode
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentIndex: (index) => {
            dispatch(types.setCurrentIndex(index));
        },
        setPlaying: (flag) => {
            dispatch(types.setPlayStatus(flag));
        },
        deleteSong: (song, props) => {
            deleteSong(dispatch, {song,...props})
        },
        clearSongList: () => {
            clearSongList(dispatch)
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PlayList);