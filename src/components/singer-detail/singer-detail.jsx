import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { getSingerDetail } from 'api/singer';
import { ERR_OK } from 'api/config';
import './index.styl';

class SingerDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            in: false
        }
    }
    componentWillMount() {
        this._getSingerDetail()
    }
    componentDidMount() {
        this.setState({
            in: true
        })
    }
    // 返回路由
    back = () => {
        this.setState({
            in: false
        });
        setTimeout(() => {
            this.props.history.goBack();
        }, 300);
    }

    // 获取歌手的歌曲
    _getSingerDetail = () => {
        if (!this.props.singer.id) {
            this.props.history.push('/singer');
            return;
        }
        getSingerDetail(this.props.singer.id).then(res => {
            if (res.code === ERR_OK) {
                console.log(res.data.list);
            }
        }) 
    }

    render() {
        return (
            <CSSTransition classNames="slide" timeout={500} in={this.state.in}>
                <div className="singer-detail">
                    <button onClick={this.back}>back</button>
                </div>
            </CSSTransition>
        )
    }
}

// 将redux store状态树上的state映射到组件的props中
const mapStateToProps = (state) => {
    return {
        singer: state.singer
    }
} 

export default connect(
    mapStateToProps
)(SingerDetail);
