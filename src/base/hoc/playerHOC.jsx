import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';
import { setCurrentIndex, setPlayMode, setPlayList } from 'store/actions';
import {  setFavoriteList, deleteOneFavorite  } from 'store/dispatchMultiple';

const playerHOC = (WrappedComponent) => {
    class PlayerHOC extends WrappedComponent {
        // 播放模式的Icon
        IconMode = () => {
            if (this.props.mode === playMode.sequence) {
                return 'icon-sequence'
            } else if (this.props.mode === playMode.loop) {
                return 'icon-loop'
            } else {
                return 'icon-random'
            }
        }
        // 改变播放模式
        changePlayMode = () => {
            const mode = (this.props.mode + 1) % 3;
            this.props.setPlayMode(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.props.sequenceList);
            } else {
                list = this.props.sequenceList;
            }
            this.resetCurrentIndex(list);
            this.props.setPlayList(list);
        }
        // 重置当前歌曲的索引
        resetCurrentIndex = (list) => {
            let index = list.findIndex(item => {
                return item.id === this.props.currentSong.id
            })
            this.props.setCurrentIndex(index);
        }
        // 收藏喜欢的Icon
        getFavoriteIcon = (song) => {
            if (this.isFavorite(song)) {
                return 'icon icon-favorite'
            }
            return 'icon icon-not-favorite'
        }
        // 改变喜欢的状态
        toggleFavorite = (song, e) => {
            e.stopPropagation();
            if (this.isFavorite(song)) {
                this.props.deleteFavorite(song);
            } else {
                this.props.saveFavorite(song);
            }
        }
        isFavorite = (song) => {
            const index = this.props.favoriteList.findIndex(item => {
                return item.id === song.id
            })
            return index > -1;
        }
        
        render() {
            return super.render()
        }
    }

    PlayerHOC.displayName = `PlayerHOC(${getDisplayName(WrappedComponent)})`

    const getPlayList = state => state.playList;
    const getCurrentIndex = state => state.currentIndex;
    
    const getCurrentSong = createSelector(
        [getPlayList, getCurrentIndex],
        (playList, currentIndex) => {
            return playList[currentIndex]
        }
    )

    const mapStateToProps = (state) => {
        const { sequenceList, currentIndex, playList, mode, favoriteList } = state;
        return {
            sequenceList,
            playList,
            currentIndex,
            currentSong: getCurrentSong(state) || {},
            mode,
            favoriteList,
        }
    }

    const mapDispatchToProps = (dispatch) => {
        return {
            setCurrentIndex: (index) => {
                dispatch(setCurrentIndex(index))
            },
            setPlayMode: (mode) => {
                dispatch(setPlayMode(mode))
            },
            setPlayList: (list) => {
                dispatch(setPlayList(list))
            },
            saveFavorite: (song) => {
                setFavoriteList(dispatch, song);
            },
            deleteFavorite: (song) => {
                deleteOneFavorite(dispatch, song);
            }
        }
    }

    return connect(
        mapStateToProps,
        mapDispatchToProps,
        null,
        {
            withRef: true
        }
    )(PlayerHOC)
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default playerHOC