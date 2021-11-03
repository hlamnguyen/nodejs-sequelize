module.exports.parseInt = (input, defaultValue) => {
    let result = defaultValue;
    if (input) {
        try {
            result = parseInt(input);
            if (isNaN(result)) result = defaultValue;
        } catch (error) {
            console.log.error(`Error parsing INT '${input}'`, error);
        }
    }
    return isNaN(result) ? defaultValue : result;
}

module.exports.removeAllSpaceString = (str) => {
    return str.replace(/\s+/g, '');
}
