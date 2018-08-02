import * as glm from 'gl-matrix';
import { Mesh } from './Mesh';
import { GLg } from '../GLCore/GL';
import { MTL_TYPE } from './Material';
import { CTransform } from '../component/CTransform';


export class Transform extends CTransform {
    Mesh: Mesh[];


    constructor() {
        super();
        this.Mesh = [];
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
                mesh.material.set_uniform[MTL_TYPE.V4f]('lightDirection', glg.light_d, glg.gl);
                mesh.material.set_uniform[MTL_TYPE.V3f]('lightColor', glg.light_c, glg.gl);
                mesh.material.set_uniform[MTL_TYPE.V3f]('cameraPos', glg.camera_pos, glg.gl);
                mesh.material.set_uniform[MTL_TYPE.M4f]('mvpMatrix', glg.mvp, glg.gl);
                mesh.material.set_uniform[MTL_TYPE.M4f]('modelMatrix', this.m, glg.gl);
                mesh.material.set_uniform[MTL_TYPE.M3f]('normalMatrix', this.nm, glg.gl);
            });
        }
    }

    draw(glg: GLg) {
        this.earlyDarwFuncs.forEach(element => {
            element(this, glg);
        });

        this.Mesh.forEach(mesh => {
            mesh.material.set_uniform[MTL_TYPE.V4f]('lightDirection', glg.light_d, glg.gl);
            mesh.material.set_uniform[MTL_TYPE.V3f]('cameraPos', glg.camera_pos, glg.gl);
            mesh.material.set_uniform[MTL_TYPE.M4f]('mvpMatrix', glg.mvp, glg.gl);
            mesh.material.set_uniform[MTL_TYPE.M4f]('modelMatrix', this.m, glg.gl);
            mesh.material.set_uniform[MTL_TYPE.M3f]('normalMatrix', this.nm, glg.gl);
            mesh.draw(glg.gl);
        });

        this.lateDarwFuncs.forEach(element => {
            element(this, glg);
        });
    }


}
