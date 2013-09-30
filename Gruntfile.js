'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    nodeunit: {
      files: ['test/**/*_test.js'],
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
    transpile: {
      amd: {
        type: 'amd',
        files: [{
          expand: true,
          cwd: 'lib/',
          src: ['**/*.js'],
          dest: 'tmp/',
          ext: '.amd.js'
        }]
      },
      commonjs: {
        type: 'cjs',
        files: [{
          expand: true,
          cwd: 'lib/',
          src: ['jekylljs/*.js'],
          dest: 'dist/commonjs/',
          ext: '.js'
        },
        {
          src: ['lib/jekylljs.js'],
          dest: 'dist/commonjs/main.js'
        }]
      }
    },
    concat: {
      amd: {
        src: "tmp/**/*.amd.js",
        dest: "media/js/amd/jekylljs.amd.js"
      },
    },
    browser: {
      dist: {
        src: ["vendor/loader.js", "dist/jekylljs.amd.js"],
        dest: "dist/jekylljs.js",
        options: {
          barename: "jekylljs",
          namespace: "jekylljs"
        }
      }
    }
  });

  
  // Register the browser job

  grunt.registerMultiTask('browser', "Export a module to the window", function() {
    var opts = this.options();
    this.files.forEach(function(f) {
        var output = ["(function(globals) {"];

        output.push.apply(output, f.src.map(grunt.file.read));

        output.push(grunt.template.process('window.<%= namespace %> = requireModule("<%= barename %>");', {
            data: {
                namespace: opts.namespace,
                barename: opts.barename
            }
        }));
        output.push('})(window);');

        grunt.file.write(f.dest, grunt.template.process(output.join("\n")));
    });
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-es6-module-transpiler');

  // Default task.
  grunt.registerTask('default', ["transpile", "concat:amd", "browser" ]);
};
