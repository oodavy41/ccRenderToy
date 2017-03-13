class Transform {
    constructor() {
        this.m = mat4.create();
        this.nm = mat3.create();
        this.Mesh = [];
        this.position = vec3.fromValues(0, 0, 0);
        this.rotate = {};
        this.rotate.x = 0;
        this.rotate.y = 0;
        this.rotate.z = 0;
        this.scale = vec3.fromValues(1, 1, 1);
        this.make_transform();
    }

    add_mesh(mesh){
        this.Mesh.push(mesh);
    }

    init(glg) {
        if (!(glg.mvp && glg.light_d && glg.light_c)) {
            console.log('no camera or light info');
        } else {
            for (var mesh in this.Mesh) {
                mesh = this.Mesh[mesh];
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

    draw(gl) {
        for (var mesh in this.Mesh) {
            mesh = this.Mesh[mesh];
            mesh.material.set_uniform(Material.M4f, 'modelMatrix', this.m, gl);
            mesh.material.set_uniform(Material.M3f, 'normalMatrix', this.nm, gl);
            mesh.draw(gl);
        }
    }



    make_transform() {
        var rot = quat.create();
        quat.rotateX(rot, rot, this.rotate.x);
        quat.rotateY(rot, rot, this.rotate.y);
        quat.rotateZ(rot, rot, this.rotate.z);
        mat4.fromRotationTranslationScale(this.m, rot, this.position, this.scale);
        mat3.normalFromMat4(this.nm, this.m);
    }

    set_pos(x, y, z) {
        this.position = vec3.fromValues(x, y, z);
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
        this.scale = vec3.formValues(x, y, z);
        this.make_transform();
    }



}
