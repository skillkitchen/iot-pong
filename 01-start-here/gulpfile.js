// REQUIRE
var fs = require('fs');

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	clean = require('gulp-clean'),
	sass = require('gulp-sass'),
	filter = require('gulp-filter'),
	importer = require('node-sass-globbing'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps');

var sassCache = {};

var BASE_DIR = './',
	BUILD_DIR = BASE_DIR + 'build/',
	SOURCE_DIR = BASE_DIR + 'source/';

var HTML_SOURCE_DIR = SOURCE_DIR + '**/*.html',
	HTML_BUILD_DIR = BUILD_DIR;

var CSS_SOURCE_DIR = SOURCE_DIR + 'css/**/*.scss',
	CSS_BUILD_DIR = BUILD_DIR + 'css/';

var JS_SOURCE_DIR = SOURCE_DIR + 'js/**/*.js',
	JS_BUILD_DIR =  BUILD_DIR + 'js/';

var IMG_SOURCE_DIR = SOURCE_DIR + 'img/**/*',
	IMG_BUILD_DIR = BUILD_DIR + 'img/';

// TASK : SASS
var sassOptions = {
	importer: importer, // use globbing import
	errLogToConsole: true,
	outputStyle: 'expanded'
}

gulp.task('sass', function(done){
	return gulp
	.src(CSS_SOURCE_DIR)
	.pipe(sourcemaps.init())
	.pipe(sass(sassOptions).on('error', sass.logError))
	.pipe(autoprefixer())
	.pipe(filter(function(file) {
		var content = file.contents.toString();
		if (sassCache[file.path] != content) {
			sassCache[file.path] = content;
			return true;
		} else {
			return false;
		}
	}))
	.pipe(sourcemaps.write('maps'))
	.pipe(gulp.dest(CSS_BUILD_DIR));

	if(done) done();
});

// TASK : COPY Fonts
gulp.task('copy-html', function(done){
	gulp.src(HTML_SOURCE_DIR)
		.pipe(gulp.dest(HTML_BUILD_DIR))

	if(done) done();
});

// TASK : COPY JS
gulp.task('copy-js', function(done){
	gulp.src(JS_SOURCE_DIR)
		.pipe(gulp.dest(JS_BUILD_DIR))

	if(done) done();
});

// TASK : COPY IMG
gulp.task('copy-img', function(done){
	gulp.src(IMG_SOURCE_DIR)
		.pipe(gulp.dest(IMG_BUILD_DIR))

	if(done) done();
});

gulp.task('copy', gulp.parallel(
	'copy-html',
	'copy-img',
	'copy-js',
));


// TASK : WATCH
gulp.task('watch-html', function(){
	return gulp.watch(HTML_SOURCE_DIR, gulp.series('copy-html'))
});
gulp.task('watch-sass', function(){
	return gulp.watch(CSS_SOURCE_DIR, gulp.series('sass'))
});
gulp.task('watch-js', function(){
	return gulp.watch(JS_SOURCE_DIR, gulp.series('copy-js'))
});
gulp.task('watch-img', function(){
	return gulp.watch(JS_SOURCE_DIR, gulp.series('copy-img'))
});

gulp.task('watch', gulp.parallel(
	'watch-html',
	'watch-sass',
	'watch-js',
	'watch-img'
));


// TASK : CLEAN
gulp.task('clean-build', function(done){
	if(fs.existsSync(BUILD_DIR)) {
		return gulp.src(BUILD_DIR, {read: false})
		.pipe(clean());
	}
	if(done) done();
});

gulp.task('clean', gulp.series(
	'clean-build',
));




// INITS
gulp.task('default', gulp.series('clean', 'copy', 'sass', 'watch'));










