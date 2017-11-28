import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.styl';

class SongList extends Component {
    static defaultProps = {
        songs: []
    }
    static propTypes = {
        songs: PropTypes.array.isRequired
    }

    getDesc = (song) => {
        return `${song.singer} - ${song.album}`
    }

    render() {
        const { songs } = this.props;
        return (
            <div className="song-list">
                <ul>
                    {songs.map((song, index) => (
                        <li className="item" key={song.id}>
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