System.register(["gl-matrix", "./glfuncs"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var glm, glfuncs_1, GLg;
    return {
        setters: [
            function (glm_1) {
                glm = glm_1;
            },
            function (glfuncs_1_1) {
                glfuncs_1 = glfuncs_1_1;
            }
        ],
        execute: function () {
            GLg = (function () {
                function GLg() {
                    this.gl = null;
                    //fpsctrl
                    this.mouseCTRL_flag = false;
                    this.client_pos = [-1, 0, -1, 0];
                    this.fps_angel = [0, 0];
                    //movectrl     w a s d
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
                GLg.prototype.create = function (id) {
                    this.gl = glfuncs_1.initgl(id);
                };
                GLg.prototype.set_light = function (direction, color) {
                    this.light_c = color;
                    this.light_d = direction;
                };
                GLg.prototype.set_cam_pos = function (pos) {
                    this.camera_pos = glm.vec3.fromValues(pos[0], pos[1], pos[2]);
                    this.makemvp();
                };
                GLg.prototype.set_cam_front = function (f) {
                    this.camera_front = glm.vec4.fromValues(f[0], f[1], f[2], f[3]);
                    this.makemvp();
                };
                GLg.prototype.make_cam_look = function () {
                    if (this.camera_front[3] == 0) {
                        var pos = this.camera_pos;
                        var front = this.camera_front;
                        return [pos[0] + front[0], pos[1] + front[1], pos[2] + front[2]];
                    }
                    else
                        return [this.camera_front[0], this.camera_front[1], this.camera_front[2]];
                };
                GLg.prototype.set_cam_up = function (up) {
                    this.camera_up = glm.vec3.fromValues(up[0], up[1], up[2]);
                    this.makemvp();
                };
                GLg.prototype.set_cam_info = function (info) {
                    this.camera_info = info;
                    this.makemvp();
                };
                //设定初始相机朝向，作为今后视角转向基础
                GLg.prototype.set_cam_ptype = function () {
                    this.camera_ptype = this.make_cam_look();
                };
                GLg.prototype.makemvp = function () {
                    if (this.camera_pos && this.camera_front && this.camera_up && this.camera_info) {
                        this.mvp = glfuncs_1.makeMvp([this.camera_pos, this.make_cam_look(), this.camera_up], this.camera_info);
                        this.camera_right = glm.vec3.create();
                        glm.vec3.cross(this.camera_right, this.camera_front, this.camera_up);
                    }
                };
                GLg.prototype.fps_ctrl = function () {
                    var ret = [0, 0];
                    if (this.client_pos[2] != -1) {
                        if (this.client_pos[0] != -1) {
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
                    if (this.fps_angel[1] > Math.PI)
                        this.fps_angel[1] += -Math.PI * 2;
                    if (this.fps_angel[1] < -Math.PI)
                        this.fps_angel[1] += Math.PI * 2;
                    //console.log(this.fps_angel[0] + '|' + this.fps_angel[1] + '|' + ret[0] + '|' + ret[1]);
                    var lookat = this.camera_ptype;
                    var nlookat = glm.vec3.create();
                    glm.vec3.rotateX(nlookat, lookat, this.camera_pos, this.fps_angel[0]);
                    glm.vec3.rotateY(nlookat, nlookat, this.camera_pos, this.fps_angel[1]);
                    glm.vec3.subtract(this.camera_front, nlookat, this.camera_pos);
                    glm.vec3.cross(this.camera_right, this.camera_front, this.camera_up);
                    glm.vec3.normalize(this.camera_front, this.camera_front);
                    glm.vec3.normalize(this.camera_right, this.camera_right);
                    this.movectrl();
                    this.makemvp();
                    return ret;
                };
                GLg.prototype.movectrl = function () {
                    var abf = glm.vec3.create(), abr = glm.vec3.create();
                    var wasd = [
                        this.camera_front,
                        glm.vec3.scale(abr, this.camera_right, -1),
                        glm.vec3.scale(abf, this.camera_front, -1),
                        this.camera_right
                    ];
                    var ret = glm.vec3.fromValues(0, 0, 0);
                    for (var i = 0; i < 4; i++) {
                        if (this.movement[i] === 1) {
                            glm.vec3.add(ret, ret, wasd[i]);
                        }
                    }
                    glm.vec3.normalize(ret, ret);
                    glm.vec3.scale(ret, ret, set.MoveSpeed);
                    glm.vec3.add(this.camera_pos, this.camera_pos, ret);
                    glm.vec3.add(this.camera_ptype, this.camera_ptype, ret);
                };
                GLg.prototype.set_static_mvp = function (mvp) {
                    this.stat_mvp_mat = mvp;
                };
                return GLg;
            }());
            exports_1("GLg", GLg);
        }
    };
});
