import * as glm from 'gl-matrix';
import { Transform } from '../object/Transform';

export class CTransform {

    set m(value: glm.mat4) { this.m = value; }
    get m(): glm.mat4 {
        if (this.modifyFLAG) {
            this.make_transform();
            this.modifyFLAG = false;
            return this.m;
        } else {
            return this.m;
        }
    }

    set nm(value: glm.mat3) { this.nm = value; }
    get nm(): glm.mat3 {
        if (this.modifyFLAG) {
            this.make_transform();
            this.modifyFLAG = false;
            return this.nm;
        } else {
            return this.nm;
        }
    }

    modifyFLAG: boolean;
    set position(value: glm.vec3) {
        this.position = value;
        this.modifyFLAG = true;
    }
    get position() { return this.position; }
    rotate: {
        x: number,
        y: number,
        z: number,
    };
    set scale(value: glm.vec3) {
        this.scale = value;
        this.modifyFLAG = true;
    }
    earlyDarwFuncs: Array<(arg: Transform, arg2: WebGLRenderingContext) => null>;
    lateDarwFuncs: Array<(arg: Transform, arg2: WebGLRenderingContext) => null>;

    constructor() {
        this.m = glm.mat4.create();
        this.nm = glm.mat3.create();
        this.position = glm.vec3.fromValues(0, 0, 0);
        this.rotate = { x: 0, y: 0, z: 0 };
        this.scale = glm.vec3.fromValues(1, 1, 1);
        this.modifyFLAG = true;
        this.earlyDarwFuncs = [];
        this.lateDarwFuncs = [];
    }



    addEarlyDrawFunc(fun: (arg: Transform, arg2: WebGLRenderingContext) => null) {
        this.earlyDarwFuncs.push(fun);
    }
    cleanEarlyDrawFunc() {
        this.earlyDarwFuncs = [];
    }

    addLateDrawFunc(fun: (arg: Transform, arg2: WebGLRenderingContext) => null) {
        this.lateDarwFuncs.push(fun);
    }
    cleanLateDrawFunc() {
        this.lateDarwFuncs = [];
    }

    make_transform() {
        const rot = glm.quat.create();
        glm.quat.rotateX(rot, rot, this.rotate.x);
        glm.quat.rotateY(rot, rot, this.rotate.y);
        glm.quat.rotateZ(rot, rot, this.rotate.z);
        glm.mat4.fromRotationTranslationScale(this.m, rot, this.position, this.scale);
        glm.mat3.normalFromMat4(this.nm, this.m);
    }

    set_rx(x: number) {
        this.rotate.x = x;
        this.modifyFLAG = true;
    }
    set_ry(y: number) {
        this.rotate.y = y;
        this.modifyFLAG = true;
    }
    set_rz(z: number) {
        this.rotate.z = z;
        this.modifyFLAG = true;
    }



}
