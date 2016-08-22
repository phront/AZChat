gulp = require 'gulp'
livereload = require 'gulp-livereload'

gulp.task 'html', -> do livereload.reload
gulp.task 'watch', ->
  do livereload.listen
  gulp.watch ['index.*'], ['html']
gulp.task 'default', ['watch']