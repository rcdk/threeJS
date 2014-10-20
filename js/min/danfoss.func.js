!function(a){a.className=a.className.replace("no-js","has-js")}(document.documentElement);var userAgent=navigator.userAgent,device={iPad:userAgent.match(/iPad/),iPhone:userAgent.match(/iPhone/),iPod:userAgent.match(/iPod/),iOS:userAgent.match(/(iPhone|iPod|iPad)/),blackberry:userAgent.match(/BlackBerry/),android:userAgent.match(/Android/),webOS:userAgent.match(/webOS/),wp:userAgent.match(/Windows Phone/)};isMobileDevice=!1,window.App=window.App||{},function(a){App={init:function(){(device.iOS||device.android||device.webOS)&&(isMobileDevice=!0,a("body").addClass("mobile-device")),App.Charts.build(),App.Earth.build()}},App.Night=App.Night||{build:function(){function b(){f=a(".earth"),i=new THREE.Scene,h=new THREE.PerspectiveCamera(40,n/o,1,3e3),h.position.z=4,i.add(h),directionalLight=new THREE.DirectionalLight(11206451,0),directionalLight.position.set(-1,1,.5).normalize(),i.add(directionalLight),g=Date.now(),k={sunDirection:{type:"v3",value:new THREE.Vector3(0,1,0)},dayTexture:{type:"t",value:0,texture:THREE.ImageUtils.loadTexture("../js/textures/planets/textures/earth-day.jpg")},nightTexture:{type:"t",value:1,texture:THREE.ImageUtils.loadTexture("../js/textures/planets/textures/earth-night.jpg")}},k.dayTexture.texture.wrapS=k.dayTexture.texture.wrapT=THREE.Repeat,k.nightTexture.texture.wrapS=k.nightTexture.texture.wrapT=THREE.Repeat;var b=.75;material=new THREE.ShaderMaterial({uniforms:k,vertexShader:document.getElementById("vertexShader").textContent,fragmentShader:document.getElementById("fragmentShader").textContent}),l=new THREE.Mesh(new THREE.SphereGeometry(b,32,16),material),i.add(l),m.push(l),j=new THREE.WebGLRenderer,f.append(j.domElement),c(),window.addEventListener("resize",c,!1)}function c(){j.setSize(window.innerWidth,window.innerHeight)}function d(){requestAnimationFrame(d),e()}function e(){var a=.001*Date.now();k.sunDirection.value.x=Math.sin(a),k.sunDirection.value.y=Math.cos(a);for(var b=0;b<m.length;++b)m[b].rotation.y+=.01*(b%2?1:-1),m[b].rotation.x+=.01*(b%2?-1:1);j.render(i,h)}Detector.webgl||Detector.addGetWebGLMessage();var f,g,h,i,j,k,l,m=[],n=window.innerWidth/2,o=window.innerHeight/2;b(),d()}},App.Three=App.Three||{build:function(){function b(){n.rotation.y+=5e-4,requestAnimationFrame(b),k.render(j,camera);5e-4*Date.now()}function c(a,b){return new THREE.Mesh(new THREE.SphereGeometry(a,b,b),new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture("../images/2_no_clouds_4k.jpg"),bumpMap:THREE.ImageUtils.loadTexture("../images/elev_bump_4k.jpg"),bumpScale:.005,specularMap:THREE.ImageUtils.loadTexture("../images/water_4k.png"),specular:new THREE.Color("grey")}))}function d(a,b){return new THREE.Mesh(new THREE.SphereGeometry(a+.003,b,b),new THREE.MeshPhongMaterial({map:THREE.ImageUtils.loadTexture("../images/fair_clouds_4k.png"),transparent:!0}))}if($webglEl=a("#webgl"),!Detector.webgl)return void Detector.addGetWebGLMessage($webglEl);var e=a(document).width(),f=a(document).height(),g=.5,h=32,i=6,j=new THREE.Scene;camera=new THREE.PerspectiveCamera(45,e/f,.01,1e3),camera.position.z=1.5;var k=new THREE.WebGLRenderer;k.setSize(e,f),j.add(new THREE.AmbientLight(3355443));var l=new THREE.DirectionalLight(16777215,1);l.position.set(5,3,5),j.add(l);var m=c(g,h);m.rotation.y=i,j.add(m);var n=d(g,h);n.rotation.y=i,j.add(n),$webglEl.append(k.domElement),b()},size:function(){var b=a(document).width()-150,c=a(document).height()-150;a(".overlay").width(b).height(c).css("left","0").css("top","0"),camera.fov*=-.8,camera.updateProjectionMatrix()}},App.Earth=App.Earth||{build:function(){function b(){f=a(".earth"),g=new THREE.PerspectiveCamera(25,v/u,50,1e7),g.position.z=5*o,h=new THREE.Scene,h.fog=new THREE.FogExp2(0,2.5e-7);controls=new THREE.OrbitControls(g),controls.addEventListener("change",e),m=new THREE.DirectionalLight(16777215),m.position.set(1,0,1).normalize(),h.add(m),n=new THREE.AmbientLight(0),h.add(n);var b=THREE.ImageUtils.loadTexture("../js/textures/planets/earth_atmos_5400.jpg"),d=THREE.ImageUtils.loadTexture("../js/textures/planets/earth_clouds_2096.png"),q=THREE.ImageUtils.loadTexture("../js/textures/planets/earth_normal_2048.jpg"),t=THREE.ImageUtils.loadTexture("../js/textures/planets/earth_specular_2048.jpg"),w=THREE.ShaderLib.normalmap,x=THREE.UniformsUtils.clone(w.uniforms);x.tNormal.value=q,x.uNormalScale.value.set(.85,.85),x.tDiffuse.value=b,x.tSpecular.value=t,x.enableAO.value=!1,x.enableDiffuse.value=!0,x.enableSpecular.value=!0,x.diffuse.value.setHex(16777215),x.specular.value.setHex(3355443),x.ambient.value.setHex(0),x.shininess.value=15;var y={fragmentShader:w.fragmentShader,vertexShader:w.vertexShader,uniforms:x,lights:!0,fog:!0},z=new THREE.ShaderMaterial(y);j=new THREE.SphereGeometry(o,100,50),j.computeTangents(),k=new THREE.Mesh(j,z),k.rotation.y=0,k.rotation.z=p,h.add(k);var A=new THREE.MeshLambertMaterial({color:16777215,map:d,transparent:!0});l=new THREE.Mesh(j,A),l.scale.set(r,r,r),l.rotation.z=p,h.add(l);var B,C=o,D=[new THREE.Geometry,new THREE.Geometry];for(B=0;250>B;B++){var E=new THREE.Vector3;E.x=2*Math.random()-1,E.y=2*Math.random()-1,E.z=2*Math.random()-1,E.multiplyScalar(C),D[0].vertices.push(E)}for(B=0;1500>B;B++){var E=new THREE.Vector3;E.x=2*Math.random()-1,E.y=2*Math.random()-1,E.z=2*Math.random()-1,E.multiplyScalar(C),D[1].vertices.push(E)}var F,G=[new THREE.PointCloudMaterial({color:5592405,size:2,sizeAttenuation:!1}),new THREE.PointCloudMaterial({color:5592405,size:1,sizeAttenuation:!1}),new THREE.PointCloudMaterial({color:3355443,size:2,sizeAttenuation:!1}),new THREE.PointCloudMaterial({color:3815994,size:1,sizeAttenuation:!1}),new THREE.PointCloudMaterial({color:1710618,size:2,sizeAttenuation:!1}),new THREE.PointCloudMaterial({color:1710618,size:1,sizeAttenuation:!1})];for(B=10;30>B;B++)F=new THREE.PointCloud(D[B%2],G[B%6]),F.rotation.x=6*Math.random(),F.rotation.y=6*Math.random(),F.rotation.z=6*Math.random(),s=10*B,F.scale.set(s,s,s),F.matrixAutoUpdate=!1,F.updateMatrix(),h.add(F);i=new THREE.WebGLRenderer({antialias:!0,alpha:!0}),i.setSize(v,u),i.sortObjects=!1,i.autoClear=!1,i.gammaInput=!0,i.gammaOutput=!0,f.append(i.domElement),window.addEventListener("resize",c,!1);var H=new THREE.RenderPass(h,g),I=new THREE.FilmPass(.35,.75,2048,!1);I.renderToScreen=!0,composer=new THREE.EffectComposer(i),composer.addPass(H),composer.addPass(I)}function c(){u=window.innerHeight,v=window.innerWidth,i.setSize(v,u),g.aspect=v/u,g.updateProjectionMatrix(),composer.reset()}function d(){y=requestAnimationFrame(d),e(),controls.update()}function e(){var a=x.getDelta();l.rotation.y+=1.25*q*a,w=g.position.length(),i.clear(),composer.render(a),TWEEN.update()}Detector.webgl||Detector.addGetWebGLMessage();var f,g,h,i,j,k,l,m,n,o=6371,p=-.47,q=.01,r=1.005,t=0,u=window.innerHeight-2*t,v=window.innerWidth,w=new THREE.Vector3,x=new THREE.Clock;b(),d();var y;a(".overlay").on("click",function(){var a={x:k.position.x,y:k.position.y},b={x:1e3,y:-3e3},c=new TWEEN.Tween(a).to(b,2e3),d={x:0,y:0},e={x:0,y:4.6},f=new TWEEN.Tween(d).to(e,2e3),g=new TWEEN.Tween(k.scale).to({x:2,y:2,z:2},2e3),h=new TWEEN.Tween(l.scale).to({x:2.025,y:2.025,z:2.025},2e3);c.onUpdate(function(){k.position.x=a.x,k.position.y=a.y,l.position.x=a.x,l.position.y=a.y}),f.onUpdate(function(){k.rotation.y=d.y,l.rotation.y=d.y,k.rotation.x=d.x,l.rotation.x=d.x}),c.start(),f.start(),g.start(),h.start()})}},App.Charts=App.Charts||{build:function(){var b={labels:["January","February","March","April","May","June","July"],datasets:[{label:"My First dataset",fillColor:"rgba(220,220,220,0.5)",strokeColor:"rgba(220,220,220,0.8)",highlightFill:"rgba(220,220,220,0.75)",highlightStroke:"rgba(220,220,220,1)",data:[65,59,80,81,56,55,40]},{label:"My Second dataset",fillColor:"rgba(151,187,205,0.5)",strokeColor:"rgba(151,187,205,0.8)",highlightFill:"rgba(151,187,205,0.75)",highlightStroke:"rgba(151,187,205,1)",data:[28,48,40,19,86,27,90]}]},c=[{value:300,color:"#F7464A",highlight:"#FF5A5E",label:"Red"},{value:50,color:"#46BFBD",highlight:"#5AD3D1",label:"Green"},{value:100,color:"#FDB45C",highlight:"#FFC870",label:"Yellow"}];a(".chart").each(function(){var d=a(this).get(0).getContext("2d");if(a(this).hasClass("bar")){new Chart(d).Bar(b,{})}if(a(this).hasClass("line")){new Chart(d).Line(b,{})}if(a(this).hasClass("pie")){var e=new Chart(d).Pie(c,{});a(this).on("click",function(a){var b=e.getSegmentsAtEvent(a);b[0].value=10,b[0].strokeColor="#000",e.update()})}if(a(this).hasClass("doughnut"))var e=new Chart(d).Doughnut(c,{})})}},a(document).ready(App.init)}(jQuery);
//# sourceMappingURL=danfoss.func.js.map