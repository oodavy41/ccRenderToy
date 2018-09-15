import * as glm from 'gl-matrix';

import {CTransform} from '../component/CTransform';
import {Scenes} from '../Scenes';

import {MTL_TYPE} from './Material';
import {Mesh} from './Mesh';


export class Transform extends CTransform {
  Mesh: Mesh[];


  constructor() {
    super();
    this.Mesh = [];
  }

  add_mesh(mesh: Mesh) {
    this.Mesh.push(mesh);
  }

  init(scene: Scenes) {
    let light = scene.lights['Main'];
    let thisTran = this;

    if (scene.shadow) {
      light.depthMat.init(scene, thisTran);
    }

    this.Mesh.forEach(mesh => {
      mesh.material.init(scene, thisTran);
      mesh.init(scene.GL);
    });
  }

  draw(scene: Scenes) {
    this.earlyDarwFuncs.forEach(element => {
      element(this, scene.GL);
    });

    let light = scene.lights['Main'];
    let thisTran = this;

    if (scene.shadow) {
      scene.GL.bindFramebuffer(
          scene.GL.FRAMEBUFFER, light.depthFrame.frameBuffer);
      scene.GL.clear(scene.GL.COLOR_BUFFER_BIT | scene.GL.DEPTH_BUFFER_BIT);

      this.Mesh.forEach(mesh => {
        light.depthMat.drawS(light.lightMVP, thisTran.m);
        mesh.draw(scene.GL);
      });
      scene.GL.bindFramebuffer(scene.GL.FRAMEBUFFER, null);
    }
    this.Mesh.forEach(mesh => {
      mesh.material.draw();
      mesh.draw(scene.GL);
    });

    this.lateDarwFuncs.forEach(element => {
      element(this, scene.GL);
    });
  }
}
