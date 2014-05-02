module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        uglify: {
            my_target: {
                files: {
                    'dist/b3.localStorageSource.min.js': ['source/localStorageSource.js']
                }
            }
        }
    });

};