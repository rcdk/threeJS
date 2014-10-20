//change className of html from .noJS to .hasJS.
(function(el){el.className=el.className.replace("no-js", "has-js");})(document.documentElement);

/* device detection */
var userAgent = navigator.userAgent;
var device = {
	iPad: userAgent.match(/iPad/),
	iPhone: userAgent.match(/iPhone/),
	iPod: userAgent.match(/iPod/),
	iOS: userAgent.match(/(iPhone|iPod|iPad)/),
	blackberry: userAgent.match(/BlackBerry/),
	android: userAgent.match(/Android/),
	webOS: userAgent.match(/webOS/),
	wp: userAgent.match(/Windows Phone/)
};
isMobileDevice = false;

//Add an alias to the App, if we need to call App from the outside:
window.App = window.App || {};

(function( $ ){
	App = {
		// App.common.init runs on all pages
		init : function() {

			/* add class to body if mobile*/
			if (device.iOS || device.android || device.webOS) {
				isMobileDevice = true;
				$("body").addClass("mobile-device");
			}

			App.Charts.build();
			//App.Three.build();
			App.Earth.build();
			//App.Night.build();
		}
	};

	App.Night = App.Night || {

		build: function() {


			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container;

			var start_time;

			var camera, scene, renderer;

			var uniforms, mesh, meshes = [];

			var mouseX = 0, mouseY = 0,
			lat = 0, lon = 0, phy = 0, theta = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = $(".earth");

				scene = new THREE.Scene();

				camera = new THREE.PerspectiveCamera( 40, windowHalfX / windowHalfY, 1, 3000 );
				camera.position.z = 4;
				scene.add( camera );

			    directionalLight = new THREE.DirectionalLight( 0xaaff33, 0 );
			    directionalLight.position.set( -1, 1, 0.5 ).normalize();
			    scene.add( directionalLight );

				start_time = Date.now();

				uniforms = {
			        sunDirection: { type: "v3", value: new THREE.Vector3(0,1,0) },
					dayTexture: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "../js/textures/planets/textures/earth-day.jpg" ) },
			        nightTexture: { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( "../js/textures/planets/textures/earth-night.jpg" ) }
				};

				uniforms.dayTexture.texture.wrapS = uniforms.dayTexture.texture.wrapT = THREE.Repeat;
			    uniforms.nightTexture.texture.wrapS = uniforms.nightTexture.texture.wrapT = THREE.Repeat;

				var size = 0.75;

			    material = new THREE.ShaderMaterial( {

			        uniforms: uniforms,
			        vertexShader: document.getElementById( 'vertexShader' ).textContent,
			        fragmentShader: document.getElementById( 'fragmentShader' ).textContent

			        } );

			    mesh = new THREE.Mesh( new THREE.SphereGeometry( size, 32, 16 ), material );
			    scene.add( mesh );

			    meshes.push( mesh );



				renderer = new THREE.WebGLRenderer();
				container.append( renderer.domElement );

				//stats = new Stats();
				//stats.domElement.style.position = 'absolute';
				//stats.domElement.style.top = '0px';
				//container.appendChild( stats.domElement );

				onWindowResize();

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize( event ) {

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				//stats.update();

			}

			function render() {

			    var t = Date.now() * 0.001;
			    uniforms.sunDirection.value.x = Math.sin(t);
			    uniforms.sunDirection.value.y = Math.cos(t);

			    // Note: Since the earth is at 0,0,0 you can set the normal for the sun
			    // with
			    //
			    // uniforms.sunDirection.value.copy(sunPosition);
			    // uniforms.sunDirection.value.normalize();


				for( var i = 0; i < meshes.length; ++ i ) {

					meshes[ i ].rotation.y += 0.01 * ( i % 2 ? 1 : -1 );
					meshes[ i ].rotation.x += 0.01 * ( i % 2 ? -1 : 1 );

				}

				renderer.render( scene, camera );

			}


		}


	}

	App.Three = App.Three || {


		build: function() {


			$webglEl = $('#webgl');

			if (!Detector.webgl) {
				Detector.addGetWebGLMessage($webglEl);
				return;
			}

			var width  = $(document).width(),
				height = $(document).height();

			// Earth params
			var radius   = 0.5,
				segments = 32,
				rotation = 6;  

			var scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
			camera.position.z = 1.5;

			//camera.lookAt(scene.position)
			var renderer = new THREE.WebGLRenderer();
			renderer.setSize(width, height);

			scene.add(new THREE.AmbientLight(0x333333));

			var light = new THREE.DirectionalLight(0xffffff, 1);
			light.position.set(5,3,5);
			scene.add(light);

		    var sphere = createSphere(radius, segments);
			sphere.rotation.y = rotation; 
			scene.add(sphere)

		    var clouds = createClouds(radius, segments);
			clouds.rotation.y = rotation;
			scene.add(clouds)

			/*
			var stars = createStars(90, 64);
			scene.add(stars);*/

			//controls = new THREE.TrackballControls(camera);

			$webglEl.append(renderer.domElement);

			render();
			var count = 0;
			function render() {
				
				//camera.position.x = Math.cos(timer) * 10;
				//camera.position.z = Math.sin(timer) * 10;
				//camera.lookAt(scene.position);
				
				//controls.update();
				//sphere.rotation.y += 0.0005;
				
				clouds.rotation.y += 0.0005;		
				requestAnimationFrame(render);
				//count++;
				//console.log(count)
				renderer.render(scene, camera);
				
				var timer = Date.now() * 0.0005;


			}

			function animate() {

				requestAnimationFrame(animate);
				render();

			}

			function createSphere(radius, segments) {
				return new THREE.Mesh(
					new THREE.SphereGeometry(radius, segments, segments),
					new THREE.MeshPhongMaterial({
						map:         THREE.ImageUtils.loadTexture('../images/2_no_clouds_4k.jpg'),
						bumpMap:     THREE.ImageUtils.loadTexture('../images/elev_bump_4k.jpg'),
						bumpScale:   0.005,
						specularMap: THREE.ImageUtils.loadTexture('../images/water_4k.png'),
						specular:    new THREE.Color('grey')								
					})
				);
			}

			function createClouds(radius, segments) {
				return new THREE.Mesh(
					new THREE.SphereGeometry(radius + 0.003, segments, segments),			
					new THREE.MeshPhongMaterial({
						map:         THREE.ImageUtils.loadTexture('../images/fair_clouds_4k.png'),
						transparent: true
					})
				);		
			}


			/*
			function createStars(radius, segments) {
				return new THREE.Mesh(
					new THREE.SphereGeometry(radius, segments, segments), 
					new THREE.MeshBasicMaterial({
						map:  THREE.ImageUtils.loadTexture('../images/galaxy_starfield.png'), 
						side: THREE.BackSide
					})
				);
			}*/


		},

		size: function() {

			var width  = $(document).width()-150,
				height = $(document).height()-150;
			$(".overlay").width(width).height(height).css("left", "0").css("top", "0");
			camera.fov *= -0.8;
			camera.updateProjectionMatrix();
		}

	}

	App.Earth = App.Earth || {

		build: function() {

			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
			var radius = 6371;
			var tilt = -0.47;
			var rotationSpeed = 0.01;
			var cloudsScale = 1.005;
			var MARGIN = 0;
			var SCREEN_HEIGHT = window.innerHeight - MARGIN * 2;
			var SCREEN_WIDTH = window.innerWidth;
			var container;
			var camera, scene, sceneCube, renderer;
			var geometry, meshPlanet, meshClouds;
			var dirLight, pointLight, ambientLight;
			var d, dPlanet = new THREE.Vector3();
			var clock = new THREE.Clock();
			init();
			animate();

			function init() {

				container = $(".earth");

				camera = new THREE.PerspectiveCamera( 25, SCREEN_WIDTH / SCREEN_HEIGHT, 50, 1e7 );
				camera.position.z = radius * 5;

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.00000025 );

				var userOpts	= {
					range		: 800,
					duration	: 2500,
					delay		: 200,
					easing		: 'Elastic.EaseInOut'
				};

				//controls = new THREE.FlyControls( camera );
				//controls.movementSpeed = 1000;
				//controls.domElement = container;
				//controls.rollSpeed = Math.PI / 24;
				//controls.autoForward = false;
				//controls.dragToLook = false;

				// Lights

				controls = new THREE.OrbitControls( camera );
  				controls.addEventListener( 'change', render );

				dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 1, 0, 1 ).normalize();
				scene.add( dirLight );

				ambientLight = new THREE.AmbientLight( 0x000000 );
				scene.add( ambientLight );

				
				// Shades/Textures
				var planetTexture = THREE.ImageUtils.loadTexture( "../js/textures/planets/earth_atmos_5400.jpg" );
				var cloudsTexture = THREE.ImageUtils.loadTexture( "../js/textures/planets/earth_clouds_2096.png" );
				var normalTexture = THREE.ImageUtils.loadTexture( "../js/textures/planets/earth_normal_2048.jpg" );
				var specularTexture = THREE.ImageUtils.loadTexture( "../js/textures/planets/earth_specular_2048.jpg" );
				var shader = THREE.ShaderLib[ "normalmap" ];
				var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

				uniforms[ "tNormal" ].value = normalTexture;
				uniforms[ "uNormalScale" ].value.set( 0.85, 0.85 );
				uniforms[ "tDiffuse" ].value = planetTexture;
				uniforms[ "tSpecular" ].value = specularTexture;
				uniforms[ "enableAO" ].value = false;
				uniforms[ "enableDiffuse" ].value = true;
				uniforms[ "enableSpecular" ].value = true;
				uniforms[ "diffuse" ].value.setHex( 0xffffff );
				uniforms[ "specular" ].value.setHex( 0x333333 );
				uniforms[ "ambient" ].value.setHex( 0x000000 );
				uniforms[ "shininess" ].value = 15;

				var parameters = {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: uniforms,
					lights: true,
					fog: true
				};

				var materialNormalMap = new THREE.ShaderMaterial( parameters );

				// planet
				
				geometry = new THREE.SphereGeometry( radius, 100, 50 );
				geometry.computeTangents();
				meshPlanet = new THREE.Mesh( geometry, materialNormalMap );
				meshPlanet.rotation.y = 0;
				meshPlanet.rotation.z = tilt;
				scene.add( meshPlanet );

				/*Test cube
				var geometry = new THREE.BoxGeometry(10000,10000,10000); 
				var material = new THREE.MeshBasicMaterial({color: 0x00ff00}); 
				var cube = new THREE.Mesh(geometry, material); 

				scene.add(cube);*/

				//lensflare
				/*
				var textureFlare0 = THREE.ImageUtils.loadTexture( "../js/textures/lensflare/lensflare0.png" );
				var textureFlare2 = THREE.ImageUtils.loadTexture( "../js/textures/lensflare/lensflare2.png" );
				var textureFlare3 = THREE.ImageUtils.loadTexture( "../js/textures/lensflare/lensflare3.png" );

				addLight( 0.55, 0.9, 0.5, 0, 0, 0 );
				addLight( 0.08, 0.8, 0.5, 0, 0, 0 );
				addLight( 0.995, 0.5, 0.9, 0, 0, 0 );

				function addLight( h, s, l, x, y, z ) {

				    var light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
				    light.color.setHSL( h, s, l );
				    light.position.set( x, y, z );
				    scene.add( light );

				    var flareColor = new THREE.Color( 0xffffff );
				    flareColor.setHSL( h, s, l + 0.5 );

				    var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );

				    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
				    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
				    lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

				    lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
				    lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
				    lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
				    lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

				    lensFlare.customUpdateCallback = lensFlareUpdateCallback;
				    lensFlare.position.copy( light.position );
				    
				    scene.add( lensFlare );
				}*/


				/*
				function lensFlareUpdateCallback( object ) {

				    var f, fl = object.lensFlares.length;
				    var flare;
				    var vecX = -object.positionScreen.x * 2;
				    var vecY = -object.positionScreen.y * 2;

				    for( f = 0; f < fl; f++ ) {
					    flare = object.lensFlares[ f ];
					    flare.x = object.positionScreen.x + vecX * flare.distance;
					    flare.y = object.positionScreen.y + vecY * flare.distance;
					    flare.rotation = 0;
				    }

				    object.lensFlares[ 2 ].y += 0.025;
				    object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
				}*/

				// clouds
				var materialClouds = new THREE.MeshLambertMaterial( { color: 0xffffff, map: cloudsTexture, transparent: true } );
				meshClouds = new THREE.Mesh( geometry, materialClouds );
				meshClouds.scale.set( cloudsScale, cloudsScale, cloudsScale );
				meshClouds.rotation.z = tilt;
				scene.add( meshClouds );

				// stars
				var i, r = radius, starsGeometry = [ new THREE.Geometry(), new THREE.Geometry() ];

				for ( i = 0; i < 250; i ++ ) {
					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );
					starsGeometry[ 0 ].vertices.push( vertex );
				}
				for ( i = 0; i < 1500; i ++ ) {
					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2 - 1;
					vertex.y = Math.random() * 2 - 1;
					vertex.z = Math.random() * 2 - 1;
					vertex.multiplyScalar( r );
					starsGeometry[ 1 ].vertices.push( vertex );
				}

				var stars;
				var starsMaterials = [
				  new THREE.PointCloudMaterial( { color: 0x555555, size: 2, sizeAttenuation: false } ),
				  new THREE.PointCloudMaterial( { color: 0x555555, size: 1, sizeAttenuation: false } ),
				  new THREE.PointCloudMaterial( { color: 0x333333, size: 2, sizeAttenuation: false } ),
				  new THREE.PointCloudMaterial( { color: 0x3a3a3a, size: 1, sizeAttenuation: false } ),
				  new THREE.PointCloudMaterial( { color: 0x1a1a1a, size: 2, sizeAttenuation: false } ),
				  new THREE.PointCloudMaterial( { color: 0x1a1a1a, size: 1, sizeAttenuation: false } )
				];

				for ( i = 10; i < 30; i ++ ) {
					stars = new THREE.PointCloud( starsGeometry[ i % 2 ], starsMaterials[ i % 6 ] );
					stars.rotation.x = Math.random() * 6;
					stars.rotation.y = Math.random() * 6;
					stars.rotation.z = Math.random() * 6;
					s = i * 10;
					stars.scale.set( s, s, s );
					stars.matrixAutoUpdate = false;
					stars.updateMatrix();
					scene.add( stars );
				}

				renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				renderer.sortObjects = false;
				renderer.autoClear = false;
				renderer.gammaInput = true;
				renderer.gammaOutput = true; 
				container.append( renderer.domElement );

				window.addEventListener( 'resize', onWindowResize, false );

				// postprocessing
				var renderModel = new THREE.RenderPass( scene, camera );
				var effectFilm = new THREE.FilmPass( 0.35, 0.75, 2048, false );
				effectFilm.renderToScreen = true;
				composer = new THREE.EffectComposer( renderer );
				composer.addPass( renderModel );
				composer.addPass( effectFilm );
			};

			function onWindowResize( event ) {
				SCREEN_HEIGHT = window.innerHeight;
				SCREEN_WIDTH = window.innerWidth;
				renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
				camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
				camera.updateProjectionMatrix();
				composer.reset();
			};

			var animid;

			function animate() {
				
				animid = requestAnimationFrame( animate );
				render();
				controls.update();

			};


			function render() {
				// rotate the planet and clouds
				var delta = clock.getDelta();

				//meshPlanet.rotation.y += rotationSpeed * delta;
				
				meshClouds.rotation.y += 1.25 * rotationSpeed * delta;
				// slow down as we approach the surface
				dPlanet = camera.position.length();
				//controls.movementSpeed = 0.33 * d;
				//controls.update( delta );
				renderer.clear();
				composer.render( delta );
				TWEEN.update();

			};
			

			$(".overlay").on("click", function() {

				var position = { x : meshPlanet.position.x, y: meshPlanet.position.y };
				var positionTarget = { x : 1000, y: -3000 };
				var tweenMove = new TWEEN.Tween(position).to(positionTarget, 2000);
				
				var rotation = { x: 0, y: 0 };
				var rotationTarget = { x: 0, y: 4.6 };
				var tweenRotate = new TWEEN.Tween(rotation).to(rotationTarget, 2000);

				var scalePlanet = new TWEEN.Tween( meshPlanet.scale ).to( {x:2, y: 2, z:2 }, 2000 )
				var scaleClouds = new TWEEN.Tween( meshClouds.scale ).to( {x:2.025, y: 2.025, z:2.025 }, 2000 )

				tweenMove.onUpdate(function(){
				    meshPlanet.position.x = position.x;
				    meshPlanet.position.y = position.y;
				    meshClouds.position.x = position.x;
				    meshClouds.position.y = position.y;
				   	
				});

				tweenRotate.onUpdate(function(){

				   	meshPlanet.rotation.y = rotation.y;
				   	meshClouds.rotation.y = rotation.y;
				   	meshPlanet.rotation.x = rotation.x;
				   	meshClouds.rotation.x = rotation.x;
				   
				});

				tweenMove.start();
				tweenRotate.start();
				scalePlanet.start();
				scaleClouds.start();
				//camera.fov *= -0.1;
				//camera.updateProjectionMatrix();
				//cancelAnimationFrame( animid );

			});

		}

	}
	

	App.Charts = App.Charts || {
		
		build: function() {	

			var barData = {

				labels: ["January", "February", "March", "April", "May", "June", "July"],
				datasets: [
					{
					label: "My First dataset",
					fillColor: "rgba(220,220,220,0.5)",
					strokeColor: "rgba(220,220,220,0.8)",
					highlightFill: "rgba(220,220,220,0.75)",
					highlightStroke: "rgba(220,220,220,1)",
					data: [65, 59, 80, 81, 56, 55, 40]
					},
					{
					label: "My Second dataset",
					fillColor: "rgba(151,187,205,0.5)",
					strokeColor: "rgba(151,187,205,0.8)",
					highlightFill: "rgba(151,187,205,0.75)",
					highlightStroke: "rgba(151,187,205,1)",
					data: [28, 48, 40, 19, 86, 27, 90]
					}
				]
			};

			
			var pieData = [
			    {
			        value: 300,
			        color:"#F7464A",
			        highlight: "#FF5A5E",
			        label: "Red"
			    },
			    {
			        value: 50,
			        color: "#46BFBD",
			        highlight: "#5AD3D1",
			        label: "Green"
			    },
			    {
			        value: 100,
			        color: "#FDB45C",
			        highlight: "#FFC870",
			        label: "Yellow"
			    }
			]


			$(".chart").each(function() {

				var ctx = $(this).get(0).getContext("2d");
				
				if ($(this).hasClass("bar")) {
	
					var myBarChart = new Chart(ctx).Bar(barData, {});

				}

				if ($(this).hasClass("line")) {
	
					var myBarChart = new Chart(ctx).Line(barData, {});

				}
			
				if ($(this).hasClass("pie")) {
	
					var myPieChart = new Chart(ctx).Pie(pieData, {});


					$(this).on("click", function(e) {

						var activePoints = myPieChart.getSegmentsAtEvent(e);
					    
					    //console.log(activePoints[0]);

					    activePoints[0].value = 10;
					    activePoints[0].strokeColor = "#000";
					    myPieChart.update();

					});

				}

				if ($(this).hasClass("doughnut")) {
	
					var myPieChart = new Chart(ctx).Doughnut(pieData, {});

				}
			

			});
			
		}
		

	}


	// Run it!
	$(document).ready(App.init);
	
})( jQuery );