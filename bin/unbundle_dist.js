const vfs = require('vinyl-fs');
const path = require('path');

// Change working directory to lib
process.chdir(path.join(__dirname, '/../'));

vfs.src('./dist/**/*').pipe(vfs.dest('./../../dist/'));
