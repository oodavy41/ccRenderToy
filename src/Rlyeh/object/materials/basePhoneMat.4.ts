
import {ResManager} from '../../ResManager';
import {Scenes} from '../../Scenes';
import {AMaterial} from '../Material';
import { Transform } from '../Transform';

class BasePhoneMat extends AMaterial {
  scene: Scenes;
  transform: Transform;
  constructor(GL: WebGLRenderingContext, res: ResManager) {
    let path = res.resRoot + res.shadersPath;
    super(path + 'base_phone.vert', path + 'base_phone.frag', GL, res);
  }
  init(scene: Scenes, tran: Transform) {
    this.scene = scene;
    this.transform = tran;
    this.setUniformV3f(
        'lightDirection', scene.lights['Main'].lightDirection, scene.GL);
    this.setUniformV4f('lightColor', scene.lights['Main'].lightColor, scene.GL);
    this.setUniformV3f(
        'cameraPos', scene.mainCamera.position, scene.GL);
    this.setUniformM4f('mvpMatrix', scene.mainCamera.mvp, scene.GL);
    this.setUniformM4f('modelMatrix', this.transform.m, scene.GL);
    this.setUniformM3f('normalMatrix', this.transform.nm, scene.GL);
  }

  draw() {
    this.setUniformV3f(
        'lightDirection', this.scene.lights['Main'].lightDirection, this.scene.GL);
    this.setUniformV4f('lightColor', this.scene.lights['Main'].lightColor, this.scene.GL);
    this.setUniformV3f(
        'cameraPos', this.scene.mainCamera.position, this.scene.GL);
    this.setUniformM4f('mvpMatrix', this.scene.mainCamera.mvp, this.scene.GL);
    this.setUniformM4f('modelMatrix', this.transform.m, this.scene.GL);
    this.setUniformM3f('normalMatrix', this.transform.nm, this.scene.GL);
  }
}
