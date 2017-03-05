attribute vec3 position;
attribute vec4 coord;
attribute vec3 normal;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix


varying vec4 fcoord;
varying vec3 fnormal;
varying mat4 fmvp;
varying mat4 fmm;
varying vec4 fpos;

void main(void){
    gl_Position = mvpMatrix * modelMatrix* vec4(position,1.0);
    fcoord=coord;
    fnormal=normal;
    fmvp=mvpMatrix;
    fmm=modelMatrix;
    fpos=gl_Position;
}
