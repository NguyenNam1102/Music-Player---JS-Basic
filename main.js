// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

/** 
    1. Render songs
    2. Scroll top
    3. Play / pause / seek
    4. CD rotate
    5. Next / prev
    6. Random
    7. Next / Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist')

const app = {

    currenIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1022/016TANDU-SolSilvaLilNVietNam-7098420.mp3?st=MvGmiLNsmAdvIF3MMBtA1g&e=1679407621&download=true",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "https://c1-ex-swe.nixcdn.com/Singer_Audio1/MuaTaDaYeu-TruongSonLuuAnhLoanHongPhuocHuongGiangIdol-2483509.mp3?st=_t9WUjaTM6mt9Y0AanbM7w&e=1679408446&download=true",
            image:
                "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path:
                "https://c1-ex-swe.nixcdn.com/NhacCuaTui2034/KhongAi102-KrisVuTBass-8564484.mp3?st=igFIdgF3Trx3pNbR1e887g&e=1679408508&download=true",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui2026/TinHieuTuTraiTim-Cassano-7664843.mp3?st=LAAYwk_wYngye7eFv5fSCw&e=1679408308&download=true",
            image:
                "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui1010/CoGaiNayLaCuaAi-KrixRushDoanQuocVinhNhiNhi-6926198.mp3?st=RqqO6Rwn0PLHZRwfzU36Hw&e=1679408415&download=true",
            image:
                "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path:
                "https://c1-ex-swe.nixcdn.com/NhacCuaTui889/VoHinhTrongTimEm-Mr.Siro-3828370.mp3?st=UZ2XHZrr7YO4lvh9ogE5Rw&e=1679408550&download=true",
            image:
                "https://filmisongs.xyz/wp-content/uploads/2020/07/Damn-Song-Raftaar-KrNa.jpg"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "https://c1-ex-swe.nixcdn.com/NhacCuaTui922/AnhLaCuaEm-Karik-3786537.mp3?st=kLjth9oui-RU5KT4ISQJeQ&e=1679408708&download=true",
            image:
                "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currenIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },


    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currenIndex]
            }
        })
    },

    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10 second
            iterations: Infinity
        })
        cdThumAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            // console.log(window.scrollY);
            // console.log(document.documentElement.scrollTop);
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop;
            // console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }

        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.oninput = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Xử lý khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            audio.play()
            _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lý lặp lại 1 song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (
                songNode ||
                e.target.closest('.option')
            ) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currenIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào song option
                // if (e.target.closest('.option') {

                // }
            }
        }
    },

    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behaviar: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function () {
        this.currenIndex++
        if (this.currenIndex >= this.songs.length) {
            this.currenIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currenIndex--
        if (this.currenIndex < 0) {
            this.currenIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (!newIndex == this.currenIndex)
        this.currenIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // Gán cấu hình từ config vào UI
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi start
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiển thị trạng thái ban đầu của repeatBtn và randomBtn
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
};

app.start();
