var THREE = require('../bower_components/three.js/build/three.min.js');

module.exports = (function() {
   function Texture(renderer, width, height, size) {
      renderer.setClearColor( 0x000000, 0);

      var bufferScene = new THREE.Scene();

      var renderTargetParams = {
         minFilter: THREE.LinearFilter,
         magFilter: THREE.NearestFilter,
         format: THREE.RGBAFormat,
         stencilBuffer:false,
         depthBuffer:false
      };
      bufferTexture = new THREE.WebGLRenderTarget(
         width, height, renderTargetParams);


      var camera = new THREE.OrthographicCamera(
         0,
         width,
         0,
         height,
         1, 300
      );
      camera.position.z = 150;

      var material = new THREE.LineBasicMaterial({ 
         color: 0xffffff,
         linewidth: 1 
      });

      for (var y = 0; y < height; y += size*2) {
         for(var i = 0; i < size; i++) {
            var geometry = new THREE.Geometry();

            geometry.vertices.push( new THREE.Vector3(0, y+i, 0) );
            geometry.vertices.push( new THREE.Vector3(width, y+i, 0) );

            var line = new THREE.Line(geometry, material);
            bufferScene.add( line );
         }
      }

      renderer.setSize(width, height);
      renderer.render( bufferScene, camera, bufferTexture, true);

      return bufferTexture;
   }

   return Texture;

})();
