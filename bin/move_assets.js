#! /usr/bin/env node

const inquirer = require('inquirer');
const vfs = require('vinyl-fs');
const fs = require('fs');

const questions = [{
  name: 'unbundleOpt',
  message: 'Looks like you\'ve just installed chartwerk-editor. Would you like to move chartwerk-editor\'s bundled assets to your development directory using one of these schemes?',
  type: 'list',
  choices: [{
    name: 'Django staticapp (see https://github.com/The-Politico/generator-politico-django)',
    value: 'django',
  }, {
    name: 'Root dist/ directory',
    value: 'dist',
  }, {
    name: 'No, don\'t do anything.',
    value: 'kill',
  },
  ],
}];

if (!fs.existsSync('./installed')) {
  inquirer.prompt(questions).then((answers) => {
    if (answers.unbundleOpt === 'django') {
      vfs.src('./dist/js/**/*.js').pipe(vfs.dest('./../../../static/chartwerk/js'));
      vfs.src('./dist/**/*.json').pipe(vfs.dest('./../../../static/chartwerk/js'));
      vfs.src('./dist/css/**/*.css').pipe(vfs.dest('./../../../static/chartwerk/css'));
      vfs.src('./dist/img/**/*').pipe(vfs.dest('./../../../static/chartwerk/img'));
      vfs.src('./dist/fonts/**/*').pipe(vfs.dest('./../../../static/chartwerk/fonts'));
      vfs.src(['./src/templates/**/*.html', '!./**/index.html'])
        .pipe(vfs.dest('./../../../templates/chartwerk'));
    } else if (answers.unbundleOpt === 'dist') {
      vfs.src('./dist/**/*').pipe(vfs.dest('./../../dist/'));
    }
  });

  fs.writeFile('./installed', '', (err) => {
    if (err) return console.log(err);
    return null;
  });
}
