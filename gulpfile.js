const gulp = require('gulp');

const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const del = require('del');
const log = require('fancy-log');
const sass = require('gulp-sass');

const sassOptions = {
    outputStyle: 'compressed'
};

gulp.task('browserSync', () => {
    return browserSync.init({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('clean', () => {
    return del.sync([
        'build/**/*',
        '!preview/reveal.css',
        '!preview/print/paper.css',
        '!preview/lib/tomorrow-night-blue.css',
    ]);
});

gulp.task('copy-fonts', () => {
    return gulp
        .src('./fonts/**/*')
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('copy-images', () => {
    return gulp
        .src('./img/**/*')
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('copy-preview', () => {
    return gulp
        .src('./preview/**/*')
        .pipe(gulp.dest('./build/'));
});

gulp.task('sass', () => {
    return gulp
        .src('./src/**/*.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(concat('im-blue.css'))
        .pipe(gulp.dest('./build'))
        .pipe(browserSync.reload({ stream: true }));
});

//
// User tasks
//

gulp.task('dev', ['clean', 'copy-preview', 'browserSync', 'copy-fonts', 'copy-images', 'sass'], () => {
    log.info('Registering watch tasks...');
    gulp.watch('src/**/*.scss', ['sass']); 
    gulp.watch('src/fonts/**/*', ['copy-fonts']);
    gulp.watch('src/img/**/*', ['copy-images']);
});

gulp.task('build', ['clean', 'copy-fonts', 'copy-images', 'sass'], () => {
    const files = [
        './package.json',
        './LICENSE',
        './README.MD',
    ];
    return gulp.src(files).pipe(gulp.dest('./build/'));
});

gulp.task('default', () => {
    // place code for your default task here
});