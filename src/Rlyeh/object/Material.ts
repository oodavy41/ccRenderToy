
import {create_program, create_shader} from '../GLCore/glfuncs';
import {ResManager} from '../ResManager';

import {CubeTexture, Texture} from './Texture';
import { Transform } from './Transform';
import { Scenes } from '../Scenes';

export enum MTL_TYPE {
  M4f,
  M3f,
  V3f,
  V4f,
  I1i,
  _1f,
  _1b,
}

export abstract class AMaterial {
  vs: WebGLShader;
  fs: WebGLShader;
  textures: Array<any>;
  uniforms: {[key: string]: any};

  prog: WebGLProgram;

  // value:数据类型传入数组，纹理类型传入Texture  此前需要useProgram

  constructor(
      ver_path: string, fra_path: string, GL: WebGLRenderingContext,
      res: ResManager) {
    this.vs = create_shader('' + res.get(ver_path), GL, GL.VERTEX_SHADER, res);
    this.fs =
        create_shader('' + res.get(fra_path), GL, GL.FRAGMENT_SHADER, res);
    this.prog = create_program(this.vs, this.fs, GL);
    this.textures = [];
    this.uniforms = {};
  }

  abstract init(scene: Scenes, tran: Transform): void;
  abstract draw(): void;

  setUniformM4f(name: string, value: Float32Array, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniformMatrix4fv(this.uniforms[name], false, value);
    this.uniforms[name].value = value;
  }
  setUniformM3f(name: string, value: Float32Array, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniformMatrix3fv(this.uniforms[name], false, value);
    this.uniforms[name].value = value;
  }
  setUniformV3f(name: string, value: Float32Array, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniform3fv(this.uniforms[name], value);
    this.uniforms[name].value = value;
  }
  setUniformV4f(name: string, value: Float32Array, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniform4fv(this.uniforms[name], value);
    this.uniforms[name].value = value;
  }
  setUniformI1i(
      name: string, value: Texture|CubeTexture, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniform1i(this.uniforms[name], value.index);
    this.uniforms[name].value = value;
  }
  setUniform_1f(name: string, value: number, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniform1f(this.uniforms[name], value);
    this.uniforms[name].value = value;
  }
  setUniform_1b(name: string, value: boolean, gl: WebGLRenderingContext) {
    if (!this.uniforms[name]) {
      let uniform = gl.getUniformLocation(this.prog, name);
      if (!uniform) {
        return;
      }
      this.uniforms[name] = uniform;
    }
    this.use(gl);
    gl.uniform1i(this.uniforms[name], value ? 1 : 0);
    this.uniforms[name].value = value;
  }

  use(gl) {
    gl.useProgram(this.prog);
    this.textures.forEach((element: Texture) => {
      element.bind(gl);
    });
  }
}
