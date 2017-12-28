const gulp = require('./gulp')([
  'api',
  'build',
  'dev',
  'nunjucks',
]);

gulp.task('build', ['nunjucks', 'build']);
gulp.task('default', ['nunjucks', 'dev', 'api']);
