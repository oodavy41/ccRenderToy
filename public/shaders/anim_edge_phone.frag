precision mediump float;

varying vec4 fpos;
varying vec2 fcoord;
varying vec3 fnormal;

uniform mat3 normalMatrix;

uniform vec4 lightDirection;
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
    gl_FragColor = vec4(0.0,0.0,0.0,1.0);
}
