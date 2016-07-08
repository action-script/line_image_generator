var THREE = require('../bower_components/three.js/build/three.min.js');
window.THREE = THREE;
var EffectComposer = require('../node_modules/three-effectcomposer/index.js')(THREE);
var fxaa = require('../node_modules/three-shader-fxaa/build/index.js');

var LineMesh = require('./lineMesh.js');
var Texture = require('./texture.js');
var shaders = {};

shaders.vertex = require('raw!./glsl/vertex.shader');
shaders.fragment = require('raw!./glsl/fragment.shader');

module.exports = (function() {
   function Drawer(config) {
      this.config = config;
      try {
         this.setUpCanvas(this.config.canvas);
         this.setUpScene();
         this.createLineMesh();
         this.setUpRenderDraw();
      } catch (e) {
         console.error('Can not initialize Drawer', e);
      }

      window.addEventListener("resize", (function() {
         this.resize(window.innerWidth, window.innerHeight);
      }).bind(this));
   }    

   Drawer.prototype.setUpCanvas = function(node_canvas) {
      if (node_canvas == null || node_canvas == undefined)
         throw 'Fail on canvas';
      this.renderer = new THREE.WebGLRenderer({
         alpha: true,
         antialias: true
      });
      this.renderer.setSize( window.innerWidth, window.innerHeight);
      node_canvas.appendChild( this.renderer.domElement );
   };

   Drawer.prototype.setUpScene = function() {
/*
      this.screenScene = new THREE.Scene();

      this.screenRenderTargetParams = {
         minFilter: THREE.LinearFilter,
         magFilter: THREE.NearestFilter,
         format: THREE.RGBFormat,
         stencilBuffer:false,
         depthBuffer:false
      };

      this.screenBufferTexture = new THREE.WebGLRenderTarget(
         window.innerWidth*2, window.innerHeight*2, 
         this.screenRenderTargetParams);

      var screenMaterial = new THREE.MeshBasicMaterial({
         map: this.screenBufferTexture.texture 
      });

      this.plane = new THREE.Mesh(
         new THREE.PlaneGeometry(window.innerWidth,window.innerHeight),
         screenMaterial
      );

      this.screenScene.add(this.plane);
*/

      this.scene = new THREE.Scene();

      this.camera = new THREE.OrthographicCamera(
         window.innerWidth / -2,
         window.innerWidth / 2,
         window.innerHeight / 2,
         window.innerHeight / -2,
         1, 2000
      );

      this.camera.position.z = 700;

      // FXAA
      this.effectComposer = new EffectComposer(this.renderer);
      this.effectComposer.addPass(
         new EffectComposer.RenderPass(this.scene, this.camera)
      );

      this.shaderPass = new EffectComposer.ShaderPass(fxaa());
      this.shaderPass.renderToScreen = true
      this.effectComposer.addPass(this.shaderPass);

      this.shaderPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
   };

   Drawer.prototype.createMaterial = function() {
      var line_texture = new Texture(
         this.renderer,
         this.config.width,
         this.config.height,
         this.config.lineSize
      ).texture

      var uniforms = {
         texture: { type: 't', value: line_texture },
         color1: { type: "c", value: new THREE.Color(this.config.color1) },
         color2: { type: "c", value: new THREE.Color(this.config.color2) },
         color3: { type: "c", value: new THREE.Color(this.config.color3) }
      };

      var material = new THREE.ShaderMaterial({
         uniforms: uniforms,
         vertexShader: shaders.vertex,
         fragmentShader: shaders.fragment
      });

      return material;
   }

   Drawer.prototype.createLineMesh = function() {
      var selectedObject = this.scene.getObjectByName(this.config.name);
      this.scene.remove( selectedObject );

      var material = this.createMaterial();

      var geometry = new LineMesh(
         this.config.width,
         this.config.height,
         this.config.chunk, this.config.chunk
      );
      this.lineMesh = new THREE.Mesh( geometry, material );
      this.lineMesh.material.transparent = true;
      this.lineMesh.name = this.config.name;
      this.lineMesh.geometry.applyMatrix(
         new THREE.Matrix4().makeTranslation(
            -(this.config.width/2), -(this.config.height/2), 0
         )
      );

      this.scene.add(this.lineMesh);
   };

   Drawer.prototype.updateVertex = function() {
//      this.lineMesh.geometry.vertices[ 90 ].x = Math.random()*200;
//      this.lineMesh.geometry.verticesNeedUpdate = true;
   };

   Drawer.prototype.setUpRenderDraw = function() {
      this.renderDraw = (function() {
         // render scene
         this.updateVertex();
         this.lineMesh.rotation.z += this.config.rotationSpeed / 2000.0;
         this.lineMesh.rotation.x = -this.config.rotationx/20.0 - Math.sin(this.lineMesh.rotation.z)*0.2;

         this.lineMesh.material.uniforms.color1.value = new THREE.Color(this.config.color1);
         this.lineMesh.material.uniforms.color2.value = new THREE.Color(this.config.color2);
         this.lineMesh.material.uniforms.color3.value = new THREE.Color(this.config.color3);


         this.renderer.setClearColor( this.config.bg );

         requestAnimationFrame( this.renderDraw );
         this.effectComposer.render();
/*
         // render screen scene
         this.renderer.setSize(
            window.innerWidth, window.innerHeight
         );

         this.renderer.setClearColor( 0x00ff00 );
         this.renderer.render( this.screenScene, this.camera );
*/
      }).bind(this);

      this.renderDraw();
   };

   Drawer.prototype.resize = function(width, height) {
      this.camera.left = width / -2;
      this.camera.right = width / 2; 
      this.camera.top = height / 2;
      this.camera.bottom = height / -2;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( width, height );

      this.shaderPass.uniforms.resolution.value.set(width, height);
//      this.screenBufferTexture.setSize(width*2, height*2);
//      this.plane.geometry = new THREE.PlaneGeometry(width, height);
   };

   return Drawer;

})();
