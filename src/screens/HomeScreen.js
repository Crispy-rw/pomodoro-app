import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { incrementRound, setMode } from "../redux/timerSlice";
import {
    CONFIRM,
    LONG_BREAK,
    POMODORO,
    SHORT_BREAK,
    START,
    STOP,
    TIME_FOR_A_BREAK,
    TIME_TO_FOCUS,
} from "../utils/constants";
import useCountdown from "../utils/useCountdown";
import { player } from "../utils/index";


const PrimaryButton = ({ active, onClick, color }) => {
    return (
        <TouchableOpacity style={styles.primaryBtn}>
            {active ? STOP : START}
        </TouchableOpacity>
    )
}

const NextButton = (props) => {
    return (
        <TouchableOpacity></TouchableOpacity>
    )
}


const buttonSound = player({
    // asset: "sounds/button-press.wav",
    // volume: 0.5,
});

const tickingAudio = player({
    // loop: true,
});

const alarmAudio = player({});


function HomeScreen(props) {

    const dispatch = useDispatch();
    const {
        mode,
        round,
        modes,
        tickingSound,
        tickingVolume,
        alarmSound,
        alarmVolume,
    } = useSelector((state) => state.timer);


    const { ticking, start, stop, reset, timeLeft, progress } = useCountdown({
        minutes: modes[mode].time,
        onStart: () => {
            updateFavicon(mode);
            if (mode === POMODORO) {
                // tickingAudio.play();
            }
        },
        onStop: () => {
            updateFavicon();
            if (mode === POMODORO) {
                // tickingAudio.stop();
            }
        },
        onComplete: () => {
            next();
            if (mode === POMODORO) {
                // tickingAudio.stop();
            }
            // alarmAudio.play();
        },
    });

    useEffect(() => {
        updateTitle(timeLeft, mode);
    }, [mode, timeLeft]);

    const jumpTo = useCallback(
        (id) => {
            reset();
            updateFavicon(id);
            dispatch(setMode(id));
        },
        [dispatch, reset]
    );

    // useEffect(() => {
    //     tickingAudio.stop();
    //     tickingAudio.setAudio(tickingSound);
    //     if (ticking && mode === POMODORO) {
    //         tickingAudio.play();
    //     }
    // }, [mode, ticking, tickingSound]);

    // useEffect(() => {
    //     alarmAudio.setAudio(alarmSound);
    // }, [alarmSound]);

    // useEffect(() => {
    //     tickingAudio.setVolume(tickingVolume);
    // }, [tickingVolume]);

    // useEffect(() => {
    //     alarmAudio.setVolume(alarmVolume);
    // }, [alarmVolume]);

    const next = useCallback(() => {
        switch (mode) {
            case LONG_BREAK:
            case SHORT_BREAK:
                jumpTo(POMODORO);
                break;
            default:
                jumpTo(SHORT_BREAK);
                dispatch(incrementRound());
                break;
        }
    }, [dispatch, jumpTo, mode]);

    const confirmAction = useCallback(
        (cb) => {
            let allowed = true;
            if (ticking) {
                stop();
                allowed = confirm(CONFIRM);
                start();
            }

            if (allowed) {
                cb();
            }
        },
        [start, stop, ticking]
    );

    const confirmNext = useCallback(() => {
        confirmAction(next);
    }, [confirmAction, next]);

    const confirmJump = useCallback(
        (id) => {
            confirmAction(() => jumpTo(id));
        },
        [confirmAction, jumpTo]
    );

    const toggleTimer = useCallback(() => {
        buttonSound.play();
        if (ticking) {
            stop();
        } else {
            start();
        }
    }, [start, stop, ticking]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Pomodoro</Text>
            </View>
            <View style={styles.card}>
                <View style={styles.tabs}>
                    {Object.values(modes).map(({ id, label }) => (
                        <SecondaryButton
                            key={id}
                            active={id === mode}
                            id={id}
                            onClick={() => confirmJump(id)}
                        >
                            {label}
                        </SecondaryButton>
                    ))}
                    <Text style={[styles.tab]}>Pomodoro</Text>
                    <Text style={styles.tab}>Short Break</Text>
                    <Text style={styles.tab}>Long Break</Text>
                </View>
                <View style={styles.timer}>
                    <Text style={styles.timerText}>25:00</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#db524d',
        flex: 1,
    },
    headerText: {},
    card: {
        height: '40%',
        width: '100%',
        backgroundColor: '#df645f',
        padding: '3%'
    },
    tabs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    tab: {
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        backgroundColor: '#be5551',
        borderRadius: 5,
        color: "white",
        fontWeight: '700'
    },
    timerText: {
        fontSize: 130,
        color: 'white',
    },
    timer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryBtn: {
        // padding: 0 0.75'rem,
        fontSize: 1.375,
        height: 3.4375,
        fontWeight: 600,
        width: 12.5,
        backgroundColor: 'white',
        textTransform: 'uppercase',

    }
})

export default HomeScreen;
