precision mediump float;

varying vec4 fcolor;
varying vec3 fnormal;
varying vec4 fpos;

uniform mat3 normalMatrix;

uniform vec3 lightDirection;
uniform vec4 lightColor;
uniform vec3 cameraPos;

uniform float metalless;  //金属系数
uniform float smoothness; //光滑系数

uniform bool usetex;
uniform samplerCube tex;

uniform bool shadow;
varying vec4 lpos;
uniform sampler2D shadowMap;

void main(void) {
  vec3 albedo = vec3(1.022, 0.782, 0.344);
  vec3 iron = vec3(255.0, 229.0, 158.0) / vec3(255.0, 255.0, 255.0);
  vec4 lcolor = vec4(fcolor.xyz * metalless + iron * (1.0 - metalless), 1.0);

  vec3 mvpLD = normalize(lightDirection);

  // mvp坐标下的顶点法线
  vec3 Mnormal = normalize(normalMatrix * fnormal);

  //反射光线
  vec3 camDir = normalize(cameraPos - vec3(fpos));
  //漫反射光照                      环境光系数 ↓
  float bright = clamp(dot(Mnormal, mvpLD), 0.3, 1.0) * metalless;

  //阴影处理
  bool underShadow = false;
  if (shadow) {
    vec3 coodFromLight = (lpos.xyz / lpos.w) * 0.5 + 0.5;
    underShadow =
        coodFromLight.z > (texture2D(shadowMap, coodFromLight.xy).a + 0.005);
  }
  //高光光照                                   镜面次幂 ↓
  float hlight =
      dot(mvpLD, Mnormal) > 0.0 && !underShadow
          ? pow(max(dot(Mnormal, normalize(mvpLD + camDir)), 0.0), smoothness)
          : 0.0; //               反射与视线中线 ↑            镜面次幂 ↑

  vec3 specular = vec3(1.0, 1.0, 1.0) * metalless + albedo * (1.0 - metalless);
  if (usetex) {
    vec3 ref = reflect(camDir, Mnormal);
    float cuberef = 8.0 / (smoothness * (1.0 - metalless) + 0.1);
    vec3 cubecolor = textureCube(tex, ref).xyz * max(1.0 - cuberef, 0.0) +
                     vec3(min(cuberef, 1.0));

    gl_FragColor =
        vec4(cubecolor, 1.0) * lcolor *
        vec4(lightColor.xyz * bright + lightColor.xyz * hlight * specular,
             lightColor.w);
  } else {
    gl_FragColor = lcolor * vec4(lightColor.xyz * bright +
                                     lightColor.xyz * hlight * specular,
                                 lightColor.w);
  }
}
