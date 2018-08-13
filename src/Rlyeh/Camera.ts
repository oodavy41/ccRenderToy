import * as glm from 'gl-matrix';
import { RLSettings } from './GLOBAL/setting';
import { makeMvp } from './GLCore/glfuncs';
import { CTransform } from './component/CTransform';
import { NullTemplateVisitor } from '../../node_modules/@angular/compiler';

const set = RLSettings;
export class Camera extends CTransform {
    mouseCTRL_flag: boolean;

    set camera_up(value: glm.vec3) { this.camera_up = value; }
    get camera_up(): glm.vec3 { return this.camera_up; }
    set camera_right(value: glm.vec3) { this.camera_right = value; }
    get camera_right(): glm.vec3 { return this.camera_right; }
    set camera_aim(value: glm.vec3) { this.camera_aim = value; }
    get camera_aim(): glm.vec3 { return this.camera_aim; }
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
        this.camera_right = glm.vec3.fromValues(1, 0, 0);
        this.camera_info = null;
        this.camera_ptype = null;
        this.mvp = null;
    }




    // 设定初始相机朝向，作为今后视角转向基础
    set_cam_ptype() {
        this.camera_ptype = this.camera_aim;
    }

    makemvp() {
        if (this.position && this.camera_aim && this.camera_up && this.camera_info) {
            // todo: aim rotate/aim modify
            this.mvp = makeMvp([this.position, this.camera_aim, this.camera_up], this.camera_info);
            glm.vec3.cross(this.camera_right,
                glm.vec3.subtract(null, this.camera_aim, this.position),
                this.camera_up);
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

        this.rotate.x += Math.asin(-ret[1] / set.FPSraid);
        this.rotate.y += Math.asin(-ret[0] / set.FPSraid);


        this.rotate.x = Math.min(this.rotate.x, Math.PI / 2 - 0.04);
        this.rotate.x = Math.max(this.rotate.x, -Math.PI / 2 - 0.04);
        if (this.rotate.y > Math.PI) {
            this.rotate.y += -Math.PI * 2;
        }
        if (this.rotate.y < -Math.PI) {
            this.rotate.y += Math.PI * 2;
        }

        // console.log(this.rotate.x + '|' + this.rotate.y + '|' + ret[0] + '|' + ret[1]);


        const lookat = this.camera_ptype;
        const nlookat = glm.vec3.create();
        glm.vec3.rotateX(nlookat, lookat, this.position, this.rotate.x);
        glm.vec3.rotateY(nlookat, nlookat, this.position, this.rotate.y);

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

}
