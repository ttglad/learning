var Utils = {};

Utils.ArrayShuffle = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

Utils.ArrayRandom = function (array) {
    var index = Math.floor((Math.random() * array.length));
    return array[index];
}

Utils.LogMessage = function (array) {
    var index = Math.floor((Math.random() * array.length));
    return array[index];
}