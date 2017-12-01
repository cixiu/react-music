export default class Song {
    constructor({id, mid, name, singer, album, duration, url, image}) {
        this.id = id;
        this.mid = mid;
        this.name = name;
        this.singer = singer;
        this.album = album;
        this.duration = duration;
        this.url = url;
        this.image = image;
    }
}

export const createSong = (musicData) => {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        name: musicData.songname,
        singer: splitSinger(musicData.singer),
        album: musicData.albumname,
        duration: musicData.interval,
        url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
    })
}

const splitSinger = (singer) => {
    let ret = [];
    if (!singer) {
        return ''
    }
    singer.forEach(item => {
        ret.push(item.name);
    });
    return ret.join('/');
}
// 将付费歌曲过滤掉
export function isValidMusic(musicData) {
    return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}