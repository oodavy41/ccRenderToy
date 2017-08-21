"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gl_matrix_1 = require("gl-matrix");
function initgl(id) {
    var glc = document.getElementById(id);
    var gl = glc.getContext('webgl');
    if (!gl) {
        alert('no support for Webgl in this browser\nWEBGL无法在此浏览器初始化');
        return;
    }
    gl.clearColor(0.3, 0.3, 0.3, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.depthFunc(gl.LEQUAL);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    return gl;
}
exports.initgl = initgl;
function glclear(gl) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
exports.glclear = glclear;
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
exports.create_shader = create_shader;
function create_program(vs, fs, gl) {
    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    }
    else
        console.log('pro:' + gl.getProgramInfoLog(program));
}
exports.create_program = create_program;
function create_vbo(data, gl) {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}
exports.create_vbo = create_vbo;
function create_ibo(data, gl) {
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}
exports.create_ibo = create_ibo;
function loadFile(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    if (xhr.status == 200)
        return xhr.responseText;
    else
        console.log("no such file:" + path);
}
exports.loadFile = loadFile;
function makeMvp(view3v, pers4f) {
    var mMat = gl_matrix_1.mat4.create();
    var vMat = gl_matrix_1.mat4.create();
    var pMat = gl_matrix_1.mat4.create();
    var mvp = gl_matrix_1.mat4.create();
    gl_matrix_1.mat4.lookAt(vMat, view3v[0], view3v[1], view3v[2]);
    gl_matrix_1.mat4.perspective(pMat, pers4f[0], pers4f[1], pers4f[2], pers4f[3]);
    gl_matrix_1.mat4.multiply(mvp, pMat, vMat);
    gl_matrix_1.mat4.multiply(mvp, mvp, mMat);
    return mvp;
}
exports.makeMvp = makeMvp;
function upload_array_att(array, att_name, program, gl) {
    var att = gl.getAttribLocation(program, att_name);
    if (att === -1) {
        console.log('no attribute called:' + att_name);
        return null;
    }
    var vbo = create_vbo(array, gl);
    gl.enableVertexAttribArray(att);
    return {
        'att': att,
        'vbo': vbo
    };
}
exports.upload_array_att = upload_array_att;
// export function static_uni(arr:number[], smvp:mat4) {
//     var ret = vec4.create();
//     vec4.transformMat4(ret, arr, smvp);
//     return [ret[0], ret[1], ret[2]];
// }
function create_texture(src, gl) {
    var img = new Image();
    var texture;
    img.onload = function () {
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
exports.create_texture = create_texture;
function set_obj_info(obj, fun) {
    for (var tran in obj) {
        fun(obj[tran]);
    }
}
exports.set_obj_info = set_obj_info;
function rewrite_edraw(obj, fun) {
    for (var tran in obj) {
        obj[tran].earlydraw = fun;
    }
}
exports.rewrite_edraw = rewrite_edraw;
function rewrite_ldraw(obj, fun) {
    for (var tran in obj) {
        obj[tran].latedraw = fun;
    }
}
exports.rewrite_ldraw = rewrite_ldraw;
