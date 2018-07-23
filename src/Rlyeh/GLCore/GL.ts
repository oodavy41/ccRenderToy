import * as glm from 'gl-matrix';
import { initgl, makeMvp } from './glfuncs';
import { RLSettings } from '../GLOBAL/setting';
import { ResManager } from '../ResManager';

const set = RLSettings;

export class GLg {

    gl: WebGLRenderingContext;
    resManager: ResManager;

    mouseCTRL_flag: boolean;
    client_pos: number[];
    fps_angel: number[];
    movement: number[];

    mtllib: any;
    light_d;
    light_c;
    camera_pos: glm.vec3;
    camera_front;
    camera_up;
    camera_right;
    camera_info;
    camera_ptype;

    mvp: glm.mat4;
    stat_mvp_mat: glm.mat4;

    constructor(canv: HTMLCanvasElement) {

        this.gl = initgl(canv);
        this.resManager = new ResManager();

        // fpsctrl
        this.mouseCTRL_flag = false;
        this.client_pos = [-1, 0, -1, 0];
        this.fps_angel = [0, 0];

        // movectrl     w a s d
        this.movement = [0, 0, 0, 0];

        this.mtllib = {};
        this.light_d = null;
        this.light_c = null;
        this.camera_pos = null;
        this.camera_front = null;
        this.camera_up = null;
        this.camera_right = null;
        this.camera_info = null;
        this.camera_ptype = null;
        this.mvp = null;

    }

    create(canv: HTMLCanvasElement) {
        this.gl = initgl(canv);
    }

    set_light(direction_v4: number[], color_v3: number[]) {
        this.light_c = color_v3;
        this.light_d = direction_v4;
    }

    set_cam_pos(pos_v3: number[]) {
        this.camera_pos = glm.vec3.fromValues(pos_v3[0], pos_v3[1], pos_v3[2]);
        this.makemvp();
    }

    set_cam_front(front_v4: number[]) {
        this.camera_front = glm.vec4.fromValues(front_v4[0], front_v4[1], front_v4[2], front_v4[3]);
        this.makemvp();
    }

    make_cam_look() {
        if (this.camera_front[3] === 0) {
            const pos = this.camera_pos;
            const front = this.camera_front;
            return [pos[0] + front[0], pos[1] + front[1], pos[2] + front[2]];
        } else {
            return [this.camera_front[0], this.camera_front[1], this.camera_front[2]];
        }
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
        this.camera_ptype = this.make_cam_look();
    }

    makemvp() {
        if (this.camera_pos && this.camera_front && this.camera_up && this.camera_info) {
            this.mvp = makeMvp([this.camera_pos, this.make_cam_look(), this.camera_up], this.camera_info);
            this.camera_right = glm.vec3.create();
            glm.vec3.cross(this.camera_right, this.camera_front, this.camera_up);
        }
    }

    fps_ctrl() {
        const ret = [0, 0];

        if (this.client_pos[2] !== -1) {
            if (this.client_pos[0] !== -1) {
                ret[0] = this.client_pos[2] - this.client_pos[0];
                ret[1] = this.client_pos[3] - this.client_pos[1];
            }
            this.client_pos[0] = this.client_pos[2];
            this.client_pos[1] = this.client_pos[3];
        }

        ret[0] = Math.max(ret[0], -set.FPSraid);
        ret[1] = Math.max(ret[1], -set.FPSraid);
        ret[0] = Math.min(ret[0], set.FPSraid);
        ret[1] = Math.min(ret[1], set.FPSraid);

        this.fps_angel[0] += Math.asin(-ret[1] / set.FPSraid);
        this.fps_angel[1] += Math.asin(-ret[0] / set.FPSraid);


        this.fps_angel[0] = Math.min(this.fps_angel[0], Math.PI / 2 - 0.04);
        this.fps_angel[0] = Math.max(this.fps_angel[0], -Math.PI / 2 - 0.04);
        if (this.fps_angel[1] > Math.PI) {
            this.fps_angel[1] += -Math.PI * 2;
        }
        if (this.fps_angel[1] < -Math.PI) {
            this.fps_angel[1] += Math.PI * 2;
        }

        // console.log(this.fps_angel[0] + '|' + this.fps_angel[1] + '|' + ret[0] + '|' + ret[1]);


        const lookat = this.camera_ptype;
        const nlookat = glm.vec3.create();
        glm.vec3.rotateX(nlookat, lookat, this.camera_pos, this.fps_angel[0]);
        glm.vec3.rotateY(nlookat, nlookat, this.camera_pos, this.fps_angel[1]);

        glm.vec3.subtract(this.camera_front, nlookat, this.camera_pos);

        glm.vec3.cross(this.camera_right, this.camera_front, this.camera_up);

        glm.vec3.normalize(this.camera_front, this.camera_front);
        glm.vec3.normalize(this.camera_right, this.camera_right);

        this.movectrl();

        this.makemvp();

        return ret;
    }

