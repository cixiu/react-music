import { connect } from 'react-redux';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/util';
import { setCurrentIndex, setPlayMode, setPlayList } from 'store/actions';

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
        
        render() {
            return super.render()
        }
    }

    PlayerHOC.displayName = `PlayerHOC(${getDisplayName(WrappedComponent)})`

    const mapStateToProps = (state) => {
        const { sequenceList, currentIndex, playList, mode } = state;
        const currentSong = playList[currentIndex];
        return {
            sequenceList,
            playList,
            currentIndex,
            currentSong,
            mode
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