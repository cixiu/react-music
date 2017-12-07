import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import './index.styl';

class TopTip extends Component {
    state = {
        in: false
    }
    static defaultProps = {
        hideTopTip: () => {
            console.log('请传入收起TopTip的操作')
        }
    }
    componentDidMount() {
        this.setState({
            in: true
        });
        clearTimeout(this.timerIn);
        clearTimeout(this.timerHide);
        this.timerIn = setTimeout(() => {
            this.setState({
                in: false
            })
        }, 1500)
        this.timerHide = setTimeout(() => {
            this.props.hideTopTip()
        }, 1700)
    }

    render() {
        return (
            <CSSTransition classNames="drop" timeout={300} in={this.state.in}>
                <div className="top-tip">
                    {this.props.children}
                </div>
            </CSSTransition>
        )
    }
}

export default TopTip