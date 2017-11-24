import React, { Component } from 'react';
import { NavLink as Link } from 'react-router-dom';
import './index.styl';

class Tab extends Component {
    render() {
        return (
            <div className="tab">
                <Link className="tab-item" activeClassName="router-link-active" to="/recommend">
                    <span className="tab-link">推荐</span>
                </Link>
                <Link className="tab-item" activeClassName="router-link-active" to="/singer">
                    <span className="tab-link">歌手</span>
                </Link>
                <Link className="tab-item" activeClassName="router-link-active" to="/rank">
                    <span className="tab-link">排行</span>
                </Link>
                <Link className="tab-item" activeClassName="router-link-active" to="/search">
                    <span className="tab-link">搜索</span>
                </Link>
            </div>
        )
    }
}

export default Tab;
