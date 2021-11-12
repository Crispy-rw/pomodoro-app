import Sound from 'react-native-sound'

export function player({ asset, volume = 0.5, loop = false }) {

    let audio = new Sound(asset);
    audio.setVolume(volume);

    if (loop) {
        audio.addEventListener(
            "ended",
            () => {
                audio.setCurrentTime(0)
                audio.play();
            },
            false
        );
    }

    const play = () => {
        if (!audio.isPlaying || !audio.getCurrentTime()) {
            audio.play().catch(() => { });
        }
    };

    const stop = () => {
        audio.pause();
    };

    const setVolume = (value) => (audio.setVolume(value / 100));

    const setAudio = (src) => {
        audio = Sound(src);
    };

    return {
        play,
        stop,
        setVolume,
        setAudio,
    };
}
