import xs from 'xstream';

function combineStreams(first$, second$, ...otherStreams) {
    if (!(first$ && second$)) {
        throw  'Combine streams requires an array with at least two streams.';
    }

    const firstSecondCombined$ = xs.combine(first$, second$)
        .map(([firstStreamValue, secondStreamValue]) => {
            if (Array.isArray(firstStreamValue)) {
                return firstStreamValue.concat(secondStreamValue);
            }
            return [firstStreamValue, secondStreamValue];
        });

    if (otherStreams.length <= 0) {
        return firstSecondCombined$
    }

    return combineStreams(firstSecondCombined$, ...otherStreams)
}

module.exports = {
    combineStreams
}