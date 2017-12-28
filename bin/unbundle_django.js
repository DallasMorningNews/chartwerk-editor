const vfs = require('vinyl-fs');
const path = require('path');

// Change working directory to lib
process.chdir(path.join(__dirname, '/../'));

vfs.src('./dist/js/**/*').pipe(vfs.dest('./../../../static/chartwerk/js'));
vfs.src('./dist/css/**/*').pipe(vfs.dest('./../../../static/chartwerk/css'));
vfs.src('./dist/img/**/*').pipe(vfs.dest('./../../../static/chartwerk/img'));
vfs.src('./dist/fonts/**/*').pipe(vfs.dest('./../../../static/chartwerk/fonts'));
vfs.src(['./src/templates/**/*.html', '!./**/index.html', '!./**/base.html'])
  .pipe(vfs.dest('./../../../templates/chartwerk'));
