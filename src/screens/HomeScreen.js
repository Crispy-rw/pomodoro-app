import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    Pressable,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';;

import { incrementRound, setMode } from '../redux/timerSlice';
import { formatTime } from '../utils/helpers';
import {
    CONFIRM,
    LONG_BREAK,
    POMODORO,
    SHORT_BREAK,
    START,
    STOP,
    TIME_FOR_A_BREAK,
    TIME_TO_FOCUS,
} from '../utils/constants';
import useCountdown from '../utils/useCountdown';
import { player } from '../utils/index';

const AsyncAlert = async () =>
    new Promise(resolve => {
        Alert.alert('Are You Sure', CONFIRM, [
            {
                text: 'Cancel',
                onPress: () => resolve(false),
                style: 'cancel',
            },
            {
                text: 'ok',
                onPress: () => {
                    resolve(true);
                },
            },
        ]);
    });

const PrimaryButton = ({ active, onClick, color, mode }) => {
    const titlebackgroundColor = () => {
        if (mode == 'pomodoro') {
            return '#be5551';
        }
        else if (mode == 'short_break') {
            return '#4c8385'
        }
        else if (mode == 'long_break') {
            return '#497697'
        }
    }
    return (
        <Pressable
            onPress={onClick}
            style={{
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: wp(40),
                height: hp(8),
                alignSelf: 'center',
            }}>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: '900',
                    color: titlebackgroundColor(),
                }}>
                {active ? STOP : START}
            </Text>
        </Pressable>
    );;
};


const SecondaryButton = ({ children, active, onClick, mode }) => {

    const titlebackgroundColor = () => {
        if (mode == 'pomodoro') {
            return '#be5551';
        }
        else if (mode == 'short_break') {
            return '#4c8385'
        }
        else if (mode == 'long_break') {
            return '#497697'
        }
    }

    return (
        <Text onPress={onClick} style={[styles.tab, active && { backgroundColor: titlebackgroundColor() }]}>
            {children}
        </Text>
    );;
};;

const buttonSound = player({
    asset: require('../assets/button-press.wav'),
    volume: 0.5,
});

const tickingAudio = player({
    loop: true,
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
        autoBreaks,
    } = useSelector(state => state.timer);

    const { ticking, start, stop, reset, timeLeft, progress } = useCountdown({
        minutes: modes[mode].time,
        onStart: () => {
            if (mode === POMODORO) {
                tickingAudio.play();
            }
        },
        onStop: () => {
            if (mode === POMODORO) {
                tickingAudio.stop();
            }
        },
        onComplete: () => {
            next();
            if (mode === POMODORO) {
                tickingAudio.stop();
            }
            alarmAudio.play();
        },
    });

    const jumpTo = useCallback(
        id => {
            reset();
            dispatch(setMode(id));
        },
        [dispatch, reset],
    );

    useEffect(() => {
        tickingAudio.stop();
        tickingAudio.setAudio(tickingSound);
        if (ticking && mode === POMODORO) {
            tickingAudio.play();
        }
    }, [mode, ticking, tickingSound]);

    useEffect(() => {
        alarmAudio.setAudio(alarmSound);
    }, [alarmSound]);

    useEffect(() => {
        tickingAudio.setVolume(tickingVolume);
    }, [tickingVolume]);

    useEffect(() => {
        alarmAudio.setVolume(alarmVolume);
    }, [alarmVolume]);

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
        async cb => {
            let allowed = true;
            if (ticking) {
                stop();
                allowed = await AsyncAlert();
                start();
            }
            if (allowed) {
                cb();
            }
        },
        [start, stop, ticking],
    );

    const confirmNext = useCallback(() => {
        confirmAction(next);
    }, [confirmAction, next]);

    const confirmJump = useCallback(
        id => {
            confirmAction(() => jumpTo(id));
        },
        [confirmAction, jumpTo],
    );

    const toggleTimer = useCallback(() => {
        buttonSound.play();
        if (ticking) {
            stop();
        } else {
            start();
        }
    }, [start, stop, ticking]);

    const backgroundColor = () => {
        if (mode == 'pomodoro') {
            return '#db524d';
        }
        else if (mode == 'short_break') {
            return '#468e91'
        }
        else if (mode == 'long_break') {
            return '#437ea8'
        }
    }

    const containerBackgroundColor = () => {
        if (mode == 'pomodoro') {
            return '#df645f';
        }
        else if (mode == 'short_break') {
            return '#599a9c'
        }
        else if (mode == 'long_break') {
            return '#568bb1'
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor() }]}>
            <View style={styles.header}>
                <Text style={[styles.headerText]}>Pomodoro</Text>
            </View>
            <View style={[styles.card, { backgroundColor: containerBackgroundColor() }]}>
                <View style={styles.tabs}>
                    {Object.values(modes).map(({ id, label }) => (
                        <SecondaryButton
                            mode={mode}
                            key={id}
                            active={id === mode}
                            id={id}
                            onClick={() => confirmJump(id)}>
                            {label}
                        </SecondaryButton>
                    ))}
                </View>
                <View style={styles.timer}>
                    <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                </View>
                <PrimaryButton active={ticking} onClick={toggleTimer} mode={mode} />
                {!ticking && (
                    <View
                        style={{
                            height: hp(1),
                            width: wp(40),
                            backgroundColor: '#ebebeb',
                            alignSelf: 'center',
                        }}></View>
                )}
                <Text
                    style={{
                        color: 'white',
                        paddingTop: hp(2),
                        alignSelf: 'center',
                    }}>
                    {mode === POMODORO ? TIME_TO_FOCUS : TIME_FOR_A_BREAK}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#db524d',
        flex: 1,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff',
        marginVertical: 20
    },
    card: {
        height: '40%',
        width: '100%',
        backgroundColor: '#df645f',
        padding: '3%',
    },
    tabs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    tab: {
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        borderRadius: 5,
        color: 'white',
        fontWeight: '700',
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
    activeTab: {
        backgroundColor: '#be5551',
    },
});

export default HomeScreen;
