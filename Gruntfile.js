module.exports = function(grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

  concat: {
    'public/js/main.js': ['public/js/vendor/*.js', 'public/js/init.js']
  },

  uglify: {
    compile: {
      options: {
        compress: true,
        verbose: true
      },
      files: [{
        src: 'public/js/main.js',
        dest: 'public/js/init.js'
      }]
    }
  },

  simplemocha: {
    options: {
      globals: ['expect', 'sinon'],
      timeout: 3000,
      ignoreLeaks: false,
      ui: 'bdd',
      reporter: 'spec'
    },
    server: {
      src: ['test/**/*.js']
    },
    client: {
      // src: ['test/**/*.js']
    }
  },

  jshint: {
    /* Linting Options */
    options: {
      jshintrc: '.jshintrc'
    },
    all: ['Gruntfile.js', 'models/**/*.js', 'routes/**/*.js'],
    client: ['public/js/*.js'],
    test: ['text/**/*.js']
  }

});

grunt.registerTask('init', ['concat', 'uglify']);

grunt.registerTask('hint', ['jshint:all', 'jshint:client']);

grunt.registerTask('test', ['test:server', 'test:client']);
};