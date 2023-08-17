const fs = require('fs');
const getFileSizeInMB = path => {
    var stats = fs.statSync(path);
    var fileSizeInBytes = stats.size;
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes.toFixed(2);
};

module.exports = {
    getFileSizeInMB,
};
