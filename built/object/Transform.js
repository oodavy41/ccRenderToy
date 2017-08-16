"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glm = require("gl-matrix");
var Material_1 = require("./Material");
var Transform = (function () {
    function Transform() {
        this.m = glm.mat4.create();
        this.nm = glm.mat3.create();
        this.Mesh = [];
        this.position = glm.vec3.fromValues(0, 0, 0);
        this.rotate.x = 0;
        this.rotate.y = 0;
        this.rotate.z = 0;
        this.scale = glm.vec3.fromValues(1, 1, 1);
        this.make_transform();
    }
    Transform.prototype.add_mesh = function (mesh) {
        this.Mesh.push(mesh);
    };
    Transform.prototype.init = function (glg) {
        if (!(glg.mvp && glg.light_d && glg.light_c)) {
            console.log('no camera or light info');
        }
        else {
            for (var ms in this.Mesh) {
                var mesh = this.Mesh[ms];
                mesh.init(glg.gl);
                mesh.material.set_uniform(Material_1.Material.V4f, 'lightDirection', glg.light_d, glg.gl);
                mesh.material.set_uniform(Material_1.Material.V3f, 'lightColor', glg.light_c, glg.gl);
                mesh.material.set_uniform(Material_1.Material.V3f, 'cameraPos', glg.camera_pos, glg.gl);
                mesh.material.set_uniform(Material_1.Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
                mesh.material.set_uniform(Material_1.Material.M4f, 'modelMatrix', this.m, glg.gl);
                mesh.material.set_uniform(Material_1.Material.M3f, 'normalMatrix', this.nm, glg.gl);
            }
        }
    };
    Transform.prototype.draw = function (glg) {
        this.earlydraw(glg);
        for (var ms in this.Mesh) {
            var mesh = this.Mesh[ms];
            mesh.material.set_uniform(Material_1.Material.V4f, 'lightDirection', glg.light_d, glg.gl);
            mesh.material.set_uniform(Material_1.Material.V3f, 'cameraPos', glg.camera_pos, glg.gl);
            mesh.material.set_uniform(Material_1.Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
            mesh.material.set_uniform(Material_1.Material.M4f, 'modelMatrix', this.m, glg.gl);
            mesh.material.set_uniform(Material_1.Material.M3f, 'normalMatrix', this.nm, glg.gl);
            mesh.draw(glg.gl);
        }
        this.latedraw(glg);
    };
    Transform.prototype.earlydraw = function (gl) { };
    Transform.prototype.latedraw = function (gl) { };
    Transform.prototype.make_transform = function () {
        var rot = glm.quat.create();
        glm.quat.rotateX(rot, rot, this.rotate.x);
        glm.quat.rotateY(rot, rot, this.rotate.y);
        glm.quat.rotateZ(rot, rot, this.rotate.z);
        glm.mat4.fromRotationTranslationScale(this.m, rot, this.position, this.scale);
        glm.mat3.normalFromMat4(this.nm, this.m);
    };
    Transform.prototype.set_pos = function (x, y, z) {
        this.position = glm.vec3.fromValues(x, y, z);
        this.make_transform();
    };
    Transform.prototype.set_rx = function (x) {
        this.rotate.x = x;
        this.make_transform();
    };
    Transform.prototype.set_ry = function (y) {
        this.rotate.y = y;
        this.make_transform();
    };
    Transform.prototype.set_rz = function (z) {
        this.rotate.z = z;
        this.make_transform();
    };
    Transform.prototype.set_scale = function (x, y, z) {
        this.scale = glm.vec3.fromValues(x, y, z);
        this.make_transform();
    };
    return Transform;
}());
exports.Transform = Transform;
