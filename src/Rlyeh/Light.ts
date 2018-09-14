
import {mat4, vec3, vec4} from 'gl-matrix';

import {CTransform} from './component/CTransform';
import {makeMvp} from './GLCore/glfuncs';
import {DepthMat} from './object/materials/depthMat';
import {FrameTexture} from './object/Texture';
import {Scenes} from './Scenes';

export enum LIGHT_TYPE {
  POINT,
  SPOT,
  DIRECTION
}

export class Light extends CTransform {
  type: LIGHT_TYPE;
  private _lightAim: vec3;
  set lightAim(aim: vec3) {
    this.modifyFLAG = true;
    vec3.sub(this.lightDirection, aim, this.position);
    this._lightAim = aim;
  }
  get lightAim() {
    return this._lightAim;
  }

  depthMat: DepthMat;
  lightDirection: vec3;
  lightColor: vec4;
  spotAngel: number;

  private _lightMVP: mat4;
  set lightMVP(mvp: mat4) {
    this._lightMVP = mvp;
  }

  get lightMVP() {
    if (this.modifyFLAG) {
      this.makemvp();
    }
    return this._lightMVP;
  }
  depthFrame: FrameTexture;

  constructor(
      type: LIGHT_TYPE, position: vec3, lightAim: vec3, lightCol: vec4,
      angel?: number) {
    super();
    if (type === LIGHT_TYPE.SPOT && angel === undefined) {
      console.error('define an spot light without angel!');
    }
    this.type = type;
    this.lightDirection = vec3.create();
    vec3.sub(this.lightDirection, lightAim, position);
    this.position = position;
    this.lightAim = lightAim;
    this.lightColor = lightCol;
    this.depthFrame = undefined;
  }
  makemvp() {
    let cameraInfo = [Math.PI / 3, 1, 0.01, 100];
    if (this.position && this.lightAim) {
      this.modifyFLAG = false;
      this.lightMVP = makeMvp(
          [this.position, this.lightAim, vec3.fromValues(0, 1, 0)], cameraInfo);
    }
  }
  enableShadow(scene: Scenes, width: number, height: number) {
    this.depthMat = new DepthMat(scene.GL, scene.resManager);
    this.depthFrame = new FrameTexture(scene.GL, width, height);
    this.makemvp();
  }

  disableShadow() {
    this.depthMat = undefined;
    this.depthFrame = undefined;
  }
}
