import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import SingerDetail from 'components/singer-detail/singer-detail';
import SearchList from 'base/search-list/search-list';
import Confirm from 'base/confirm/confirm';
import Scroll from 'base/scroll/scroll';
import playListHOC from 'base/hoc/playListHOC';
import './index.styl';
import { getHotkey } from 'api/search';
import { ERR_OK } from 'api/config';
import { saveSearchHistory, deleteSearchHistory, clearSearchHistory } from 'store/dispatchMultiple';

class Search extends Component {
    state = {
        hotkey: [],
        query: '',
        isOpen: false
    }
    componentWillMount() {
        this._getHotkey();
    }
    componentDidUpdate() {
        // 如果高阶组件不传这个处理函数，则执行实例下的这个方法 否则执行高阶组件下的这个方法
        this.handlePlayList()
    }
    // 需要在高阶组件中定义要处理播放后屏幕适配的问题的事情
    handlePlayList = () => {
        throw new Error('component must implement handlePlayList method in HOC')
    }
    // 将热门搜索词添加到搜索框中
    addQuery = (query) => {
        this.SearchBox.setQuery(query);
    }
    // 将函数传个seach-box组件，当search-box中query改变时，search组件中的query也跟着改变
    queryChange = (query) => {
        this.setState({
            query
        })
    }
    // 使search-box中的input失去焦点
    inputBlur = () => {
        this.SearchBox.blur();
    }
    // 存储选中的搜索词到localStorage中
    saveSearch = () => {
        this.props.saveSearch(this.state.query);
    }
    // 删除一个搜索历史结果
    deleteOne = (item) => {
        this.props.deleteSearch(item);
    }
    // 清空搜索历史
    clearSearch = () => {
        this.props.clearSearch()
    }
    // 打开comfrim弹窗
    showConfirm = () => {
        this.setState({
            isOpen: true
        })
    }
    // 点击取消，关闭Confirm弹窗
    cancel = () => {
        this.setState({
            isOpen: false
        })
    }
    // 点击确定，执行要删除的操作，并且也关闭Confirm弹窗
    confirm = () => {
        this.clearSearch();
        this.setState({
            isOpen: false
        })
    }
    // 获取热门搜索词
    _getHotkey = () => {
        getHotkey().then(res => {
            if (res.code === ERR_OK) {
                this.setState({
                    hotkey: res.data.hotkey.slice(0, 10)
                })
            }
        })
    }
    render() {
        const { hotkey, query, isOpen } = this.state;
        const { searchHistory } = this.props;
        return (
            <div className="search">
                <div className="search-box-wrapper">
                    <SearchBox  queryChange={this.queryChange} 
                                ref={searchBox => this.SearchBox = searchBox}
                    >
                    </SearchBox>
                </div>
                {!query.trim() ? (
                        <div className="shortcut-wrapper" ref={el => this.listDOM = el}>
                            <Scroll className="shortcut">
                                <div>
                                    <div className="hot-key">
                                        <h1 className="title">热门搜索</h1>
                                        <ul>
                                            {hotkey.map(item => (
                                                <li className="item" key={item.k} onClick={() => this.addQuery(item.k)}>
                                                    <span>{item.k}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {searchHistory.length > 0 && 
                                        <div className="search-history">
                                            <h1 className="title">
                                                <span className="text">搜索历史</span>
                                                <span className="clear" onClick={this.showConfirm}>
                                                    <i className="icon-clear"></i>
                                                </span>
                                            </h1>
                                            <SearchList searches={searchHistory} 
                                                        selectItem={this.addQuery} 
                                                        deleteOne={this.deleteOne}
                                            >
                                            </SearchList>
                                        </div>
                                    }
                                </div>
                            </Scroll>
                        </div>
                    ) : (
                        <div className="search-result" ref={el => this.listDOM = el}>
                            <Suggest 
                                    query={query} 
                                    onBlur={this.inputBlur} 
                                    saveSearch={this.saveSearch}
                            >
                            </Suggest>
                        </div>
                    )
                }
                <Confirm text="是否清空所有搜索历史" isOpen={isOpen} cancel={this.cancel} confirm={this.confirm}></Confirm>
                <Route path="/search/:id" component={SingerDetail}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        searchHistory: state.searchHistory
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveSearch: (query) => {
            saveSearchHistory(dispatch, query);
        },
        deleteSearch: (query) => {
            deleteSearchHistory(dispatch, query);
        },
        clearSearch: () => {
            clearSearchHistory(dispatch);
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(playListHOC(Search));
