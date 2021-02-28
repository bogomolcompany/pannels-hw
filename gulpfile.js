const { src, dest, watch, series, parallel } = require('gulp')
const include = require('gulp-file-include')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const csso = require('gulp-csso')
const babel = require('gulp-babel')
const rename = require('gulp-rename')
const terser = require('gulp-terser')
const webpack = require('webpack-stream')
const del = require('del')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()

// -------- clean tasks -------- //
const clean = () => {
	return del(['dist'])
}

const cleanImages = () => {
	return del(['dist/images'])
}

const cleanFonts = () => {
	return del(['dist/fonts'])
}

// -------- html task -------- //
const html = () => {
	return src('src/index.html')
		.pipe(
			include({
				prefix: '@@',
			})
		)
		.pipe(dest('dist'))
}

// -------- css task -------- //
const css = () => {
	return src('src/scss/index.scss')
		.pipe(
			sass({
				includePaths: './node_modules/',
			})
		)
		.pipe(autoprefixer())
		.pipe(rename('app.css'))
		.pipe(csso())
		.pipe(dest('dist'))
}

const cssWatch = () => {
	return src('src/scss/index.scss')
		.pipe(sourcemaps.init())
		.pipe(
			sass({
				includePaths: './node_modules/',
			})
		)
		.pipe(autoprefixer())
		.pipe(rename('app.css'))
		.pipe(csso())
		.pipe(sourcemaps.write())
		.pipe(dest('dist'))
}

// -------- js task -------- //
const js = () => {
	return src('src/**/*.js')
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(
			webpack({
				mode: 'development',
				devtool: 'inline-source-map',
			})
		)
		.pipe(rename('app.js'))
		.pipe(terser({ output: { comments: false } }))
		.pipe(dest('dist'))
}

const jsWatch = () => {
	return src('src/**/*.js')
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(
			webpack({
				mode: 'development',
				devtool: 'inline-source-map',
			})
		)
		.pipe(sourcemaps.init())
		.pipe(rename('app.js'))
		.pipe(terser({ output: { comments: false } }))
		.pipe(sourcemaps.write())
		.pipe(dest('dist'))
}

// -------- copy tasks -------- //
const copyImages = () => {
	return src('src/assets/images/**/*.{jpg,jpeg,png,gif,svg,ico}').pipe(
		dest('dist/images')
	)
}

const copyFonts = () => {
	return src('src/assets/fonts/**/*.{svg,eot,ttf,woff,woff2}').pipe(
		dest('dist/fonts')
	)
}

// -------- watch task -------- //
const watcher = () => {
	browserSync.init({
		server: './dist',
	})

	watch('src/scss/**/*.scss', css).on('change', browserSync.reload)
	watch('src/**/*.js', js).on('change', browserSync.reload)
	watch('src/**/*.html', html).on('change', browserSync.reload)
	watch(
		'src/assets/images/**/*.{png,jpg,jpeg,gif,svg,ico}',
		series(cleanImages, copyImages)
	)
	watch(
		'src/assets/fonts/**/*.{svg,eot,ttf,woff,woff2}',
		series(cleanFonts, copyFonts)
	)
}

// -------- public tasks -------- //
exports.clean = clean
exports.default = series(
	clean,
	parallel(html, cssWatch, jsWatch, copyImages, copyFonts),
	watcher
)
exports.build = series(clean, parallel(html, css, js, copyImages, copyFonts))
