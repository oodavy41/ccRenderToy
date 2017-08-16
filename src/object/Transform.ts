import * as glm from "gl-matrix"
import { Mesh } from "./Mesh";
import { Material } from "./Material";


export class Transform {

    m:glm.mat4;
    nm:glm.mat3;
    Mesh:Mesh[];
    position:glm.vec3;
    rotate:{
        x:number,
        y:number,
        z:number
    };
    scale:glm.vec3;

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
    }

    add_mesh(mesh){
        this.Mesh.push(mesh);
    }

    init(glg) {
        if (!(glg.mvp && glg.light_d && glg.light_c)) {
            console.log('no camera or light info');
        } else {
            for (var ms in this.Mesh) {
                var mesh = this.Mesh[ms];
                mesh.init(glg.gl);
                mesh.material.set_uniform(Material.V4f, 'lightDirection', glg.light_d, glg.gl);
                mesh.material.set_uniform(Material.V3f, 'lightColor', glg.light_c, glg.gl);
                mesh.material.set_uniform(Material.V3f, 'cameraPos', glg.camera_pos, glg.gl);
                mesh.material.set_uniform(Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
                mesh.material.set_uniform(Material.M4f, 'modelMatrix', this.m, glg.gl);
                mesh.material.set_uniform(Material.M3f, 'normalMatrix', this.nm, glg.gl);
            }
        }
    }

    draw(glg) {
        this.earlydraw(glg);

        for (var ms in this.Mesh) {
            var mesh = this.Mesh[ms];
            mesh.material.set_uniform(Material.V4f, 'lightDirection', glg.light_d, glg.gl);
            mesh.material.set_uniform(Material.V3f, 'cameraPos', glg.camera_pos, glg.gl);
            mesh.material.set_uniform(Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
            mesh.material.set_uniform(Material.M4f, 'modelMatrix', this.m, glg.gl);
            mesh.material.set_uniform(Material.M3f, 'normalMatrix', this.nm, glg.gl);
            mesh.draw(glg.gl);
        }

        this.latedraw(glg);
    }

    earlydraw(gl){}

    latedraw(gl){}

    make_transform() {
        var rot = glm.quat.create();
        glm.quat.rotateX(rot, rot, this.rotate.x);
        glm.quat.rotateY(rot, rot, this.rotate.y);
        glm.quat.rotateZ(rot, rot, this.rotate.z);
        glm.mat4.fromRotationTranslationScale(this.m, rot, this.position, this.scale);
        glm.mat3.normalFromMat4(this.nm, this.m);
    }

    set_pos(x, y, z) {
        this.position = glm.vec3.fromValues(x, y, z);
        this.make_transform();
    }

    set_rx(x) {
        this.rotate.x = x;
        this.make_transform();
    }
    set_ry(y) {
        this.rotate.y = y;
        this.make_transform();
    }
    set_rz(z) {
        this.rotate.z = z;
        this.make_transform();
    }

    set_scale(x, y, z) {
        this.scale = glm.vec3.fromValues(x, y, z);
        this.make_transform();
    }



}
