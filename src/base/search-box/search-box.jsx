import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class SearchBox extends Component {
    state = {
        query: ''
    }
    static defaultProps = {
        placeholder: '搜索歌曲、歌手',
        queryChange: (query) => {
            console.log('请传入一个query函数作为一个属性')
        },
    }
    static propTypes = {
        placeholder: PropTypes.string.isRequired,
        queryChange: PropTypes.func.isRequired,
    }
    componentWillUpdate(nextProps, nextState) {
        // 向父组件传递query
        const oldQuery = this.state.query;
        const newQuery = nextState.query;
        if (oldQuery !== newQuery) {
            this.props.queryChange(newQuery)
        }
    }
    onChange = (e) => {
        this.setQuery(e.target.value);
    }
    clear = () => {
        this.setState({
            query: ''
        })
    }
    setQuery = (query) => {
        this.setState({
            query: query
        })
    }

    render() {
        const { placeholder } = this.props;
        const { query } = this.state;
        return (
            <div className="search-box">
                <i className="icon-search"></i>
                <input className="box" value={query} placeholder={placeholder} onChange={this.onChange}/>
                {!!query && <i className="icon-dismiss" onClick={this.clear}></i>}
            </div>
        )
    }
}

export default SearchBox;
