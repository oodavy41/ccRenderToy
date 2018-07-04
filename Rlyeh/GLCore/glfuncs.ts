
import { Transform } from '../object/Transform';
import { mat4 } from 'gl-matrix';

export function initgl(glc: HTMLCanvasElement) {
    var gl: WebGLRenderingContext = glc.getContext('webgl');

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

export function glclear(gl: WebGLRenderingContext) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


export function create_shader(path: string, gl: WebGLRenderingContext, type: number) {
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

export function create_program(vs: WebGLShader, fs: WebGLShader, gl: WebGLRenderingContext) {
    var program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    } else
        console.log('pro:' + gl.getProgramInfoLog(program));

}

export function create_vbo(data: number[], gl: WebGLRenderingContext) {
    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

export function create_ibo(data: number[], gl: WebGLRenderingContext) {
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}

export function loadFile(path: string) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    if (xhr.status == 200)
        return xhr.responseText;
    else
        console.log("no such file:" + path);

}


export function makeMvp(view3v: number[][], pers4f: number[]) {
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

export function upload_array_att(array: number[], att_name: string, program: WebGLProgram, gl: WebGLRenderingContext) {
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

// export function static_uni(arr:number[], smvp:mat4) {
//     var ret = vec4.create();
//     vec4.transformMat4(ret, arr, smvp);
//     return [ret[0], ret[1], ret[2]];
// }

export function create_texture(src: string, gl: WebGLRenderingContext) {
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
