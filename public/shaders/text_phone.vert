attribute vec3 position;
attribute vec4 coord;
attribute vec3 normal;

uniform mat4 mvpMatrix;


varying vec4 fcoord;
varying vec3 fnormal;
varying mat4 fmvp;
varying vec4 fpos;

void main(void){
    gl_Position = mvpMatrix * vec4(position,1.0);
    fcoord=coord;
    fnormal=normal;
    fmvp=mvpMatrix;
    fpos=gl_Position;
}
