precision mediump float;

void main(void) {
  gl_FragColor =
      vec4(gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z, gl_FragCoord.z);
}
