import { connect } from 'react-redux';

export const playListHOC = (WrappedComponent) => {
    class PlayListHOC extends WrappedComponent {
        
        handlePlayList = () => {
            const bottom = this.props.playList.length > 0 ? '60px' : ''
            this.listDOM.style.bottom = bottom;
        }
        
        render() {
            return super.render()
        }
    }

    PlayListHOC.displayName = `PlayListHOC(${getDisplayName(WrappedComponent)})`

    const mapStateToProps = (state) => {
        return {
            playList: state.playList
        }
    }

    return connect(mapStateToProps)(PlayListHOC)
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default playListHOC