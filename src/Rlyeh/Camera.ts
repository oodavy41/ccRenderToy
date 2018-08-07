import * as glm from 'gl-matrix';
import { RLSettings } from './GLOBAL/setting';
import { makeMvp } from './GLCore/glfuncs';
import { CTransform } from './component/CTransform';

const set = RLSettings;
export class Camera extends CTransform {
    mouseCTRL_flag: boolean;

    // mouse
    mouse_pos: number[];
    fpsXYAngel: number[];
    movement: number[];
    camera_aim: glm.vec3;
    camera_up: glm.vec3;
    camera_right: glm.vec3;
    camera_info: number[];
    camera_ptype: glm.vec3;

    mvp: glm.mat4;
    stat_mvp_mat: glm.mat4;

    constructor() {
        super();
        // fpsctrl
        this.mouseCTRL_flag = false;
        this.mouse_pos = [-1, 0, -1, 0];
        this.fpsXYAngel = [0, 0];

        // movectrl     w a s d
        this.movement = [0, 0, 0, 0];

        this.camera_aim = glm.vec3.fromValues(0, 0, -1);
        this.camera_up = glm.vec3.fromValues(0, 1, 0);
        this.camera_right = glm.vec3.fromValues(1, 0, 0);
        this.camera_info = null;
        this.camera_ptype = null;
        this.mvp = null;
    }


    set_cam_front(front_v3: number[]) {
        this.camera_aim = glm.vec3.fromValues(front_v3[0], front_v3[1], front_v3[2]);
        this.makemvp();
    }

    set_cam_up(up_v3: number[]) {
        this.camera_up = glm.vec3.fromValues(up_v3[0], up_v3[1], up_v3[2]);
        this.makemvp();
    }

    set_cam_info(camInfo_4f: number[]) {
        this.camera_info = camInfo_4f;
        this.makemvp();
    }

    // 设定初始相机朝向，作为今后视角转向基础
    set_cam_ptype() {
        this.camera_ptype = this.camera_aim;
    }

    makemvp() {
        if (this.position && this.camera_aim && this.camera_up && this.camera_info) {
            this.mvp = makeMvp([this.position, this.camera_aim, this.camera_up], this.camera_info);
            this.camera_right = glm.vec3.create();
            glm.vec3.cross(this.camera_right, this.camera_aim, this.camera_up);
        }
    }

    fps_ctrl() {
        const ret = [0, 0];

        if (this.mouse_pos[2] !== -1) {
            if (this.mouse_pos[0] !== -1) {
                ret[0] = this.mouse_pos[2] - this.mouse_pos[0];
                ret[1] = this.mouse_pos[3] - this.mouse_pos[1];
            }
            this.mouse_pos[0] = this.mouse_pos[2];
            this.mouse_pos[1] = this.mouse_pos[3];
        }

        ret[0] = Math.max(ret[0], -set.FPSraid);
        ret[1] = Math.max(ret[1], -set.FPSraid);
        ret[0] = Math.min(ret[0], set.FPSraid);
        ret[1] = Math.min(ret[1], set.FPSraid);

        this.fpsXYAngel[0] += Math.asin(-ret[1] / set.FPSraid);
        this.fpsXYAngel[1] += Math.asin(-ret[0] / set.FPSraid);


        this.fpsXYAngel[0] = Math.min(this.fpsXYAngel[0], Math.PI / 2 - 0.04);
        this.fpsXYAngel[0] = Math.max(this.fpsXYAngel[0], -Math.PI / 2 - 0.04);
        if (this.fpsXYAngel[1] > Math.PI) {
            this.fpsXYAngel[1] += -Math.PI * 2;
        }
        if (this.fpsXYAngel[1] < -Math.PI) {
            this.fpsXYAngel[1] += Math.PI * 2;
        }

        // console.log(this.fpsXYAngel[0] + '|' + this.fpsXYAngel[1] + '|' + ret[0] + '|' + ret[1]);


        const lookat = this.camera_ptype;
        const nlookat = glm.vec3.create();
        glm.vec3.rotateX(nlookat, lookat, this.position, this.fpsXYAngel[0]);
        glm.vec3.rotateY(nlookat, nlookat, this.position, this.fpsXYAngel[1]);

        glm.vec3.subtract(this.camera_aim, nlookat, this.position);

        glm.vec3.cross(this.camera_right, this.camera_aim, this.camera_up);


        glm.vec3.normalize(this.camera_aim, this.camera_aim);
        glm.vec3.normalize(this.camera_right, this.camera_right);

        this.movectrl();

        this.makemvp();

        return ret;
    }

    movectrl() {
        const abf = glm.vec3.create(),
            abr = glm.vec3.create();
        const wasd = [
            this.camera_aim,
            glm.vec3.scale(abr, this.camera_right, -1),
            glm.vec3.scale(abf, this.camera_aim, -1),
            this.camera_right
        ];

        const ret = glm.vec3.fromValues(0, 0, 0);

        for (let i = 0; i < 4; i++) {
            if (this.movement[i] === 1) {
                glm.vec3.add(ret, ret, wasd[i]);
            }
        }

        glm.vec3.normalize(ret, ret);

        glm.vec3.scale(ret, ret, set.MoveSpeed);

        glm.vec3.add(this.position, this.position, ret);
        glm.vec3.add(this.camera_ptype, this.camera_ptype, ret);
    }
    set_static_mvp(mvp) {
        this.stat_mvp_mat = mvp;
    }

}
