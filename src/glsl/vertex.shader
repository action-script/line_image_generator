varying vec3 vertexPos;
varying vec2 vertTexCoord;

void main() {
   gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);

   vertexPos = position;
   vertTexCoord = uv;
}
