
import {ResManager} from '../../ResManager';
import {Scenes} from '../../Scenes';
import {AMaterial} from '../Material';
import { Transform } from '../Transform';

class AnimiEdgeMat extends AMaterial {
  scene: Scenes;
  transform: Transform;
  constructor(GL: WebGLRenderingContext, res: ResManager) {
    let path = res.resRoot + res.shadersPath;
    super(path + 'anim_edge_phone.vert', path + 'anim_edge_phone.frag', GL, res);
  }
  init(scene: Scenes, tran: Transform) {
    this.scene = scene;
    this.transform = tran;
  }

  draw() {
    this.setUniformM4f('mvpMatrix', this.scene.mainCamera.mvp, this.scene.GL);
    this.setUniformM4f('modelMatrix', this.transform.m, this.scene.GL);
    this.setUniformM3f('normalMatrix', this.transform.nm, this.scene.GL);
  }
}
