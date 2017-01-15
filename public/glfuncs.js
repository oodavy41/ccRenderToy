function initgl(id) {
    var glc = document.getElementById('wobaglccc');
    var gl = glc.getContext('webgl');

    if (!gl) {
        alert('no support for Webgl in this browser\nWEBGL无法在此浏览器初始化');
        return;
    }

    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return gl;
}


function create_shader(path, gl, type) {
    var shader;

    gl.shaderSource(shader, loadFile(path));

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

function loadFile(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    if (xhr.status == 200)
        return xhr.responseText;
    else
        alert("no shader");

}
