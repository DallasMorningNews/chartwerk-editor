const gulp = require('gulp');
const jsonServer = require('gulp-json-srv');

const server = jsonServer.create({
  port: 25252,
  id: 'slug',
  baseUrl: '/api',
});

module.exports = () => {
  gulp.watch(['./dist/test-api.json'], ['api']);
  return gulp.src('./dist/test-api.json')
      .pipe(server.pipe());
};
