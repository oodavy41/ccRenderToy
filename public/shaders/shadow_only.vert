attribute vec3 position;

uniform mat4 mvpMatrix;
uniform mat4 modelMatrix;



void main(void){
    fpos = modelMatrix* vec4(position,1.0);
    gl_Position = mvpMatrix * fpos;
}
