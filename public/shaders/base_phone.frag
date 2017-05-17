precision mediump float;

varying vec4 fcolor;
varying vec3 fnormal;
varying vec4 fpos;

uniform mat3 normalMatrix;

uniform vec4 lightDirection;
uniform vec3 lightColor;
uniform vec3 cameraPos;



void main(void)
{
    vec3 mvpLD=normalize(lightDirection.xyz);

    //mvp坐标下的顶点法线
    vec3 Mnormal=normalize(normalMatrix*fnormal);
    //反射光线
    vec3 camDir=normalize(cameraPos-vec3(fpos));
    //漫反射光照                      环境光系数 ↓
    float bright=clamp(dot(Mnormal, mvpLD), 0.1,1.0);
    //高光光照                                   镜面次幂 ↓
    float hlight=dot(mvpLD,Mnormal)>0.0?
            pow(max(dot(Mnormal, normalize(mvpLD+camDir)),0.0), 128.0)
            :0.0;//               反射与视线中线 ↑            镜面次幂 ↑
    gl_FragColor = fcolor*vec4(lightColor*bright,1.0)+vec4(hlight*lightColor,1.0);
}
