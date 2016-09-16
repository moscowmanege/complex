var rimraf = require('rimraf');
var runSequence = require('run-sequence');
var colors = require('colors');

var gulp = require('gulp'),
		gulpif = require('gulp-if'),
		changed = require('gulp-changed'),
		rename = require('gulp-rename'),
		plumber = require('gulp-plumber'),
		stylus = require('gulp-stylus'),
		autoprefixer = require('gulp-autoprefixer'),
		minify = require('gulp-minify'),
		jshint = require('gulp-jshint');


// vars Block


var Production = false;


// Paths Block


var paths = {
	stylus: {
		src: 'apps/**/src/styl/*.styl',
		dest: 'public/build/css'
	},
	scripts: {
		src: 'apps/**/src/js/*.js',
		dest: 'public/build/js'
	},
	stuff: {
		src: 'apps/**/stuff/**',
		dest: 'public/stuff'
	},
	clean: '{' + 'public/build/**' + ',' + 'public/stuff/**' + '}'
};


// Loggers Block


var error_logger = function(error) {
	console.log([
		'',
		'---------- ERROR MESSAGE START ----------'.bold.red.inverse,
		'',
		(error.name.red + ' in ' + error.plugin.yellow),
		'',
		error.message,
		'----------- ERROR MESSAGE END -----------'.bold.red.inverse,
		''
	].join('\n'));
};

var watch_logger = function(event) {
	console.log('File ' + event.path.replace(__dirname + '/', '').green + ' was ' + event.type.yellow + ', running tasks...');
};


// Tasks Block


gulp.task('clean', function(callback) {
	return rimraf(paths.clean, callback);
});

gulp.task('stuff', function() {
	return gulp
		.src(paths.stuff.src)
		.pipe(changed(paths.stuff.dest))
		.pipe(plumber(error_logger))
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('/stuff', '');
		}))
		.pipe(gulp.dest(paths.stuff.dest));
});

gulp.task('stylus', function() {
	return gulp
		.src(paths.stylus.src)
		.pipe(changed(paths.stylus.dest))
		.pipe(plumber(error_logger))
		.pipe(stylus({
			compress: Production
		}))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: !Production
		}))
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('/src/styl', '');
		}))
		.pipe(gulp.dest(paths.stylus.dest));
});

gulp.task('scripts', function() {
	return gulp
		.src(paths.scripts.src)
		.pipe(changed(paths.scripts.dest))
		.pipe(plumber(error_logger))
		.pipe(jshint({ laxbreak: true, expr: true, '-W041': false }))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(gulpif(Production, minify({ ext: { min: '.js' }, noSource: true })))
		.pipe(rename(function(path) {
			path.dirname = path.dirname.replace('/src/js', '');
		}))
		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('watch', function() {
	gulp.watch(paths.scripts.src, ['scripts']).on('change', watch_logger);
	gulp.watch(paths.stylus.src, ['stylus']).on('change', watch_logger);
	gulp.watch(paths.stuff.src, ['stuff']).on('change', watch_logger);
});

gulp.task('production', function(callback) {
	Production = true;
	callback();
});


// Run Block


gulp.task('default', function(callback) {
	runSequence('clean', ['stylus', 'scripts', 'stuff'], callback);
});

gulp.task('build', function(callback) {
	runSequence('production', 'clean', ['stylus', 'scripts', 'stuff'], callback);
});

gulp.task('dev', ['watch']);
gulp.task('run', ['production', 'watch']);