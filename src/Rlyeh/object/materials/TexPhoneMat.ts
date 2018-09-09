
import {vec3} from 'gl-matrix';

import {ResManager} from '../../ResManager';
import {Scenes} from '../../Scenes';
import {AMaterial} from '../Material';
import {Texture} from '../Texture';
import {Transform} from '../Transform';

export class TexPhoneMat extends AMaterial {
  private tex: Texture;
  ambient: vec3;
  diffuse: vec3;
  specular: vec3;
  powup: number;

  constructor(GL: WebGLRenderingContext, res: ResManager, tex?: Texture) {
    let path = res.resRoot + res.shadersPath;
    super(path + 'text_phone.vert', path + 'text_phone.frag', GL, res);
    this.ambient = vec3.fromValues(1, 0, 0);
    this.diffuse = vec3.fromValues(1, 0, 0);
    this.specular = vec3.fromValues(1, 0, 0);
    this.powup = 16;
    if (tex) {
      this.setTex(tex);
    }
  }

  draw() {
    super.draw();
    this.setUniformV3f(
        'lightDirection', this.scene.lights['Main'].lightDirection,
        this.scene.GL);
    this.setUniformV4f(
        'lightColor', this.scene.lights['Main'].lightColor, this.scene.GL);
    this.setUniformV3f(
        'cameraPos', this.scene.mainCamera.position, this.scene.GL);
    this.setUniformM4f('mvpMatrix', this.scene.mainCamera.mvp, this.scene.GL);
    this.setUniformM4f('modelMatrix', this.transform.m, this.scene.GL);
    this.setUniformM3f('normalMatrix', this.transform.nm, this.scene.GL);
    this.setUniformV3f('ambient', this.ambient, this.scene.GL);
    this.setUniformV3f('diffuse', this.diffuse, this.scene.GL);
    this.setUniformV3f('specular', this.specular, this.scene.GL);
    this.setUniform_1f('powup', this.powup, this.scene.GL);
    if (this.tex) {
      this.setUniformI1i('tex', this.tex, this.scene.GL, 0);
      this.setUniform_1b('usetex', true, this.scene.GL);
    } else {
      this.setUniform_1b('usetex', false, this.scene.GL);
    }
  }

  setTex(tex: Texture) {
    this.tex = tex;
  }
  rmTex() {
    this.tex = undefined;
  }
}
