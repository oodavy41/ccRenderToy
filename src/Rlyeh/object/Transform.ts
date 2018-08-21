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
    this.Mesh.forEach(mesh => {
      mesh.init(scene.GL);
      mesh.material.use(scene.GL);
      mesh.material.setUniformV3f(
          'lightDirection', light.lightDirection, scene.GL);
      mesh.material.setUniformV4f('lightColor', light.lightColor, scene.GL);
      mesh.material.setUniformV3f(
          'cameraPos', scene.mainCamera.position, scene.GL);
      mesh.material.setUniformM4f('mvpMatrix', scene.mainCamera.mvp, scene.GL);
      mesh.material.setUniformM4f('modelMatrix', this.m, scene.GL);
      mesh.material.setUniformM3f('normalMatrix', this.nm, scene.GL);
    });
  }

  draw(scene: Scenes) {
    this.earlyDarwFuncs.forEach(element => {
      element(this, scene.GL);
    });

    let light = scene.lights['Main'];
    this.Mesh.forEach(mesh => {
      mesh.material.use(scene.GL);
      mesh.material.setUniformV3f(
          'lightDirection', light.lightDirection, scene.GL);
      mesh.material.setUniformV3f(
          'cameraPos', scene.mainCamera.position, scene.GL);
      mesh.material.setUniformM4f('mvpMatrix', scene.mainCamera.mvp, scene.GL);
      mesh.material.setUniformM4f('modelMatrix', this.m, scene.GL);
      mesh.material.setUniformM3f('normalMatrix', this.nm, scene.GL);
      mesh.draw(scene.GL);
    });

    this.lateDarwFuncs.forEach(element => {
      element(this, scene.GL);
    });
  }
}
