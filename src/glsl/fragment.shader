#define PI 3.14159265
uniform sampler2D texture;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec3 vertexPos;
varying vec2 vertTexCoord;

void main() {
   vec4 textureLine = texture2D(texture, vertTexCoord.st);
   float depth = ((50.+vertexPos.z)/2.)/70.;

   vec3 color = mix(
      mix(
         color1,
         color3,
         depth*depth*4.
      ),
      color2,
      log(depth*2.) * depth * depth * 4.
   );

   gl_FragColor = vec4(color, textureLine.a);
}
