module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
      },
      build: {
        src: 'pjaxer.js',
        dest: 'pjaxer.min.js'
      }
    },
    mocha: {
      test: {
        options: {
          reporter: 'Nyan',
          run: true
        },
        src: ['test/index.html']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('test', ['mocha']);
};

