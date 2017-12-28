const gulp = require('./gulp')([
  'api',
  'production',
  'dev',
  'nunjucks',
]);

gulp.task('watch', () => {
  gulp.watch('src/templates/**/*.html', ['nunjucks']);
});

gulp.task('build', ['nunjucks', 'production']);
gulp.task('default', ['nunjucks', 'watch', 'dev', 'api']);
