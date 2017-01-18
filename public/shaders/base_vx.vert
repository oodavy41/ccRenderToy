attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform   vec3 lightdDirection;

uniform   mat4 mvpMatrix;
uniform   mat4 staticMatrix;


varying vec4 fcolor;

void main(void){
    vec3 lightD=normalize(staticMatrix*vec4(lightdDirection,0.0)).xyz;
    float bright=clamp(dot(normal, lightD), 0.1,1.0);

    fcolor=color*vec4(vec3(bright),1.0);
    gl_Position = mvpMatrix * vec4(position,1.0);
}
