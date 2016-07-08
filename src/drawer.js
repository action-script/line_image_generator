var THREE = require('../bower_components/three.js/build/three.min.js');
window.THREE = THREE;
var EffectComposer = require('../node_modules/three-effectcomposer/index.js')(THREE);
var fxaa = require('../node_modules/three-shader-fxaa/build/index.js');

var LineMesh = require('./lineMesh.js');
var Texture = require('./texture.js');
var NoiseMove = require('./noise.js');
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
         antialias: true,
         preserveDrawingBuffer: true
      });
      this.renderer.setSize( window.innerWidth, window.innerHeight);
      node_canvas.appendChild( this.renderer.domElement );
   };

   Drawer.prototype.setUpScene = function() {
      this.scene = new THREE.Scene();

      this.camera = new THREE.OrthographicCamera(
         window.innerWidth / -2,
         window.innerWidth / 2,
         window.innerHeight / 2,
         window.innerHeight / -2,
         1, 3000
      );

      this.camera.position.z = 1000;

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

   Drawer.prototype.createMaterial = function(meshSize) {
      var line_texture = new Texture(
         this.renderer,
         meshSize.width,
         meshSize.height,
         this.config.line_size
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

      var meshSize = {
         width: Math.ceil(this.config.width / this.config.chunk) * this.config.chunk,
         height: Math.ceil(this.config.height / this.config.chunk) * this.config.chunk
      }

      this.noise_dost = new NoiseMove(
         meshSize.width, meshSize.height, this.config.chunk
      );

      var material = this.createMaterial(meshSize);

      var geometry = new LineMesh(
         meshSize.width,
         meshSize.height,
         this.config.chunk, this.config.chunk
      );
      this.lineMesh = new THREE.Mesh( geometry, material );
      this.lineMesh.material.transparent = true;
      this.lineMesh.name = this.config.name;

      this.lineMesh.geometry.applyMatrix(
         new THREE.Matrix4().makeTranslation(
            -(meshSize.width/2), -(meshSize.height/2), 0
         )
      );

      this.scene.add(this.lineMesh);
   };

   Drawer.prototype.updateVertex = function() {
      var noise_factor = this.config.noise_factor / 100;
      var noise_speed = this.config.noise_speed / 100;
      for (var y = 0; y < this.noise_dost.length; y++) {
         for (var x = 0; x < this.noise_dost[y].length; x++) {
            var i = y*this.noise_dost[y].length + x;
            this.lineMesh.geometry.vertices[i].x += 
               (-0.5 + Math.noise(this.noise_dost[y][x].x)) * noise_factor;
            this.lineMesh.geometry.vertices[i].y += 
               (-0.5 + Math.noise(this.noise_dost[y][x].y)) * noise_factor;
            this.lineMesh.geometry.vertices[i].z += 
               (-0.5 + Math.noise(this.noise_dost[y][x].z)) * noise_factor;

            this.noise_dost[y][x].x += noise_speed;
            this.noise_dost[y][x].y += noise_speed;
            this.noise_dost[y][x].z += noise_speed;
         }
      }
      this.lineMesh.geometry.verticesNeedUpdate = true;
   };

   Drawer.prototype.setUpRenderDraw = function() {
      this.renderDraw = (function() {
         // render scene
         this.updateVertex();
         this.lineMesh.rotation.z = this.config.rotationz * Math.PI/180;
         this.lineMesh.rotation.x = -this.config.rotationx/20.0 - Math.sin(this.lineMesh.rotation.z)*0.2;

         this.lineMesh.material.uniforms.color1.value = new THREE.Color(this.config.color1);
         this.lineMesh.material.uniforms.color2.value = new THREE.Color(this.config.color2);
         this.lineMesh.material.uniforms.color3.value = new THREE.Color(this.config.color3);


         this.renderer.setClearColor( this.config.bg );
         this.renderer.setSize(
            window.innerWidth, window.innerHeight
         );

//         this.renderer.render( this.scene, this.camera );
         requestAnimationFrame( this.renderDraw );
         this.effectComposer.render();
/*
         if (this.config.saveImage) {
            this.config.saveImage = false;
            setTimeout((function() {
               this.getImage();
               requestAnimationFrame( this.renderDraw );
            }).bind(this), 100);
         }
         else
            requestAnimationFrame( this.renderDraw );
*/
      }).bind(this);

      this.renderDraw();
   };

   Drawer.prototype.getImage = function() {
      var imgData, imgNode;
      try {
         imgData = this.renderer.domElement.toDataURL();      
         console.log(imgData);
      } 
      catch(e) {
         console.log("Browser does not support taking screenshot of 3d context");
         return;
      }

      imgNode = document.createElement("img");
      imgNode.src = imgData;
      document.body.appendChild(imgNode);
   }

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
