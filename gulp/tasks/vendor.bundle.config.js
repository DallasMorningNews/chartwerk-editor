module.exports = {
  bundle: {
    'js/vendor': {
      scripts: [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './bower_components/bootstrap-table/dist/bootstrap-table.min.js',
      ],
      options: {
        uglify: false,
        rev: false,
        order: {
          scripts: [
            '**/jquery.min.js',
            '!**/jquery.min.js',
          ],
        },
        watch: {
          scripts: [
            './node_modules/**/*.js',
          ],
        },
      },
    },
    'css/vendor': {
      styles: [
        './node_modules/react-select/dist/react-select.min.css',
        './node_modules/simplemde/dist/simplemde.min.css',
      ],
      options: {
        minCSS: false,
        rev: false,
        watch: {
          styles: [
            './node_modules/**/*.css',
          ],
        },
      },
    },
  },
};
