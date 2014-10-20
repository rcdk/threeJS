module.exports = function(grunt) {

	'use strict';

	// Project configuration.
	grunt.initConfig({
		// Metadata
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			'* <%= pkg.name || pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'* <%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>; Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
			'*/\n',

		jade: {
			compile: {
				options: {
					data: {
						site: {
							name: '<%= pkg.name %>',
							script: '<%= pkg.title %>.func.js',
							description: '<%= pkg.description %>'
						}
					},
					pretty: true,
					indentchar: '\t'
				},
				files: [{
					expand: true,
					cwd: '<%= pkg.config.html.src %>',
					src: ['*.jade'],
					dest: '<%= pkg.config.html.dist %>',
					ext: '.jade',
					rename: function(destBase, destPath, opt) {
						if(destPath != ("index" + opt.ext)){
							destPath = "tpl-" + destPath;
						}
						return destBase + destPath.replace(opt.ext, '.html');
					}
				}]
			}
		},

		less: {
			options: {
				file: 'screen',
				sourceMap: true,
				sourceMapFilename: '<%= pkg.config.css.dist + less.options.file %>.map',
				sourceMapURL: '<%= less.options.file %>.map'
			},
			development: {
				files: {
					'<%= pkg.config.css.dist + less.options.file %>.css': '<%= pkg.config.css.src + less.options.file %>.less'
				}
			},
			production: {
				options: {
					cleancss: true,
					sourceMap: true
				},
				files: {
					'<%= pkg.config.css.dist + less.options.file %>.min.css': '<%= pkg.config.css.src + less.options.file %>.less'
				}
			}
		},

		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: true
			},
			plugins: {
				src: ['<%= pkg.config.js.src %>plugins/*.js'],
				dest: '<%= pkg.config.js.dist %>jquery.plugins.js'
			}
		},

		uglify: {
			options: {
				beautify: {
					ascii_only: true
				}
			},
			library: {
				src: '<%= pkg.config.js.src %>jquery.js',
				dest: '<%= pkg.config.js.src %>min/jquery.js'
			},
			plugins: {
				options: {
					banner: '<%= banner %>',
					sourceMap: "<%= pkg.config.js.src %>min/jquery.plugins.map"
				},
				src: '<%= concat.plugins.dest %>',
				dest: '<%= pkg.config.js.src %>min/jquery.plugins.js'
			},
			script: {
				options: {
					sourceMap: "<%= pkg.config.js.src %>min/<%= pkg.title %>.func.map"
				},
				src: '<%= pkg.config.js.src + pkg.title %>.func.js',
				dest: '<%= pkg.config.js.src %>min/<%= pkg.title %>.func.js'
			}
		},

		watch: {
			jade: {
				files: ['<%= pkg.config.html.dist %>**/*.jade','<%= pkg.config.html.dist %>**/**/*.jade'],
				tasks: ['jade']
			},
			less: {
				files: '<%= pkg.config.css.src %>**/*.less',
				tasks: ['less']
			},
			scripts: {
				files: '<%= pkg.config.js.src + pkg.title %>.func.js',
				tasks: ['uglify:script']
			}
		},

		connect: {
			server: {
				options: {
					port: 8888,
					root:'.',
					middleware: function(connect, options) {
						var dirOpts = {
							icons: true
						};
						return [
							connect.favicon(),
							connect['static'](options.base),
							connect.directory(options.base, dirOpts)
						];
					}
				}
			}
		}
	});

	// Libraries
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Tasks
	grunt.registerTask('default', ['jade', 'less', 'concat' ,'uglify']);
	grunt.registerTask('js', ['concat', 'uglify']);
	grunt.registerTask('css', ['less']);
	grunt.registerTask('html', ['jade']);
	grunt.registerTask('server', ['connect', 'watch']);
	
	grunt.registerTask('init', function(){
		grunt.task.run('jade');
		grunt.task.run('less');
		grunt.task.run('js');
	});

};