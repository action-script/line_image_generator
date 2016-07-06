var THREE = require('../bower_components/three.js/build/three.min.js');
var LineMesh = require('./lineMesh.js');

module.exports = (function() {
   function Drawer(node_canvas) {
      try {
         this.setUpCanvas(node_canvas);
         this.setUpScene();
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
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      node_canvas.appendChild( this.renderer.domElement );
   };

   Drawer.prototype.setUpScene = function() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(
         window.innerWidth / - 2,
         window.innerWidth / 2,
         window.innerHeight / 2,
         window.innerHeight / - 2,
         1, 2000
      );
 //     this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
      this.camera.position.z = 700;
      
      var material = new THREE.MeshBasicMaterial({
         map: this.getTexture()
      });
      var geometry = new LineMesh(500, 650, 50, 50);
      this.lineMesh = new THREE.Mesh( geometry, material );
      this.lineMesh.geometry.applyMatrix(
         new THREE.Matrix4().makeTranslation( -250, -325, 0 )
      );

      this.scene.add(this.lineMesh);
   };

   Drawer.prototype.updateVertex = function() {
//      this.lineMesh.geometry.vertices[ 90 ].x = Math.random()*200;
//      this.lineMesh.geometry.verticesNeedUpdate = true;
   };

   Drawer.prototype.getTexture = function() {
      // load a texture, set wrap mode to repeat
      var texture = new THREE.TextureLoader().load( "img2.jpg" );
//      texture.wrapS = THREE.RepeatWrapping;
//      texture.wrapT = THREE.RepeatWrapping;
//      texture.repeat.set( 4, 4 );
      return texture;
   };

   Drawer.prototype.setUpRenderDraw = function() {
      this.renderDraw = (function() {
         this.updateVertex();
         this.lineMesh.rotation.z += 0.001;
         this.lineMesh.rotation.x = Math.sin(this.lineMesh.rotation.z)*0.8;
         requestAnimationFrame( this.renderDraw );
         this.renderer.render( this.scene, this.camera );
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
   };

   return Drawer;

})();
