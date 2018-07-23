
import { create_shader, create_program } from '../GLCore/glfuncs';
import { Texture, CubeTexture } from './Texture';
import { ResManager } from '../ResManager';

export enum MTL_TYPE { M4f, M3f, V3f, V4f, I1i, _1f, _1b, }
export class Material {

    vs: WebGLShader;
    fs: WebGLShader;
    textures: Array<any>;
    uniforms: any;

    prog: WebGLProgram;

    constructor(ver_path: string, fra_path: string, gl: WebGLRenderingContext, res: ResManager) {
        this.vs = create_shader(res.get(ver_path), gl, gl.VERTEX_SHADER, res);
        this.fs = create_shader(res.get(fra_path), gl, gl.FRAGMENT_SHADER, res);
        this.prog = create_program(this.vs, this.fs, gl);
        this.textures = [];
        this.uniforms = {};
    }

    use(gl) {
        gl.useProgram(this.prog);
        this.textures.forEach(function (element) {
            element.bind(gl);
        });
    }

    // value:数据类型传入数组，纹理类型传入Texture  此前需要useProgram
    set_uniform(type: MTL_TYPE, name: string, value: any, gl: WebGLRenderingContext) {
        gl.useProgram(this.prog);
        switch (type) {
            case MTL_TYPE.M4f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniformMatrix4fv(this.uniforms[name], false, value);
                    this.uniforms[name].value = value;
                }
                break;
            case MTL_TYPE.M3f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniformMatrix3fv(this.uniforms[name], false, value);
                    this.uniforms[name].value = value;
                }
                break;
            case MTL_TYPE.V3f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniform3fv(this.uniforms[name], value);
                    this.uniforms[name].value = value;
                }
                break;
            case MTL_TYPE.V4f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniform4fv(this.uniforms[name], value);
                    this.uniforms[name].value = value;
                }
                break;
            case MTL_TYPE.I1i:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniform1i(this.uniforms[name], value.index);
                    this.uniforms[name].value = value;
                }
                break;
            case MTL_TYPE._1f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniform1f(this.uniforms[name], value);
                    this.uniforms[name].value = value;
                }
                break;
            case MTL_TYPE._1b:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                if (this.uniforms[name]) {
                    gl.uniform1i(this.uniforms[name], value);
                    this.uniforms[name].value = value;
                }
                break;
        }

    }
}
