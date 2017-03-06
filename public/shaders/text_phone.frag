precision mediump float;

varying vec4 fcoord;
varying vec3 fnormal;
varying mat4 fmm;
varying vec4 fpos;



uniform vec3 lightdDirection;
uniform vec3 lightColor;
uniform vec3 cameraPos;

uniform 


uniform bool usetex;
uniform sampler2D tex;

void main(void)
{
    vec3 mvpLD=(vec4(lightdDirection,0.0)).xyz;

    //漫反射光照                        环境光系数 ↓
    float bright=clamp(dot(Mnormal, mvpLD), 0.1,1.0);

    //mvp坐标下的顶点法线
    vec3 Mnormal=normalize((fmm*vec4(fnormal,0.0)).xyz);
    //反射光线
    vec3 camDir=normalize(cameraPos-vec3(fpos));
    vec3 reflectDir=normalize(reflect(-mvpLD, Mnormal));
    //高光光照                                   镜面次幂 ↓
    float hlight=pow(max(dot(camDir, reflectDir),0.0), 256.0);

    vec4 fcolor=usetex?texture2D(tex,vec2(fcoord.s,fcoord.t)):vec4(1,1,1,1);
    gl_FragColor = fcolor*vec4(lightColor*(bright+hlight),1.0);;
}
