import * as glm from 'gl-matrix';
import { Mesh } from './Mesh';
import { GLg } from '../GLCore/GL';
import { MTL_TYPE } from './Material';


export class Transform {

    m: glm.mat4;
    nm: glm.mat3;
    Mesh: Mesh[];
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
        this.Mesh = [];
        this.position = glm.vec3.fromValues(0, 0, 0);
        this.rotate.x = 0;
        this.rotate.y = 0;
        this.rotate.z = 0;
        this.scale = glm.vec3.fromValues(1, 1, 1);
        this.make_transform();
        this.earlyDarwFuncs = [];
        this.lateDarwFuncs = [];
    }

    add_mesh(mesh: Mesh) {
        this.Mesh.push(mesh);
    }

    init(glg: GLg) {
        if (!(glg.mvp && glg.light_d && glg.light_c)) {
            console.log('no camera or light info');
        } else {
            this.Mesh.forEach(mesh => {
                mesh.init(glg.gl);
                mesh.material.set_uniform(MTL_TYPE.V4f, 'lightDirection', glg.light_d, glg.gl);
                mesh.material.set_uniform(MTL_TYPE.V3f, 'lightColor', glg.light_c, glg.gl);
                mesh.material.set_uniform(MTL_TYPE.V3f, 'cameraPos', glg.camera_pos, glg.gl);
                mesh.material.set_uniform(MTL_TYPE.M4f, 'mvpMatrix', glg.mvp, glg.gl);
                mesh.material.set_uniform(MTL_TYPE.M4f, 'modelMatrix', this.m, glg.gl);
                mesh.material.set_uniform(MTL_TYPE.M3f, 'normalMatrix', this.nm, glg.gl);
            });
        }
    }

    draw(glg: GLg) {
        this.earlyDarwFuncs.forEach(element => {
            element(this, glg);
        });

        this.Mesh.forEach(mesh => {
            mesh.material.set_uniform(MTL_TYPE.V4f, 'lightDirection', glg.light_d, glg.gl);
            mesh.material.set_uniform(MTL_TYPE.V3f, 'cameraPos', glg.camera_pos, glg.gl);
            mesh.material.set_uniform(MTL_TYPE.M4f, 'mvpMatrix', glg.mvp, glg.gl);
            mesh.material.set_uniform(MTL_TYPE.M4f, 'modelMatrix', this.m, glg.gl);
            mesh.material.set_uniform(MTL_TYPE.M3f, 'normalMatrix', this.nm, glg.gl);
            mesh.draw(glg.gl);
        });

        this.lateDarwFuncs.forEach(element => {
            element(this, glg);
        });
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
