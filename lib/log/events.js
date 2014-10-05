'use strict';

var chalk = require('chalk');
var gutil = require('gulp-util');
var prettyTime = require('pretty-hrtime');
var formatError = require('../formatError');
var batch = require('batch-these');

// wire up logging events
function logEvents(gulpInst) {

  gulpInst.on('start', function (e) {
    // batched output for task start
    var chunk = '\'' + chalk.cyan(e.task) + '\'';
    batch.these(chunk, function(data){
      gutil.log('Starting', data.join(', '),'...');
    });
  });

  gulpInst.on('stop', function (e) {
    var time = prettyTime(e.hrDuration);
    var chunk  = '\'' + chalk.cyan(e.task) + '\'';
        chunk += ' after ' + chalk.magenta(time);
    batch.these(chunk, function(data){
      // `stop` loggings are longer. Limited to 3 per line
      var bound = 3;
      gutil.log('Finished', data.slice(0, bound).join(', '));
      var index = bound;
      var len = data.length;      
      while (index < len) {
        gutil.log('Finished', data.slice(index, index += bound).join(', '));
      }
    });
  });

  gulpInst.on('error', function (e) {
    var msg = formatError(e);
    var time = prettyTime(e.duration);
    gutil.log(
      '\'' + chalk.cyan(e.name) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    );
    gutil.log(msg);
    process.exit(1);
  });
}

module.exports = logEvents;
