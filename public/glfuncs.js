function create_shader(id, gl) {
    var shader;

    var shaderEle = document.getElementById(id);
    if (!shaderEle) return;
    switch (shaderEle.type) {
        case 'x-shader/v-vertex':
            shader = gl.createShader(gl.VERTEX_SHADER);
            break;

        case 'x-shader/x-fragment':
            shader = gl.createShader(gl.FRAGMENT_SHADER);
            break;

        default:
            return;

    }

    gl.shaderSource(shader, shaderEle.text);

    gl.compileShader(shader);

    return shader;

}

function create_program(vs, fs, gl) {
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    gl.useProgram(program);

    return program;
}

function create_vbo(data, gl) {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vbo;
}
