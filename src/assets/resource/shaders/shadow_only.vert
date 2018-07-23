attribute vec3 position;

uniform mat4 mvpMatrix_light;
uniform mat4 modelMatrix_light;



void main(void){
    fpos = modelMatrix* vec4(position,1.0);
    gl_Position = mvpMatrix * fpos;
}
