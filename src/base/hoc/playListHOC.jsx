const playListHOC = (WrappedComponent) => {
    class PlayListHOC extends WrappedComponent {

        handlePlayList = () => {
            const bottom = this.props.playList.length > 0 ? '60px' : ''
            if (this.listDOM) {
                this.listDOM.style.bottom = bottom;
            }
        }
        
        render() {
            return super.render()
        }
    }

    PlayListHOC.displayName = `PlayListHOC(${getDisplayName(WrappedComponent)})`

    return PlayListHOC
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default playListHOC