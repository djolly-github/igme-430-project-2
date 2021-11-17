const gulp = require('gulp');
const cache = require('gulp-cached');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');

const copyAssets = (done) => {
  gulp.src('./assets/*')
    .pipe(gulp.dest('./hosted/assets/'));
  done();
};

const buildSass = (done) => {
  gulp.src('./scss/*')
    .pipe(cache('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./hosted/'));
  done();
};

const buildJs = (done) => {
  gulp.src(['./client/**/*.js', './client/**/*.jsx'])
    .pipe(cache('babel'))
    .pipe(babel({
      presets: ['@babel/preset-env', '@babel/preset-react']
    }))
    .pipe(gulp.dest('./hosted/'));
  done();
};

const runLint = (done) => {
  gulp.src(['./server/*.js'])
    .pipe(eslint({fix: true}))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
  done();
};

const watch = () => {
  gulp.watch('./assets/*', copyAssets);
  gulp.watch('./scss/*', buildSass);
  gulp.watch(['./client/**/*.js', './client/**/*.jsx'], buildJs);
  nodemon({
    script: './server/app.js',
    ignore: ['client/', 'node_modules/'],
    ext: 'js html css'
  });
};

module.exports.build = gulp.parallel(copyAssets, buildSass, buildJs, runLint);
module.exports.watch = watch;
