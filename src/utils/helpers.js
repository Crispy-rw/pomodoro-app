import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {
    LONG_BREAK,
    POMODORO,
    SHORT_BREAK,
    TIME_FOR_A_BREAK,
    TIME_TO_FOCUS,
} from "./constants";

dayjs.extend(duration);

export function formatTime(time) {
    return dayjs.duration(time, "seconds").format("mm:ss");
}

export function updateTitle(time, mode) {
}
function getFaviconEl() {
}

export function updateFavicon(mode) { }
