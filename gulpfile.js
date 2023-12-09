const { src, dest, watch, parallel, series }  = require('gulp');

const scss          = require('gulp-sass')(require('sass'));
const concat        = require('gulp-concat');
const browserSync   = require('browser-sync').create();
const uglify        = require('gulp-uglify-es').default;
const autoprefixer  = require('gulp-autoprefixer');
const imagemin      = require('gulp-imagemin');
const del           = require('del');
const webp          = require('gulp-webp');
const webpHtml      = require('gulp-webp-html');
const webpCss       = require('gulp-webp-css');
const svgSprite     = require("gulp-svg-sprite");
const fileInclude   = require('gulp-file-include');
const ftp           = require('vinyl-ftp');

function deploy() {
  let connect = ftp.create({
    host: 'h92460gw.beget.tech',
    user: 'h92460gw_test',
    password: 'HzGBTrFB8888!',
    parallel: 10,
  });

  let proj = [
    'dist/**'
  ]

  return src(proj, {buffer: false}).pipe(connect.newer('/').pipe(connect.dest('/')));
}

function browsersync() {
  browserSync.init({
    server : {
      baseDir: 'app/'
    }
  });
}

function cleanDist() {
  return del('dist')
}

function svgSprites() {
  return src("app/img/svg/**.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      })
    )
    .pipe(dest("app/img/sprite"));
}

function images() {
  return src('app/img/**/*')
    .pipe(imagemin(
      [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]
    ))
    .pipe(dest('dist/img'))
    .pipe(webp())
    .pipe(dest('app/img'))
    .pipe(dest('dist/img'))
}

function scripts() {
  return src([
  //   'node_modules/jquery/dist/jquery.js',
    'app/js/swiper.js',
    'app/js/main.js',
    // 'app/js/slick.min.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function html() {
  return src('app/**/*.html')
    .pipe(webpHtml())
    .pipe(dest('dist/'))
}

function styles() {
  return src('app/scss/style.scss')
      .pipe(scss({outputStyle: 'expanded'}))
      .pipe(concat('style.min.css'))
      .pipe(autoprefixer({
        overrideBrowserslist: ['last 10 version'],
        grid: true
      }))
      .pipe(webpCss())
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

function htmlInclude() {
  return src(['app/index.html'])
  .pipe(fileInclude({
    prefix: '@',
    basepath: '@file'
  }))
  .pipe(dest('./app'))
  .pipe(browserSync.stream())
}

function build() {
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*',
    'app/js/main.min.js',
    // 'app/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'))
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', htmlInclude, browserSync.reload);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.cleanDist = cleanDist;
exports.html = html;
exports.svgSprites = svgSprites;
exports.deploy = deploy;


exports.build = series(cleanDist, html, images, svgSprites, build, deploy);
exports.default = parallel(images, styles ,scripts ,browsersync, svgSprites, watching);


