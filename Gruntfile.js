/*!
 * usage:
 *
 * developing: $ grunt
 * testing:    $ grunt test
 * deploy:     $ grunt deploy
 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> v<%= pkg.version %>, <%= grunt.template.today("yyyy-mm-dd HH:MM:ss Z") %> */\n',
        mangle: false
      },
      build: {
        src: 'dist/pbj.min.js',
        dest: 'dist/pbj.min.js'
      }
    },
    babel: {
      dist: {
        options: {
          moduleIds: true,
          getModuleId: function(moduleName) {
            return 'gdbots/pbj/' + moduleName.substr(4);
          },
          plugins: ['transform-es2015-modules-amd']
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'dist/es6'
        }]
      }
    },
    concat: {
      dist: {
        src: [
          'dist/es6/**/*.js'
        ],
        dest: 'dist/pbj.min.js'
      }
    },
    shell: {
      'cleanup': {
        command: 'rm -rf ./dist/es6/'
      }
    },
    watch: {
      scripts: {
        files: ['Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
        tasks: ['babel', 'concat', 'shell:cleanup', 'mochaTest']
      }
    },
    mochaTest: {
      test: {
        options: {
          require: 'tests/bootstrap.js'
        },
        src: ['tests/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.registerTask('deploy', ['babel', 'concat', 'uglify', 'shell:cleanup']);
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('test', ['mochaTest']);
};
