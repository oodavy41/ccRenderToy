
import {ResManager} from '../../ResManager';
import {Scenes} from '../../Scenes';
import {AMaterial} from '../Material';
import {CubeTexture, Texture} from '../Texture';
import {Transform} from '../Transform';

export class BasePhoneMat extends AMaterial {
  private tex: CubeTexture;
  metalless: number;
  smoothness: number;

  constructor(GL: WebGLRenderingContext, res: ResManager, tex?: CubeTexture) {
    let path = res.resRoot + res.shadersPath;
    super(path + 'base_phone.vert', path + 'base_phone.frag', GL, res);
    this.metalless = 0;
    this.smoothness = 0;
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
    this.setUniform_1f('metalless', this.metalless, this.scene.GL);
    this.setUniform_1f('smoothness', this.smoothness, this.scene.GL);

    if (this.tex) {
      this.setUniformI1i('tex', this.tex, this.scene.GL, 0);
    }
    this.setUniform_1b('usetex', this.tex ? true : false, this.scene.GL);

    if (this.scene.lights['Main'].depthFrame) {
      this.setUniformI1i(
          'shadowMap', this.scene.lights['Main'].depthFrame, this.scene.GL, 1);
      this.setUniformM4f(
          'lightMVP', this.scene.lights['Main'].lightMVP, this.scene.GL);
    }
    this.setUniform_1b(
        'shadow', this.scene.lights['Main'].depthFrame ? true : false,
        this.scene.GL);
  }
  setTex(tex: CubeTexture) {
    this.tex = tex;
  }
  rmTex() {
    this.tex = undefined;
  }
}
