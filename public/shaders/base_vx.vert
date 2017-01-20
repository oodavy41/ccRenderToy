attribute vec3 position;
attribute vec4 color;
attribute vec3 normal;

uniform   vec3 lightdDirection;
uniform   vec3 cameraPos;

uniform   mat4 mvpMatrix;
uniform   mat4 staticMatrix;


varying vec4 fcolor;

void main(void){
    gl_Position = mvpMatrix * vec4(position,1.0);

    //mvp坐标下的顶点法线
    vec3 Mnormal=normalize((mvpMatrix*vec4(normal,0.0)).xyz);
    //反射光线
    vec3 camDir=normalize(cameraPos-vec3(gl_Position));
    vec3 reflectDir=normalize(reflect(-lightdDirection, Mnormal));
    //漫反射光照                              环境光系数 ↓
    float bright=clamp(dot(Mnormal, lightdDirection), 0.1,1.0);
    //高光光照                                   镜面次幂 ↓
    float hlight=pow(max(dot(camDir, reflectDir),0.0), 16.0)*0.5;

    fcolor=color*vec4(vec3(bright+hlight)*0.6667,1.0);
}
