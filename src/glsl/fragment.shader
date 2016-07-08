#define PI 3.14159265
uniform sampler2D texture;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec3 vertexPos;
varying vec2 vertTexCoord;

void main() {
   vec4 textureLine = texture2D(texture, vertTexCoord.st);
   float depth = clamp(0., 1., (abs(vertexPos.z))/90. );

   vec3 color = mix(
      mix(
         color1,
         color2,
         clamp(0., 1., depth*depth*4.)
      ),
      color3,
      clamp(0., 1., log(depth*2.) * depth * depth * 3.5)
   );

   gl_FragColor = vec4(color, textureLine.a);

/*
gl_FragColor = vec4(
      textureLine.r * log2(depth*3.)/2.,
      textureLine.g * sin(depth * PI)/(depth*3.),
      textureLine.b * sin(depth * PI)/1.1,
      textureLine.a
   );
*/
}
