precision mediump float;

varying vec4 fcoord;
varying vec3 fnormal;
varying mat4 fmm;
varying vec4 fpos;



uniform vec3 lightdDirection;
uniform vec3 lightColor;
uniform vec3 cameraPos;


uniform vec3 ambient;
uniform vec3 diffuse;
uniform vec3 specular;
uniform float powup;


uniform bool usetex;
uniform sampler2D tex;

void main(void)
{
    vec3 mvpLD=lightdDirection;

    //法线
    vec3 Mnormal=normalize((fmm*vec4(fnormal,0.0)).xyz);

    //漫反射光照                        环境光系数 ↓
    float bright=clamp(dot(Mnormal, mvpLD),0.0,1.0);

    //反射光线
    vec3 camDir=normalize(cameraPos-vec3(fpos));
    vec3 reflectDir=normalize(-mvpLD+camDir);
    //高光光照                                   镜面次幂 ↓
    float hlight=pow(max(dot(Mnormal, reflectDir),0.0), powup);

    vec4 color=usetex?
        texture2D(tex,vec2(fcoord.s,fcoord.t)):vec4(1,1,1,1);
    gl_FragColor = color*vec4(lightColor*diffuse*bright),1.0)+vec4(specular*hlight),1.0)+vec4(ambient,1.0);
}
