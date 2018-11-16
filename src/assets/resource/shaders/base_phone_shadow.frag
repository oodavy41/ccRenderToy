precision mediump float;

varying vec4 fcolor;
varying vec3 fnormal;
varying vec4 fpos;
varying vec4 flight;

uniform mat3 normalMatrix;

uniform vec4 lightColor;
uniform vec3 cameraPos;

uniform float smoothness; //光滑系数

varying vec4 lpos;
uniform sampler2D shadowMap;

void main(void) {
  vec4 lcolor = vec4(fcolor.xyz, 1.0);
  vec3 lightDirection = flight.w == 0.0 ? flight.xyz : fpos.xyz - flight.xyz;
  vec3 mvpLD = normalize(lightDirection);

  // mvp坐标下的顶点法线
  vec3 Mnormal = normalize(normalMatrix * fnormal);
  //阴影处理
  float underShadow = 0.0;

  vec3 coodFromLight = (lpos.xyz / lpos.w) * 0.5 + 0.5;
  for (float i = -2.0; i < 3.0; i += 1.0) {
    for (float j = -2.0; j < 3.0; j += 1.0) {
      float x = coodFromLight.x;
      float y = coodFromLight.y;
      if (coodFromLight.z >
          (texture2D(shadowMap, vec2(x + i, y + j)).a + 0.005))
        underShadow += 1.0;
    }
  }
  underShadow /= 25.0;
  underShadow = 1.0 - underShadow;
  //反射光线
  vec3 camDir = normalize(cameraPos - vec3(fpos));
  //漫反射光照                      环境光系数 ↓
  float bright = clamp(dot(Mnormal, mvpLD) * underShadow, 0.3, 1.0);

  //高光光照                                                   镜面次幂 ↓
  float hlight =
      (dot(mvpLD, Mnormal) > 0.0
           ? pow(max(dot(Mnormal, normalize(mvpLD + camDir)), 0.0), smoothness)
           : 0.0) *
      underShadow; //                     反射与视线中线 ↑

  vec3 specular = vec3(1.0, 1.0, 1.0);
  vec3 cubecolor = vec3(1.0);

  gl_FragColor = lcolor * vec4(lightColor.xyz * bright +
                                   lightColor.xyz * hlight * specular,
                               lightColor.w);
}
