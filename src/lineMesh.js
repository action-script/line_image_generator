var THREE = require('../bower_components/three.js/build/three.min.js');

module.exports = (function() {
   function LineMesh(w, h, rw, rh) {
//      var cW = Math.floor(w / rw) +1;
//      var cH = Math.floor(h / rh) +1;
      var cW = Math.ceil(w / rw)+1;
      var cH = Math.ceil(h / rh)+1;

      this.geom = new THREE.Geometry();
      var dots = [];

      // add verex data
      for (var y = 0; y < cH; y++) {
         if (dots[y] == undefined)
            dots[y] = [];
         for (var x = 0; x < cW; x++) {
            dots[y][x] = new THREE.Vector3(x*rw, y*rh, 0);
            this.geom.vertices.push(dots[y][x]);
         }
      }

      // face indices
      for (var y = 0; y < dots.length-1; y++) {
         for (var x = 0; x < dots[y].length-1; x++) {
            /* Top triangle 
             * __
             * \ |
             *  \|
             */
            this.geom.faces.push( new THREE.Face3(
               y*cW + x,        // y  , x
               y*cW + x+1,      // y  , x+1
               (y+1)*cW + x+1   // y+1, x+1
            ));
            this.geom.faceVertexUvs[0].push([
               new THREE.Vector2(x/(cW-1), y/(cH-1) ),
               new THREE.Vector2((x+1)/(cW-1), y/(cH-1) ),
               new THREE.Vector2((x+1)/(cW-1), (y+1)/(cH-1) )
            ]);

            /* Bottom triangle
             * |\
             * |_\
             */
            this.geom.faces.push( new THREE.Face3(
               y*cW + x,        // y  , x
               (y+1)*cW + x+1,  // y+1, x+1
               (y+1)*cW + x     // y+1, x
            ));
            this.geom.faceVertexUvs[0].push([
               new THREE.Vector2(x/(cW-1), y/(cH-1) ),
               new THREE.Vector2((x+1)/(cW-1), (y+1)/(cH-1) ),
               new THREE.Vector2(x/(cW-1), (y+1)/(cH-1) )
            ]);
         }
      }

      return this.geom;
   }

   return LineMesh;

})();
