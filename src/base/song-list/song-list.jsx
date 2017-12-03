import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class SongList extends Component {
    static defaultProps = {
        songs: [],
        selectItem: () => {
            console.log('请传入一个函数来处理选择的歌曲')
        },
        rank: false
    }
    static propTypes = {
        songs: PropTypes.array.isRequired,
        selectItem: PropTypes.func.isRequired,
        rank: PropTypes.bool.isRequired
    }

    selectItem = (song, index) => {
        this.props.selectItem && this.props.selectItem(song, index)
    }
    // 拼接歌曲的歌手和专辑
    getDesc = (song) => {
        return `${song.singer} - ${song.album}`
    }
    // 排行榜样式
    getRankCls = (index) => {
        if (index <= 2) {
            return `icon icon${index}`
        } else {
            return 'text'
        }
    }
    // 排行榜数字
    getRankText = (index) => {
        if (index > 2) {
            return index + 1
        }
    }

    render() {
        const { songs, rank } = this.props;
        return (
            <div className="song-list">
                <ul>
                    {songs.map((song, index) => (
                        <li className="item" key={song.id} onClick={() => this.selectItem(song, index)}>
                            {rank && 
                            <div className="rank-num">
                                <span className={this.getRankCls(index)}>{this.getRankText(index)}</span>
                            </div>
                            }
                            <div className="content">
                                <h2 className="name">{song.name}</h2>
                                <p className="desc">{this.getDesc(song)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default SongList;