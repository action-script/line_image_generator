/*
 * Author: Nuño de la Serna
 * Description: Orthographic lines generator
 */

var Drawer = require('./drawer.js');
var Config = require('./config.js');
var dat = require("exports?dat!../bower_components/dat-gui/build/dat.gui.min.js")

module.exports = (function() {
   function App(node_canvas, node_controll) {
      this.config = new Config();
      this.config.canvas = node_canvas;
      this.config.controll = node_controll;

      this.setUpControll();
      this.drawer = new Drawer(this.config);
   }
 
   App.prototype.setUpControll = function() {
      if (this.config.controll == null || this.config.controll == undefined)
         throw 'not controll node defined';

      var gui = new dat.GUI({ autoPlace: false });
      this.config.controll.appendChild(gui.domElement);

      var f1 = gui.addFolder('lines');
      var widthControll = f1.add(this.config, 'width', 200, 1800).step(10).listen();
      var heightControll = f1.add(this.config, 'height', 200, 1800).step(10).listen();
      var sizeControll = f1.add(this.config, 'lineSize', { small: 1, medium: 2, large: 4, huge: 6}).name('size');
      var chunkControll = f1.add(this.config, 'chunk', 20, 200).step(10);

      var f2 = gui.addFolder('colors');
      f2.addColor(this.config, 'bg').name('background').listen();
      f2.addColor(this.config, 'color1').name('color A').listen();
      f2.addColor(this.config, 'color2').name('color B').listen();
      f2.addColor(this.config, 'color3').name('color C').listen();


      var f3 = gui.addFolder('animation');
      f3.add(this.config, 'rotationSpeed', -10, 10).name('spin').listen();
      f3.add(this.config, 'rotationx', -10, 10).name('tilt').listen();


      widthControll.onChange((function(value) {
         this.drawer.createLineMesh();  
      }).bind(this));

      heightControll.onChange((function(value) {
         this.drawer.createLineMesh();  
      }).bind(this));

      sizeControll.onChange((function(value) {
         this.drawer.createLineMesh();  
      }).bind(this));

      chunkControll.onChange((function(value) {
         this.drawer.createLineMesh();  
      }).bind(this));

      f1.open();
      f2.open();

   }

   return App;

})();
