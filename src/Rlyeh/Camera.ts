import * as glm from 'gl-matrix';
import { RLSettings } from './GLOBAL/setting';
import { makeMvp } from './GLCore/glfuncs';
import { CTransform } from './component/CTransform';
import { formatNumber } from '../../node_modules/@angular/common';

const set = RLSettings;
export class Camera extends CTransform {
    mouseCTRL_flag: boolean;

    set camera_up(value: glm.vec3) {
        this.camera_up = value;
        glm.vec3.normalize(this.camera_up, this.camera_up);
        this.reset();
    }
    get camera_up(): glm.vec3 { return this.camera_up; }
    set camera_aim(value: glm.vec3) {
        this.camera_aim = value;
        this.reset();
    }
    get camera_aim(): glm.vec3 { return this.camera_aim; }
    private elevation: number;
    // mouse
    mouse_pos: number[];
    fpsXYAngel: number[];
    movement: number[];

    camera_info: number[];
    camera_ptype: glm.vec3;

    mvp: glm.mat4;


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
        this.camera_info = [Math.PI / 3, 9 / 16, 0.01, 100];

        this.mvp = null;
    }

    private reset() {
        if (this.camera_aim && this.camera_up) {
            this.elevation = glm.vec3.angle(
                glm.vec3.sub(null, this.camera_aim, this.position),
                this.camera_up
            );
            if (this.elevation < set.FPSZeroElevation) { console.error('camera', 'camera aim to high'); return; }
        }
    }




    makemvp() {
        if (this.position && this.camera_aim && this.camera_up && this.camera_info) {
            // todo: aim rotate/aim modify
            this.mvp = makeMvp([this.position, this.camera_aim, this.camera_up], this.camera_info);
        }
    }

    fps_ctrl() {
        const ret = [0, 0];
        let camera_right = glm.vec3.create();
        let camera_front = glm.vec3.create();

        glm.vec3.sub(camera_front, this.camera_aim, this.position);
        glm.vec3.normalize(camera_front, camera_front);
        glm.vec3.cross(camera_right, this.camera_up, camera_front);

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

        let angx = Math.asin(-ret[1] / set.FPSraid) / Math.PI * 180;
        let angy = Math.asin(-ret[0] / set.FPSraid) / Math.PI * 180;

        let matx = glm.mat4.create();
        let maty = glm.mat4.create();
        let newFront = glm.vec3.clone(this.camera_up);
        this.elevation += angx;
        this.elevation = Math.min(this.elevation, 90 - set.FPSZeroElevation);
        this.elevation = Math.max(this.elevation, -90 + set.FPSZeroElevation);
        glm.mat4.rotate(matx, matx, -90 + this.elevation, camera_right);
        glm.mat4.rotate(maty, maty, angy, this.camera_up);
        glm.vec3.transformMat4(newFront, newFront, matx);
        glm.vec3.transformMat4(newFront, newFront, maty);
        glm.vec3.transformMat4(camera_right, camera_right, maty);

        this.movectrl(camera_right);

        this.makemvp();

        return ret;
    }

    movectrl(right: glm.vec3) {
        const abf = glm.vec3.create(),
            abr = glm.vec3.create();
        const wasd = [
            this.camera_aim,
            glm.vec3.scale(abr, right, -1),
            glm.vec3.scale(abf, this.camera_aim, -1),
            right
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

}
