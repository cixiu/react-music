import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { prefixStyle } from 'common/js/dom';
import './index.styl';

const ProgressBtnWidth = 16;
const transform = prefixStyle('transform');

class ProgressBar extends Component {
    // 实例下的属性来储存touch事件相关的数据
    touch = {}
    static defaultProps = {
        percent: 0,
        percentChange: (percent) => {
            console.log('请输入一个改变percent的函数', percent)
        }
    }
    
    componentDidUpdate() {
        const { percent } = this.props;
        if (percent >= 0 && !this.touch.initial) {
            const ProgressBarWidth = this.ProgressBarDOM.clientWidth - ProgressBtnWidth;
            const offsetWidth = percent * ProgressBarWidth;
            this._offset(offsetWidth);
        }
    }
    // 拖动进度条
    progressTouchStart = (e) => {
        this.touch.initial = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.ProgressDOM.clientWidth;
    }
    progressTouchMove = (e) => {
        if (!this.touch.initial) {
            return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(this.ProgressBarDOM.clientWidth - ProgressBtnWidth, Math.max(0, this.touch.left + deltaX));
        this._offset(offsetWidth);

    }
    progressTouchEnd = (e) => {
        this.touch.initial = false;
        this._triggerPercent()
    }
    // 点击进度条
    progressClick = (e) => {
        const rect = this.ProgressBarDOM.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        this._offset(offsetWidth);
        this._triggerPercent();
    }
    _offset = (offsetWidth) => {
        this.ProgressDOM.style.width = `${offsetWidth}px`;
        this.ProgerssBtnDOM.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
    _triggerPercent = () => {
        const ProgressBarWidth = this.ProgressBarDOM.clientWidth - ProgressBtnWidth;
        const percent = this.ProgressDOM.clientWidth / ProgressBarWidth;
        this.props.percentChange(percent);
    }

    render() {
        return (
            <div className="progress-bar" ref={el => this.ProgressBarDOM = el} onClick={this.progressClick}>
                <div className="bar-inner">
                    <div className="progress" ref={el => this.ProgressDOM = el}></div>
                    <div 
                        className="progress-btn-wrapper"  
                        ref={el => this.ProgerssBtnDOM = el}
                        onTouchStart={this.progressTouchStart}
                        onTouchMove={this.progressTouchMove}
                        onTouchEnd={this.progressTouchEnd}
                    >
                        <div className="progress-btn"></div>
                    </div>
                </div>
            </div>
        )
    }
}

if (process.env.NODE_ENV === 'development') {
    ProgressBar.propTypes = {
        percent: PropTypes.number.isRequired,
        percentChange: PropTypes.func.isRequired,
    }
}

export default ProgressBar;
