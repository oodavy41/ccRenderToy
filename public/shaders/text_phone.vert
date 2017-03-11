attribute vec3 position;
attribute vec2 coord;
attribute vec3 normal;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix;


varying vec4 fpos;
varying vec2 fcoord;
varying vec3 fnormal;
varying mat4 fmm;

void main(void){
    fpos = modelMatrix* vec4(position,1.0);
    gl_Position = mvpMatrix * fpos;
    fcoord=coord;
    fnormal=normal;
    //添加正规矩阵，防止非等比缩放导致的法线畸变
    fmm=transpose(inverse(modelMatrix))*modelMatrix;
}
