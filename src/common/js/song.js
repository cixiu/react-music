import { getLyric, getVKey } from 'api/song';
import { ERR_OK } from 'api/config';
// import { getUid } from 'common/js/uid';
import { Base64 } from 'js-base64';

let urlMap = {};

export default class Song {
    constructor({id, mid, mediamid, name, singer, album, duration, url, image}) {
        this.id = id;
        this.mid = mid;
        this.mediamid = mediamid;
        this.name = name;
        this.singer = singer;
        this.album = album;
        this.duration = duration;
        this.image = image;
        this.filename=`C400${this.mediamid}.m4a`;
        // 确保一首歌曲的 id 只对应一个 url
        if (urlMap[this.id]) {
            this.url = urlMap[this.id];
        } else {
            if (url) {
                this.url = url;
                urlMap[this.id] = url;
            } else {
                this._getUrl()
            }
        }
    }

    getLyric = () => {
        if (this.lyric) {
            return Promise.resolve(this.lyric);
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then(res => {
                if (res.code === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric);
                    resolve(this.lyric);
                } else {
                    reject('no lyric');
                }
            })
        })
    }

    _getUrl = () => {
        if (this.url) {
            return
        }
        getVKey(this.mid, this.filename).then(res => {
        if (res.code === ERR_OK) {
            const vkey = res.data.items[0].vkey
            this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=7908462822&uin=0&fromtag=66`
            urlMap[this.id] = this.url
        }
        })
    }
}

export const createSong = (musicData) => {
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        mediamid: musicData.strMediaMid,
        name: musicData.songname,
        singer: splitSinger(musicData.singer),
        album: musicData.albumname,
        duration: musicData.interval,
        // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
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
export const isValidMusic = (musicData) => {
    return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0)
}