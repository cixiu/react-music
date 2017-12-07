// 用于处理多个dispatch 或者 可以复用的
import * as types from 'store/actions';
import { playMode } from 'common/js/config';
import { shuffle, findIndex } from 'common/js/util.js';
import { saveSearch, deleteSearch, clearSearch, savePlayed } from 'common/js/cache';

// 选择播放歌曲
export const selectPlay = (dispatch, list, index, mode) => {
    if (mode === playMode.random) {
        let randomList = shuffle(list);
        dispatch(types.setPlayList(randomList));
        index = findIndex(randomList, list[index])
    } else {
        dispatch(types.setPlayList(list))
    }
    dispatch(types.setPlayStatus(true))
    dispatch(types.setSequenceList(list))
    dispatch(types.setCurrentIndex(index))
}

// 随机播放全部
export const playRandom = (dispatch, list) => {
    dispatch(types.setPlayMode(playMode.random))
    dispatch(types.setPlayStatus(true))
    let randomList = shuffle(list);
    dispatch(types.setPlayList(randomList))
    dispatch(types.setSequenceList(list))
    dispatch(types.setCurrentIndex(0))
}

// 插入一首歌
export const insertSong = (dispatch, {song, playList, sequenceList, currentIndex}) => {
    playList = playList.slice();
    sequenceList = sequenceList.slice();
    // 记录当前歌曲
    let currentSong = playList[currentIndex];
    // 查询当前播发的歌曲列表是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playList, song);
    // 因为时插入歌曲 所以索引+1
    currentIndex++;
    // 插入这首歌到当前位置
    playList.splice(currentIndex, 0, song);
    // 如果播放列表已经包含了这首要插入的歌
    if (fpIndex > -1) {
        // 当要插入的这首歌的序号大于原播放列表里的序号时 则删除掉原来的歌曲
        if (currentIndex > fpIndex) {
            playList.splice(fpIndex, 1);
            currentIndex--;
        } else {  // 当要插入的这首歌的序号小于原播放列表里的序号时 则删除掉原来的歌曲
            playList.splice(fpIndex + 1, 1);
        }
    }

    // 记录当前播放歌曲在顺序播放列表中的位置，并且在这个位置之后需要插入待插入的歌曲
    let currentSIndex = findIndex(sequenceList, currentSong) + 1;
    // 查询顺序播放歌曲列表是否有待插入的歌曲并返回其索引
    let fsIndex = findIndex(sequenceList, song);
    // 在当前顺序播放列表中的当前播放歌曲之后插入待插入的歌曲
    sequenceList.splice(currentSIndex, 0, song);
    // 如果顺序播放列表已经包含了这首要插入的歌
    if (fsIndex > -1) {
        // 当要插入的这首歌的序号大于原顺序播放列表里的序号时 则删除掉原来的歌曲
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1);
        } else {  // 当要插入的这首歌的序号小于原顺序播放列表里的序号时 则删除掉原来的歌曲
            sequenceList.splice(fsIndex + 1, 1);
        }
    }
    dispatch(types.setPlayList(playList));
    dispatch(types.setSequenceList(sequenceList));
    dispatch(types.setCurrentIndex(currentIndex));
    dispatch(types.setPlayStatus(true));
}

// 存储搜索历史到localStorage中，并存入redux中
export const saveSearchHistory = (dispatch, query) => {
    const searchHistory = saveSearch(query);
    dispatch(types.setSearchHistory(searchHistory));
}

// 删除一条搜索历史
export const deleteSearchHistory = (dispatch, query) => {
    const searchHistory = deleteSearch(query);
    dispatch(types.setSearchHistory(searchHistory));
}

// 清空搜索历史记录
export const clearSearchHistory = (dispatch) => {
    const searchHistory = clearSearch();
    dispatch(types.setSearchHistory(searchHistory));
}

// 删除一首歌
export const deleteSong = (dispatch, {song, playList, sequenceList, currentIndex}) => {
    playList = playList.slice();
    sequenceList = sequenceList.slice();
    // 在播放列表中找到要删除的那首歌的索引
    let pIndex = findIndex(playList, song);
    // 删除掉播放列表中的那首歌
    playList.splice(pIndex, 1);
    // 在顺序播放列表中找到要删除的那首歌的索引
    let sIndex = findIndex(sequenceList, song);
    // 删除掉顺序播放列表的那首歌
    sequenceList.splice(sIndex, 1);
    if (currentIndex > pIndex || currentIndex === playList.length) {
        currentIndex--
    }
    dispatch(types.setPlayList(playList));
    dispatch(types.setSequenceList(sequenceList));
    dispatch(types.setCurrentIndex(currentIndex));
}

// 清空播放列表
export const clearSongList = (dispatch) => {
    dispatch(types.setPlayList([]));
    dispatch(types.setSequenceList([]));
    dispatch(types.setCurrentIndex(-1));
    dispatch(types.setPlayStatus(false));
}

// 播放历史列表
export const savePlayHistory = (dispatch, song) => {
    const playHistory = savePlayed(song);
    dispatch(types.setPlayHistory(playHistory))
}