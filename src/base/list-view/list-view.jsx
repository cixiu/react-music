import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { getData, addClass, hasClass, removeClass } from 'common/js/dom';
import './index.styl';

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

class ListView extends Component {
    listGroup = [];        // 作为对listGroup的ref容器
    touch = {};
    listHeight = []        // list-group的高度的集合
    shortcutGroup = [];    // 右侧快速查询歌手的入口ref容器

    static defaultProps = {
        data: []
    }
    static propTypes = {
        data: PropTypes.array.isRequired
    }

    componentDidUpdate(nextProps, nextState) {
        if (this.props.data !== nextProps.data) {
            // 初始化第一个shortcut为current
            addClass(this.shortcutGroup[0], 'current');
            setTimeout(() => {
                this._calculateHeight();
            }, 20)
        }
    }
    
    onShortcutTouchStart = (e) => {
        let anchorIndex = getData(e.target, 'index');
        this.touch.y1 = e.touches[0].pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
    }

    onShortcutTouchMove = (e) => {
        // e.preventDefault();
        // e.stopPropagation();
        this.touch.y2 = e.touches[0].pageY;
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT);
        // 注意this.touch.anchorIndex是一个字符串数字，所以需要parseInt转成数字类型
        let anchorIndex = parseInt(this.touch.anchorIndex, 10) + delta;
        this._scrollTo(anchorIndex);
    }

    scroll = (pos) => {
        this._scrollY(pos);
    }
    // 滚动监听时触发的函数
    _scrollY = (pos) => {
        const newY = pos.y || pos;
        let listHeight = this.listHeight;
        // 当滚动到顶部 newY > 0时
        if (newY > 0) {
            this.listFixed.style.display = 'none';
            return;
        }
        // 在中间滚动时
        this.listFixed.style.display = 'block';
        for (let i = 0, len = listHeight.length - 1; i < len; i++) {
            let height1 = listHeight[i];
            let height2 = listHeight[i + 1];
            if (-newY >= height1 && -newY < height2) {
                // 如果没有current这个class就加上
                if (!hasClass(this.shortcutGroup[i], 'current')) {
                    for (let i = 0, len = this.shortcutGroup.length; i < len; i++) {
                        removeClass(this.shortcutGroup[i], 'current')
                    }
                    this.fixedTitle.innerHTML = this.props.data[i].title;
                    addClass(this.shortcutGroup[i], 'current');
                }
                this._diff(height2 + newY);
                return;
            }
        }
        // 当滚动到底部时， 且-newY大于最后一个元素区块高度的上线时
        addClass(this.shortcutGroup[listHeight.length - 2], 'current')
    }
    // 滚动到指定元素索引的位置
    _scrollTo = (index) => {
        // 鼠标或者手指点击或者滑动右侧快速入口的边界判断
        if (!index && index !== 0) {
            return;
        }
        if (index < 0) {
            index = 0
        } else if (index > this.listHeight.length - 2) {
            index = this.listHeight.length - 2
        }
        this.scroll(-this.listHeight[index]);
        this.listview.scrollToElement(this.listGroup[index], 0);
    }
    // 计算各个区块的高度
    _calculateHeight = () => {
        this.listHeight = [];
        let list = this.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0, len = list.length; i < len; i++) {
            let item = list[i];
            height += item.clientHeight;
            this.listHeight.push(height);
        }
    }
    // shortcut变化时切换的动画
    _diff = diff => {
        let fixedTop = (diff > 0 && diff < TITLE_HEIGHT) ? diff - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) {
            return
        }
        this.fixedTop = fixedTop;
        this.listFixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }


    render() {
        const { data } = this.props;
        const shortcutList = data.map(group => {
            return group.title.substring(0, 1);
        })
        return (
            <Scroll 
                    className="listview" 
                    probeType={3} 
                    listenScroll={true} 
                    ref={listview => this.listview = listview}
                    scroll={this.scroll}
            >
                <ul>
                    {data.map((group, index) => 
                        <li className="list-group" key={group.title} ref={listGroup => this.listGroup[index] = listGroup}>
                            <h2 className="title">{group.title}</h2>
                            <ul>
                                {group.items.map(item => 
                                    <li className="list-group-item" key={item.id}>
                                        <div className="avatar">
                                            <LazyLoad height={50} throttle={300} once>
                                                <img width="50" height="50" src={item.avatar} alt={item.name}/>
                                            </LazyLoad>
                                        </div>
                                        <span className="name">{item.name}</span>
                                    </li>
                                )}
                            </ul>
                        </li>
                    )}
                </ul>
                <div    className="list-shortcut" 
                        onTouchStart={this.onShortcutTouchStart} 
                        onTouchMove={this.onShortcutTouchMove}
                >
                    <ul>
                        {shortcutList.map((item, index) => 
                            <li 
                                className="item" 
                                key={item} 
                                data-index={index}
                                ref={fixedTitle => this.shortcutGroup[index] = fixedTitle}
                            >
                                {item}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="list-fixed" ref={listFixed => this.listFixed = listFixed}>
                    <h2 className="fixed-title" ref={fixedTitle => this.fixedTitle = fixedTitle}>
                        {data[0] ? data[0].title : ''}
                    </h2>
                </div>
                {
                    data.length === 0 && 
                    <div className="loading-container">
                        <Loading />
                    </div>
                }
            </Scroll>
        )
    }
}

export default ListView;