    movectrl() {
        const abf = glm.vec3.create(),
            abr = glm.vec3.create();
        const wasd = [
            this.camera_front,
            glm.vec3.scale(abr, this.camera_right, -1),
            glm.vec3.scale(abf, this.camera_front, -1),
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

        glm.vec3.add(this.camera_pos, this.camera_pos, ret);
        glm.vec3.add(this.camera_ptype, this.camera_ptype, ret);
    }
    set_static_mvp(mvp) {
        this.stat_mvp_mat = mvp;
    }

    // arr格式[[positions],[normals],[color/textureCood],[index],textureSrc]
    // get_model(arr, flag) {
    //     var c4t2;
    //     switch (flag) {
    //         case this.COLOR:
    //             c4t2 = 4;
    //             break;
    //         case this.TEXTURE:
    //             c4t2 = 2;
    //             if (arr[4])
    //                 this.textures.push(create_texture(arr[4]));
    //             break;
    //     }

    //     this.vert_arr['pos'] = upload_array_att(
    //         arr[0], 'position', this.prog, this.gl, [3, this.gl.FLOAT, false, 0, 0]);

    //     this.vert_arr['nor'] = upload_array_att(
    //         arr[1], 'normal', this.prog, this.gl, [3, this.gl.FLOAT, false, 0, 0]);

    //     this.vert_arr['col/coo'] = upload_array_att(
    //         arr[2], 'color', this.prog, this.gl, [c4t2, this.gl.FLOAT, false, 0, 0]);

    //     this.vert_arr['ind'] = create_ibo(arr[3], this.gl);
    //     this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vert_arr['ind']);
    //     this.IBOlength = arr[3].length;

    // }

    // 若传入texture需要传入经过create_texture返回的['tex']
    // set_uniform(uni_arr) {
    //     var that = this;
    //     var gl = this.gl;
    //     uni_arr.forEach(function (e) {
    //         var uni;
    //         switch (e[0]) {
    //             case that.M4F:
    //                 uni = gl.getUniformLocation(that.prog, e[1]);
    //                 gl.uniformMatrix4fv(uni, false, e[2]);
    //                 break;
    //             case that.V3F:
    //                 uni = gl.getUniformLocation(that.prog, e[1]);
    //                 gl.uniform3fv(uni, e[2]);
    //                 break;
    //             case that.I1I:
    //                 uni = gl.getUniformLocation(that.prog, e[1]);
    //                 gl.activeTexture(gl.TEXTURE0);
    //                 gl.bindTexture(gl.TEXTURE_2D, e[2]);
    //                 gl.uniform1i(uni, 0);
    //                 break;
    //         }
    //         that.uniforms[e[1]] = uni;
    //     })
    // }



    // update() {
    //     var m = glm.mat4.create();
    //     glm.mat4.rotateY(m, this.stat_mvp_mat, (new Date()).getTime() / 1000);
    //     //mat4.rotateX(m, m, (new Date()).getTime() / 2000);
    //     //mat4.rotateZ(m, m, (new Date()).getTime() / 3000);
    //     this.gl.uniformMatrix4fv(this.uniforms['mvpMatrix'], false, m);

    //     this.gl.drawElements(this.gl.TRIANGLES, this.IBOlength, this.gl.UNSIGNED_SHORT, 0);
    // }
}
