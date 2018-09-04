
import {ResManager} from '../../ResManager';
import {Scenes} from '../../Scenes';
import {AMaterial} from '../Material';
import {CubeTexture} from '../Texture';
import {Transform} from '../Transform';

class BasePhoneMat extends AMaterial {
  scene: Scenes;
  transform: Transform;
  metalless: number;
  smothness: number;
  tex: CubeTexture;

  constructor(GL: WebGLRenderingContext, res: ResManager, tex: CubeTexture) {
    let path = res.resRoot + res.shadersPath;
    super(path + 'base_phone.vert', path + 'base_phone.frag', GL, res);
    this.metalless = 0;
    this.smothness = 0;
    this.tex = tex;
  }
  init(scene: Scenes, tran: Transform) {
    this.scene = scene;
    this.transform = tran;
    this.setUniformI1i('tex', this.tex, scene.GL);
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
    this.setUniform_1f('metalless', this.metalless, this.scene.GL);
    this.setUniform_1f('smoothness', this.smothness, this.scene.GL);
  }
}
