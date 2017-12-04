export const shuffle = (arr) => {
    let _arr = arr.slice();
    for (let i = 0, len = _arr.length; i < len; i++) {
        let j = getRandomInt(0, i);
        let temp = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = temp;
    }
    return _arr;
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const findIndex = (list, song) => {
	return list.findIndex((item) => {
		return item.id === song.id;
	});
}