const { dest, parallel, series, src, watch } = require('gulp');

const _browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const del = require('del');
const log = require('fancy-log');
const _sass = require('gulp-sass')

const browserSync = (cb) => {
    const options = {
        server: {
            baseDir: './build'
        }
    };
    _browserSync.init(options, cb);
};

const clean = (cb) => {
    const patterns = [
        'build/**/*',
        '!preview/reveal.css',
        '!preview/print/paper.css',
        '!preview/lib/tomorrow-night-blue.css',
    ];
    del(patterns).then(r => cb());
};

const copyFonts = (cb) => {
    return src('./fonts/**/*').pipe(dest('./build/fonts/'));
};

const copyImages = (cb) => {
    return src('./img/**/*').pipe(dest('./build/img/'));
};

const copyPreview = (cb) => {
    return src('./preview/**/*')
        .pipe(dest('./build/'))
        .pipe(_browserSync.reload({ stream: true }));
};

const sass = (cb) => {
    const options = {
        outputStyle: 'compressed'
    };
    
    return src('./src/**/*.scss')
        .pipe(_sass(options).on('error', _sass.logError))
        .pipe(concat('im-blue.css'))
        .pipe(dest('./build'))
        .pipe(_browserSync.reload({ stream: true }));
};

//
// User tasks
//

const dev = series(clean, copyPreview, browserSync, parallel(copyFonts, copyImages, sass), () => {
    log.info('Registering watch tasks...');
    watch('preview/**/*', copyPreview);
    watch('src/**/*.scss', sass); 
    watch('src/fonts/**/*', copyFonts);
    watch('src/img/**/*', copyImages);
});

const build = series(clean, parallel(copyFonts, copyImages, sass), () => {
    const files = [
        './package.json',
        './LICENSE',
        './README.MD',
    ];
    return src(files).pipe(dest('./build/'));
});

exports.build = build;
exports.dev = dev;

if (process.env.NODE_ENV === 'production') {
    exports.default = dev;
} else {
    exports.default = build;
}