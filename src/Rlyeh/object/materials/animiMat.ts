
import {vec3} from 'gl-matrix';

import {ResManager} from '../../ResManager';
import {Scenes} from '../../Scenes';
import {AMaterial} from '../Material';
import {Texture} from '../Texture';
import {Transform} from '../Transform';

class AnimiMat extends AMaterial {
  scene: Scenes;
  transform: Transform;
  ambient: vec3;
  diffuse: vec3;
  specular: vec3;
  powup: number;
  usetex: boolean;
  _tex: Texture;
  set tex(tex: Texture) {
    this.usetex = true;
    this._tex = tex;
  }
  get tex() {
    return this._tex;
  }
  constructor(GL: WebGLRenderingContext, res: ResManager) {
    let path = res.resRoot + res.shadersPath;
    super(path + 'anim_phone.vert', path + 'anim_phone.frag', GL, res);
  }
  init(scene: Scenes, tran: Transform) {
    this.scene = scene;
    this.transform = tran;
    this.ambient = vec3.fromValues(0, 0, 0);
    this.diffuse = vec3.fromValues(0, 0, 0);
    this.specular = vec3.fromValues(0, 0, 0);
    this.powup = 0.1;
    this.usetex = false;
  }

  draw() {
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
    this.setUniform_1b('usetex', this.usetex, this.scene.GL);
    if (this.usetex) {
      this.setUniformI1i('tex', this.tex, this.scene.GL);
    }
  }
}
