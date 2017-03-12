function initgl(id) {
    var glc = document.getElementById(id);
    var gl = glc.getContext('webgl');

    if (!gl) {
        alert('no support for Webgl in this browser\nWEBGL无法在此浏览器初始化');
        return;
    }
    return gl;
}

function glclear(gl) {
    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


function create_shader(path, gl, type) {
    var shader;
    var shaderSRC = loadFile(path);
    shader = gl.createShader(type);
    gl.shaderSource(shader, shaderSRC);

    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;
    else
        console.log(type.toString() + ":" + gl.getShaderInfoLog(shader));
}

function create_program(vs, fs, gl) {
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    } else
        console.log('pro:' + gl.getProgramInfoLog(program));

}

function create_vbo(data, gl) {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

function create_ibo(data, gl) {
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}

function loadFile(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    if (xhr.status == 200)
        return xhr.responseText;
    else
        console.log("no such file:" + path);

}

function makeMvp(view3v, pers4f) {
    var mMat = mat4.create();
    var vMat = mat4.create();
    var pMat = mat4.create();
    var mvp = mat4.create();

    mat4.lookAt(vMat, view3v[0], view3v[1], view3v[2]);

    mat4.perspective(pMat, pers4f[0], pers4f[1], pers4f[2], pers4f[3]);

    mat4.multiply(mvp, pMat, vMat);
    mat4.multiply(mvp, mvp, mMat);
    return mvp;
}

function upload_array_att(array, att_name, program, gl, vap_argus) {
    var att = gl.getAttribLocation(program, att_name);
    var vbo = create_vbo(array, gl);
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(att);
    gl.vertexAttribPointer(att,
        vap_argus[0], vap_argus[1], vap_argus[2], vap_argus[3], vap_argus[4]);
    return {
        'att': att,
        'vbo': vbo
    };
}

function static_uni(arr, smvp) {
    var ret = vec4.fromValues(arr[0], arr[1], arr[2], arr[3]);
    vec4.transformMat4(ret, ret, smvp);
    ret = [ret[0], ret[1], ret[2]];
    return ret;
}

function create_texture(src, gl) {
    var img = new Image();
    var texture;
    img.onload = function() {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };
    img.src = src;
    return {
        'img': img,
        'tex': texture
    };
}
