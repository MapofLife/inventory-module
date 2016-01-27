
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: [
          'client/components/mol-ui-components/**/component.min.js',
          'client/components/mol-ui-components/**/component.min.css',
          'client/js/*.js',
          'client/css/*.css'],
        tasks: ['default']
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        mangle: false,
        preserveComments: false
      },
      min: {
        files: {
          "client/app.min.js": [
            "client/js/app.min.css.js",
            "client/js/app.js"
          ]
        }
      }
    },
    cssmin : {
      options: {
        report: 'gzip',
        rebase: true,
        root: './',
        keepSpecialComments: 0
      },
      combine : {
        files: {
          "client/css/app.min.css": [
          ]
        }
      }
    },
    css2js: {
        compile: {
            src: 'client/css/app.min.css',
            dest: 'client/js/app.min.css.js'
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-css2js');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['cssmin','css2js','uglify']);
  grunt.loadNpmTasks('grunt-html2js');

};
