'use strict'

var gulp = require('gulp');
var browser_sync = require('browser-sync').create();

 gulp.task('reload', function() {
    browser_sync.init({
        server:{
            baseDir:'./'
        }
    });
    gulp.watch('./style.css').on('change',browser_sync.reload);
    gulp.watch('./index.html').on('change',browser_sync.reload);
    gulp.watch('./picker.js').on('change',browser_sync.reload);
});