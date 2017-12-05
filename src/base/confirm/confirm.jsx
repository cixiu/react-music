import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import './index.styl';

class Confirm extends Component {
    static defaultProps = {
        isOpen: false,
        text: '',
        cancelBtnText: '取消',
        confirmBtnText: '确定',
        cancel: () => {
            console.log('请传入要取消的操作')
        },
        confirm: () => {
            console.log('请传入要确定的操作')
        }
    }
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        text: PropTypes.string.isRequired,
        cancelBtnText: PropTypes.string.isRequired,
        confirmBtnText: PropTypes.string.isRequired,
        cancel: PropTypes.func.isRequired,
        confirm: PropTypes.func.isRequired,
    }
    cancel = () => {
        this.props.cancel()
    }
    confirm = () => {
        this.props.confirm()
    }
    render() {
        const { isOpen, text, cancelBtnText, confirmBtnText } = this.props;
        return (
            <CSSTransition classNames="confirm-fade" timeout={300} in={isOpen}>
                <div className="confirm" style={{ display: `${isOpen ? 'block': 'none'}` }}>
                    <div className="confirm-wrapper">
                        <div className="confirm-content">
                            <p className="text">{text}</p>
                            <div className="operate">
                                <div className="operate-btn left" onClick={this.cancel}>{cancelBtnText}</div>
                                <div className="operate-btn" onClick={this.confirm}>{confirmBtnText}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </CSSTransition>
        )
    }
}

export default Confirm;