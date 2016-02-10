'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');

var yargs = require('yargs').argv;
var minify = yargs.minify ? true : false;

var config = {
	autoprefix: {
		support: 'last 2 versions, Explorer >= 8, Firefox >= 25'
	},
	path: {
		src: {
			asset: {
				image: 'src/asset/image',
				javascript: 'src/asset/javascript',
				scss: 'src/asset/scss',
				html: 'src/asset/html'
			}
		},
		build: {
			asset: {
				image: 'build/public',
				javascript: 'build/public',
				css: 'build/public',
				html: 'build'
			}
		}
	}
};

gulp.task('build:asset:image', () => {
	return gulp.src(config.path.src.asset.image + '/**/*')
		.pipe($.plumber())
		// optimizes image file if possible
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest(config.path.build.asset.image));
});

gulp.task('build:asset:javascript', () => {
	return gulp.src([config.path.src.asset.javascript + '/*.js'])
		.pipe(gulp.dest(config.path.build.asset.javascript));
});

gulp.task('build:asset:scss', () => {
	return $.rubySass(config.path.src.asset.scss + '/*.scss', {
			precision: 8,
			loadPath: [
				config.path.src.asset.scss
			],
			sourcemap: false
		})
		.on('error', (error) => {
			console.log(error);
		})

		.pipe($.plumber())

		.pipe($.ignore('**/*.css.map'))

		// autoprefixes css properties
		.pipe($.autoprefixer(config.autoprefix.support.split(', ')))

		// minifies css if minify property is enabled
		.pipe($.if(minify, $.cssnano()))

		.pipe(gulp.dest(config.path.build.asset.css));
});

gulp.task('build:asset:html', () => {
	return gulp.src(config.path.src.asset.html + '/**/*')
		.pipe($.plumber())
		.pipe(gulp.dest(config.path.build.asset.html));
});

gulp.task('build:asset', (callback) => {
	runSequence(
		//'build:asset:font',
		'build:asset:image',
		'build:asset:javascript',
		'build:asset:scss',
		'build:asset:html',
		callback
	);
});

gulp.task('build', (callback) => {
	runSequence(
		'build:asset',
		callback
	);
});

gulp.task('default', ['build']);