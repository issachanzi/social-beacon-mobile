export function absoluteTime(date) {
    if (date === null) {
        return 'Now';
    } else {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours < 12 ? 'am' : 'pm';

        hours = hours % 12;
        if (hours === 0) {
            hours = 12;
        }

        if (minutes === 0) {
            minutes = '00';
        } else if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return hours + ':' + minutes + ampm;
    }
}

export function relativeTime(date) {
    if (date === null) {
        return '(ASAP)';
    }

    const relativeMillis = date.getTime() - Date.now();

    const relativeMinutes = Math.floor(relativeMillis / 60 / 1000);
    const relativeHours = Math.floor(relativeMinutes / 60);

    const hoursPlural = relativeHours === 1 ? "hour" : "hours";
    const minutesPlural = relativeMinutes === 1 ? "minute" : "minutes";

    const hoursPart = relativeHours + " " + hoursPlural;
    const minutesPart = relativeMinutes % 60 + " " + minutesPlural;

    if (relativeMinutes <= 0) {
        return "(right now!)";
    } else if (relativeHours <= 0) {
        return "(in " + minutesPart + ")";
    } else {
        return "(in " + hoursPart + ", " + minutesPart + ")";
    }
}