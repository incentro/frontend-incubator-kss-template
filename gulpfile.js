'use strict';

let gulp = require('gulp');

let $ = require('gulp-load-plugins')();
let runSequence = require('run-sequence');

let yargs = require('yargs').argv;
let minify = yargs.minify ? true : false;

let config = {
	autoprefix: {
		support: 'last 2 versions, Explorer >= 8, Firefox >= 25'
	},
	path: {
		src: {
			asset: 'src/kss-assets',
			helpers: 'src/helpers',
			root: 'src'
		},
		build: {
			asset: 'build/kss-assets',
			helpers: 'build/helpers',
			root: 'build'

		}
	}
};

gulp.task('copy:assets', () => {
	return gulp.src([config.path.src.asset + '/**', '!' + config.path.src.asset + '/*.scss'])
		.pipe(gulp.dest(config.path.build.asset));
});

gulp.task('copy:helpers', () => {
	return gulp.src([config.path.src.helpers + '/**'])
		.pipe(gulp.dest(config.path.build.helpers));
});


gulp.task('copy:root', () => {
	return gulp.src([config.path.src.root + '/*.*'])
		.pipe(gulp.dest(config.path.build.root));
});

gulp.task('build:scss', () => {
	return gulp.src(config.path.src.asset + '/*.scss')
		.pipe($.sass({
			precision: 8,
			sourcemap: false
		}))

		.pipe($.plumber())

		.pipe($.ignore('**/*.css.map'))

		// autoprefixes css properties
		.pipe($.autoprefixer(config.autoprefix.support.split(', ')))

		// minifies css if minify property is enabled
		.pipe($.if(minify, $.cssnano()))

		.pipe(gulp.dest(config.path.build.asset));
});


gulp.task('build', (callback) => {
	runSequence(
		'copy:root',
		'copy:assets',
		'copy:helpers',
		'build:scss',
		callback
	);
});


gulp.task('default', ['build']);
