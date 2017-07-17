attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix;


varying vec4 fcolor;
varying vec3 fnormal;
varying mat4 fmvp;
varying vec4 fpos;

void main(void){
    fpos = modelMatrix* vec4(position,1.0);
    gl_Position = mvpMatrix * fpos;
    fcolor=color;
    fnormal=normal;
}
