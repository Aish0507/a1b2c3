module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }

    },
    war: {
      target: {
        options: {
          war_verbose: true,
          war_dist_folder: 'build',           // Folder path seperator added at runtime.
          war_name: 'ssp-ui',            // .war will be appended if omitted
          webxml_welcome: 'index.html',
          webxml_display_name: 'Grunt WAR'
        },
        files: [
          {
            expand: true,
            cwd: 'dist',
            src: ['**'],
            dest: ''
          }
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.loadNpmTasks('grunt-war');
  grunt.registerTask('default', ['war']);
};
