
import { create_shader, create_program } from '../GLCore/glfuncs';
import { Texture, CubeTexture } from './Texture';
import { ResManager } from '../ResManager';
import { mat4, mat3, vec3, vec4 } from 'gl-matrix';

export enum MTL_TYPE { M4f, M3f, V3f, V4f, I1i, _1f, _1b, }
export class Material {

    vs: WebGLShader;
    fs: WebGLShader;
    textures: Array<any>;
    uniforms: any;

    prog: WebGLProgram;

    // value:数据类型传入数组，纹理类型传入Texture  此前需要useProgram
    set_uniform: { [key: number]: Function };

    constructor(ver_path: string, fra_path: string, GL: WebGLRenderingContext, res: ResManager) {

        this.set_uniform[MTL_TYPE.M4f] = (name: string, value: Float32Array, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniformMatrix4fv(this.uniforms[name], false, value);
            this.uniforms[name].value = value;
        };
        this.set_uniform[MTL_TYPE.M3f] = (name: string, value: Float32Array, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniformMatrix3fv(this.uniforms[name], false, value);
            this.uniforms[name].value = value;
        };
        this.set_uniform[MTL_TYPE.V3f] = (name: string, value: Float32Array, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniform3fv(this.uniforms[name], value);
            this.uniforms[name].value = value;
        };
        this.set_uniform[MTL_TYPE.V4f] = (name: string, value: Float32Array, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniform4fv(this.uniforms[name], value);
            this.uniforms[name].value = value;
        };
        this.set_uniform[MTL_TYPE.I1i] = (name: string, value, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniform1i(this.uniforms[name], value.index);
            this.uniforms[name].value = value;
        };
        this.set_uniform[MTL_TYPE._1f] = (name: string, value: number, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniform1f(this.uniforms[name], value);
            this.uniforms[name].value = value;
        };
        this.set_uniform[MTL_TYPE._1b] = (name: string, value: boolean, gl: WebGLRenderingContext) => {
            if (!this.uniforms[name]) {
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
            }
            gl.uniform1i(this.uniforms[name], value ? 1 : 0);
            this.uniforms[name].value = value;
        };
        this.vs = create_shader('' + res.get(ver_path), GL, GL.VERTEX_SHADER, res);
        this.fs = create_shader('' + res.get(fra_path), GL, GL.FRAGMENT_SHADER, res);
        this.prog = create_program(this.vs, this.fs, GL);
        this.textures = [];
        this.uniforms = {};
    }

    use(gl) {
        gl.useProgram(this.prog);
        this.textures.forEach(function (element) {
            element.bind(gl);
        });
    }


}


