"use strict";

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`gulp-csso`);
const server = require(`browser-sync`).create();
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const svgstore = require(`gulp-svgstore`)
const posthtml = require(`gulp-posthtml`);
const include = require(`posthtml-include`);
const del = require(`del`);
const babel = require(`gulp-babel`);
const concat = require(`gulp-concat`);
const uglify = require(`gulp-uglify`);

gulp.task(`css`, () => {
  return gulp.src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest(`build/css`))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css`))
    .pipe(server.stream());
});

gulp.task(`server`, () => {
  server.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`source/sass/**/*.{scss,sass}`, gulp.series(`css`));
  gulp.watch(`source/img/icon-*.svg`, gulp.series(`sprite`, `html`, `refresh`));
  gulp.watch(`source/*.html`, gulp.series(`html`, `refresh`));
  gulp.watch(`source/js/**/*.js`, gulp.series(`js`, `refresh`));
});

gulp.task(`refresh`, (done) => {
  server.reload();
  done();
});

gulp.task(`images`, () => {
  return gulp.src(`source/img/**/*.{png,jpg,svg}`)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(`source/img`));
});

gulp.task(`webp`, () => {
  return gulp.src(`source/img/**/*.{png,jpg}`)
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(`source/img`));
});

gulp.task(`sprite`, () => {
  return gulp.src(`source/img/{icon-*,logo*}.svg`)
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename(`sprite_auto.svg`))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`html`, () => {
  return gulp.src(`source/*.html`)
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest(`build`));
});

gulp.task(`copy`, () => {
  return gulp.src([
    `source/fonts/**/*.{woff,woff2,ttf}`,
    `source/img/**`,
    `source//*.ico`
  ], {
    base: `source`
  })
  .pipe(gulp.dest(`build`));
});

gulp.task(`clean`, () => {
  return del(`build`);
});

gulp.task(`js`, () => {
  return gulp.src([
    `source/js/script.js`
  ], {
    base: `source`
  })
  .pipe(sourcemap.init())
  .pipe(babel({
    presets: [`@babel/preset-env`]
  }))
  .pipe(concat(`bundle.js`))
  .pipe(gulp.dest(`build/js`))
  .pipe(uglify())
  .pipe(rename(`bundle.min.js`))
  .pipe(sourcemap.write(`.`))
  .pipe(gulp.dest(`build/js`));
});

gulp.task(`build`, gulp.series(`clean`, `copy`, `css`, `sprite`, `html`, `js`));
gulp.task(`start`, gulp.series(`build`, `server`));
