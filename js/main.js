/*
 * Author: Nuño de la Serna
 * Description: Orthographic lines generator
 */

var Drawer = require('./drawer.js');

module.exports = (function() {
   function App(node_canvas, node_controll) {
      this.setUpControll(node_controll);
      this.drawer = new Drawer(node_canvas);
   }
 
   App.prototype.setUpControll = function(node_controll) {
   }

   return App;

})();
