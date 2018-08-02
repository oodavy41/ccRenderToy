import * as glm from 'gl-matrix';

export class CTransform {
    m: glm.mat4;
    nm: glm.mat3;
    position: glm.vec3;
    rotate: {
        x: number,
        y: number,
        z: number
    };
    scale: glm.vec3;
    earlyDarwFuncs: Array<Function>;
    lateDarwFuncs: Array<Function>;

    constructor() {
        this.m = glm.mat4.create();
        this.nm = glm.mat3.create();
        this.position = glm.vec3.fromValues(0, 0, 0);
        this.rotate = { x: 0, y: 0, z: 0 };
        this.scale = glm.vec3.fromValues(1, 1, 1);
        this.make_transform();
        this.earlyDarwFuncs = [];
        this.lateDarwFuncs = [];
    }

    addEarlyDrawFunc(fun: Function) {
        this.earlyDarwFuncs.push(fun);
    }
    cleanEarlyDrawFunc() {
        this.earlyDarwFuncs = [];
    }

    addLateDrawFunc(fun: Function) {
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

    set_pos(x: number, y: number, z: number) {
        this.position = glm.vec3.fromValues(x, y, z);
        this.make_transform();
    }

    set_rx(x: number) {
        this.rotate.x = x;
        this.make_transform();
    }
    set_ry(y: number) {
        this.rotate.y = y;
        this.make_transform();
    }
    set_rz(z: number) {
        this.rotate.z = z;
        this.make_transform();
    }

    set_scale(x: number, y: number, z: number) {
        this.scale = glm.vec3.fromValues(x, y, z);
        this.make_transform();
    }

}
