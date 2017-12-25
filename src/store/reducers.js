import { combineReducers } from 'redux';
import * as types from './actionTypes';
import { playMode } from 'common/js/config';

// 单个歌手信息
const setSinger = (state = {}, action) => {
    switch (action.type) {
        case types.SET_SINGER:
            return action.singer
        default:
            return state
    }
}

// 播放状态
const setPlayStatus = (state = false, action) => {
    switch (action.type) {
        case types.SET_PLAY_STATUS:
            return action.flag
        default:
            return state
    }
}

// 全屏
const setFullScreen = (state = false, action) => {
    switch (action.type) {
        case types.SET_FULL_SCREEN:
            return action.flag
        default:
            return state
    }
}

// 播放列表
const setPlayList = (state = [], action) => {
    switch (action.type) {
        case types.SET_PLAY_LIST:
            return action.list
        default:
            return state
    }
}

// 顺序播放列表
const setSequenceList = (state = [], action) => {
    switch (action.type) {
        case types.SET_SEQUENCE_LIST:
            return action.list
        default:
            return state
    }
}

// 当前播放的歌曲
// const setCurrentSong = (state = {}, action) => {
//     switch(action.type) {
//         case types.SET_CURRENTSONG:
//             return {
//                 ...action.song
//             }
//         default:
//             return state
//     }
// }

// 播放模式
const setPlayMode = (state = playMode.sequence, action) => {
    switch (action.type) {
        case types.SET_PLAY_MODE:
            return action.mode
        default:
            return state
    }
}

// 当前播放歌曲的索引
const setCurrentIndex = (state = -1, action) => {
    switch (action.type) {
        case types.SET_CURRENT_INDEX:
            return action.index
        default:
            return state
    }
}

// 推荐歌单
const setDisc = (state = {}, action) => {
    switch (action.type) {
        case types.SET_DISC:
            return action.disc
        default:
            return state
    }
}

// 排行榜
const setTopList = (state = {}, action) => {
    switch (action.type) {
        case types.SET_TOP_LIST:
            return action.topList
        default:
            return state
    }
}

// 搜索历史列表
const setSearchHistory = (state = [], action) => {
    switch(action.type) {
        case types.SET_SEARCH_HISTORY:
            return action.history
        default:
            return state
    }
}

// 播放历史列表
const setPlayHistory = (state = [], action) => {
    switch(action.type) {
        case types.SET_PLAY_HISTORY:
            return action.history
        default:
            return state
    }
}

// 收藏喜欢的列表
const setFavoriteList = (state = [], action) => {
    switch(action.type) {
        case types.SET_FAVORITE_LIST:
            return action.list
        default:
            return state
    }
}

const rootReducers = combineReducers({
    singer: setSinger,
    playing: setPlayStatus,
    fullScreen: setFullScreen,
    playList: setPlayList,
    sequenceList: setSequenceList,
    // currentSong: setCurrentSong,
    mode: setPlayMode,
    currentIndex: setCurrentIndex,
    disc: setDisc,
    topList: setTopList,
    searchHistory: setSearchHistory,
    playHistory: setPlayHistory,
    favoriteList: setFavoriteList
})

export default rootReducers;

