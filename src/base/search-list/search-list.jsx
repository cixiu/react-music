import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './index.styl';

class SearchList extends Component {
    static defaultProps = {
        searches: [],
        selectItem: (item) => {
            console.log(`请传入回填${item}搜索历史的处理函数`)
        },
        deleteOne: (item) => {
            console.log(`请传入删除${item}搜索历史的处理函数`)
        }
    }
    static propTypes = {
        searches: PropTypes.array.isRequired,
        selectItem: PropTypes.func.isRequired,
        deleteOne: PropTypes.func.isRequired,
    }
    selectItem = (item) => {
        this.props.selectItem(item)
    }
    deleteOne = (e, item) => {
        e.stopPropagation();
        this.props.deleteOne(item)
    }
    render() {
        const { searches } = this.props;
        return (
            <div className="search-list">
                <TransitionGroup component="ul">
                    {searches.map(item => (
                        <CSSTransition classNames="list" key={item} timeout={200}>
                            <li className="search-item" onClick={() => this.selectItem(item)}>
                                <span className="text">{item}</span>
                                <span className="icon" onClick={(e) => this.deleteOne(e, item)}>
                                    <i className="icon-delete"></i>
                                </span>
                            </li>
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </div>
        )
    }
}

export default SearchList;