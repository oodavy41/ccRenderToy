import { ResManager } from '../ResManager';

import { Transform } from '../object/Transform';
import { mat4, vec3 } from 'gl-matrix';

export function initgl(glc: HTMLCanvasElement) {
    const gl: WebGLRenderingContext = glc.getContext('webgl');

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
    // tslint:disable-next-line:no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}


export function create_shader(source: string, gl: WebGLRenderingContext, type: number, res: ResManager) {
    let shader;
    shader = gl.createShader(type);
    gl.shaderSource(shader, source);

    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
    } else {
        console.error(type.toString() + ':' + gl.getShaderInfoLog(shader));
    }
}

export function create_program(vs: WebGLShader, fs: WebGLShader, gl: WebGLRenderingContext) {
    const program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);

    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return program;
    } else {
        console.error('pro:' + gl.getProgramInfoLog(program));
    }

}

export function create_vbo(data: number[], gl: WebGLRenderingContext) {
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

export function create_ibo(data: number[], gl: WebGLRenderingContext) {
    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}


export function makeMvp(view3v: vec3[], pers4f: number[]) {
    const mMat = mat4.create();
    const vMat = mat4.create();
    const pMat = mat4.create();
    const mvp = mat4.create();

    mat4.lookAt(vMat, view3v[0], view3v[1], view3v[2]);

    mat4.perspective(pMat, pers4f[0], pers4f[1], pers4f[2], pers4f[3]);

    mat4.multiply(mvp, pMat, vMat);
    mat4.multiply(mvp, mvp, mMat);
    return mvp;
}

export function upload_array_att(array: number[], att_name: string, program: WebGLProgram, gl: WebGLRenderingContext) {
    const att = gl.getAttribLocation(program, att_name);
    if (att === -1) {
        console.log('no attribute called:' + att_name);
        return null;
    }
    const vbo = create_vbo(array, gl);
    gl.enableVertexAttribArray(att);
    return {
        'att': att,
        'vbo': vbo
    };
}
