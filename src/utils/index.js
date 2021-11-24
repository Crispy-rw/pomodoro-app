import Sound from 'react-native-sound'

export function player({ asset, volume = 0.5, loop = false }) {

    let audio;
    if (asset) {
        audio = new Sound(asset, Sound.MAIN_BUNDLE);
        audio?.setVolume(volume);
    }

    if (loop && audio) {
        audio?.setNumberOfLoops(-1)
    }

    const play = () => {
        let currentTime;

        audio?.getCurrentTime((sec, play) => {
            currentTime = sec ?? 0;
        })
        if (!audio?.isPlaying() || !currentTime) {
            audio?.play()
        }
    };

    const stop = () => {
        audio?.pause();
    };

    const setVolume = (value) => (audio?.setVolume(value / 100));

    const setAudio = (src) => {
        audio = new Sound(src, Sound.MAIN_BUNDLE)
        audio?.setVolume(0.5)
        audio?.play()
    };

    return {
        play,
        stop,
        setVolume,
        setAudio,
    };
}
