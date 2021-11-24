import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { Picker } from '@react-native-picker/picker';

import {
    setAlarmRepeat,
    setAlarmSound,
    setAlarmVolume,
    setLongBreakInterval,
    setTickingSound,
    setTickingVolume,
    toggleAutoBreaks,
    toggleAutoPomodoros,
    updateModeTime,
} from "../redux/timerSlice.js";

import {
    BELL_SOUND,
    DIGITAL_SOUND,
    FAST_TICKING,
    NO_SOUND,
    SLOW_TICKING,
} from "../utils/constants";

const alarmSounds = [
    {
        value: BELL_SOUND,
        label: "Bell",
    },
    {
        value: DIGITAL_SOUND,
        label: "Digital",
    },
];

const tickingSounds = [
    {
        value: NO_SOUND,
        label: "None",
    },
    {
        value: FAST_TICKING,
        label: "Ticking Fast",
    },
    {
        value: SLOW_TICKING,
        label: "Ticking Slow",
    },
];



function SettingsScreen(props) {

    const {
        modes,
    } = useSelector((state) => state.timer);
    const dispatch = useDispatch();


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Timer Settings</Text>
            <Text style={styles.subtitle}>Time(minutes)</Text>
            {Object.values(modes).map(({ id, label, time }, idx) => (
                <TextInput
                    label={label}
                    value={time?.toString()}
                    onChangeText={text => {
                        dispatch(
                            updateModeTime({ mode: id, time: text?.toString() })
                        );
                    }}
                    key={idx}
                    keyboardType="numeric"

                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp(90),
        alignSelf: 'center'
    },
    title: {
        marginTop: hp(2),
        fontSize: 30
    },
    subtitle: {
        marginTop: hp(2),
        fontSize: 20
    }
})

export default SettingsScreen;
