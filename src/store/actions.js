import * as types from './actionTypes';
// import { getVKey } from 'api/song';
// import { ERR_OK } from 'api/config';

export const setSinger = (singer) => ({
    type: types.SET_SINGER,
    singer
})

export const setPlayStatus = (flag) => ({
    type: types.SET_PLAY_STATUS,
    flag
})

export const setFullScreen = (flag) => ({
    type: types.SET_FULL_SCREEN,
    flag
})

export const setPlayList = (list) => ({
    type: types.SET_PLAY_LIST,
    list
})

export const setSequenceList = (list) => ({
    type: types.SET_SEQUENCE_LIST,
    list
})

// export const getCurrentSong = (song, url) => ({
//     type: types.SET_CURRENTSONG,
//     song: {
//         ...song,
//         url: url
//     }
// })

// export const setCurrentSong = index => (dispatch, getState) => {
//     const playList = getState().playList;
//     const currentIndex = getState().currentIndex;
//     const song = playList[currentIndex];
//     return getVKey(song.mid, song.filename).then(res => {
//         if (res.code === ERR_OK) {
//             const vkey = res.data.items[0].vkey;
//             const url = `http://dl.stream.qqmusic.qq.com/${song.filename}?vkey=${vkey}&guid=7908462822&uin=0&fromtag=66`;
//             dispatch(getCurrentSong(song, url));
//         }
//     })
// }

export const setPlayMode = (mode) => ({
    type: types.SET_PLAY_MODE,
    mode
})

export const setCurrentIndex = (index) => ({
    type: types.SET_CURRENT_INDEX,
    index
})

export const setDisc = (disc) => ({
    type: types.SET_DISC,
    disc
})

export const setTopList = (topList) => ({
    type: types.SET_TOP_LIST,
    topList
})

export const setSearchHistory = (history) => ({
    type: types.SET_SEARCH_HISTORY,
    history
})

export const setPlayHistory = (history) => ({
    type: types.SET_PLAY_HISTORY,
    history
})

export const setFavoriteList = (list) => ({
    type: types.SET_FAVORITE_LIST,
    list
})