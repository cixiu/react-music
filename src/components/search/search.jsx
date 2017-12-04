import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import SingerDetail from 'components/singer-detail/singer-detail';
import './index.styl';
import { getHotkey } from 'api/search';
import { ERR_OK } from 'api/config';

class Search extends Component {
    state = {
        hotkey: [],
        query: ''
    }
    componentWillMount() {
        this._getHotkey();
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
        const { hotkey, query } = this.state;
        return (
            <div className="search">
                <div className="search-box-wrapper">
                    <SearchBox queryChange={this.queryChange} ref={searchBox => this.SearchBox = searchBox}></SearchBox>
                </div>
                {!query.trim() ? (
                        <div className="shortcut-wrapper">
                            <div className="shortcut">
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
                            </div>
                        </div>
                    ) : (
                        <div className="search-result">
                            <Suggest query={query}></Suggest>
                        </div>
                    )
                }
                <Route path="/search/:id" component={SingerDetail}/>
            </div>
        )
    }
}

export default Search;
