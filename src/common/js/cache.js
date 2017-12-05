import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

// 保存搜索历史进localStorage
export const saveSearch = (query) => {
    let searches = storage.get(SEARCH_KEY, []);
    insertArray(searches, query, (item) => {
        return item === query;
    }, SEARCH_MAX_LENGTH);
    storage.set(SEARCH_KEY, searches);
    return searches;
}

// 读取localStorage
export const loadSearch = () => {
    return storage.get(SEARCH_KEY, []);
}

// 删除一条搜索历史记录
export const deleteSearch = (query) => {
    let searches = storage.get(SEARCH_KEY, []);
    deleteFromArray(searches, (item) => {
        return item === query;
    })
    storage.set(SEARCH_KEY, searches);
    return searches;
}

// 清空搜索历史和本地缓存
export const clearSearch = () => {
    storage.remove(SEARCH_KEY);
    return [];
}

const insertArray = (arr, val, compare, maxLen) => {
    const index = arr.findIndex(compare);
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1);
    }
    arr.unshift(val);
    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }
}

const deleteFromArray = (arr, compare) => {
    const index = arr.findIndex(compare);
    if (index > -1) {
        arr.splice(index, 1);
    }
}