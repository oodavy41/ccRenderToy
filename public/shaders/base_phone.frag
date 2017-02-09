precision mediump float;

varying vec4 fcolor;
varying vec3 fnormal;
varying mat4 fmvp;
varying vec4 fpos;

uniform   vec3 lightdDirection;
uniform   vec3 cameraPos;

uniform   mat4 staticMatrix;

void main(void)
{
    vec3 lightColor=vec3(1.0,1.0,1.0);
    vec3 mvpLD=(vec4(lightdDirection,0.0)*staticMatrix).xyz;

    //mvp坐标下的顶点法线
    vec3 Mnormal=normalize((fmvp*vec4(fnormal,0.0)).xyz);
    //反射光线
    vec3 camDir=normalize(cameraPos-vec3(fpos));
    vec3 reflectDir=normalize(reflect(-mvpLD, Mnormal));
    //漫反射光照                              环境光系数 ↓
    float bright=clamp(dot(Mnormal, mvpLD), 0.1,1.0);
    //高光光照                                   镜面次幂 ↓
    float hlight=pow(max(dot(camDir, reflectDir),0.0), 256.0)*0.5;
    gl_FragColor = fcolor*vec4(lightColor*(bright+hlight),1.0);;
}
