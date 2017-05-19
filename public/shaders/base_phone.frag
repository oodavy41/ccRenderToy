precision mediump float;

varying vec4 fcolor;
varying vec3 fnormal;
varying vec4 fpos;

uniform mat3 normalMatrix;

uniform vec4 lightDirection;
uniform vec3 lightColor;
uniform vec3 cameraPos;

uniform float metalless;//金属系数
uniform float smoothness;//光滑系数


void main(void)
{
    vec3 albedo=vec3(1.022,0.782,0.344);
    vec3 iron=vec3(255.0,229.0,158.0)/vec3(255.0,255.0,255.0);
    vec4 lcolor=vec4(fcolor.xyz*metalless+iron*(1.0-metalless),1.0);


    vec3 ld=fpos.xyz-lightDirection.xyz;
    vec3 mvpLD=normalize(ld);

    //mvp坐标下的顶点法线
    vec3 Mnormal=normalize(normalMatrix*fnormal);
    //反射光线
    vec3 camDir=normalize(cameraPos-vec3(fpos));
    //漫反射光照                      环境光系数 ↓
    float bright=clamp(dot(Mnormal, mvpLD), 0.1,1.0)*metalless;

    //高光光照                                   镜面次幂 ↓
    float hlight=dot(mvpLD,Mnormal)>0.0?
            pow(max(dot(Mnormal, normalize(mvpLD+camDir)),0.0), smoothness)
            :0.0;//               反射与视线中线 ↑            镜面次幂 ↑

    vec3 specular=vec3(1.0,1.0,1.0)*metalless+albedo*(1.0-metalless);
    gl_FragColor = lcolor*(vec4(lightColor*bright,1.0)+vec4(hlight*lightColor*specular,1.0));
}
