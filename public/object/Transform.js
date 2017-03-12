class Transform {
    constructor() {
        this.m = mat4.create();
        this.Mesh = [];
        this.position = vec3.fromValues(0, 0, 0);
        this.rotate.x = 0;
        this.rotate.y = 0;
        this.rotate.z = 0;
        this.scale = vec3.formValues(1, 1, 1);
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
                mesh.material.set_uniform(Material.V3f, 'lightDirection', glg.light_d, glg.gl);
                mesh.material.set_uniform(Material.V3f, 'lightColor', glg.light_c, glg.gl);
                mesh.material.set_uniform(Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
                mesh.material.set_uniform(Material.M4f, 'modelMatrix', this.m, glg.gl);
            }
        }
    }

    draw(gl) {
        for (var mesh in this.Mesh)
            mesh.draw(gl);
    }



    make_transform() {
        var rot = quat.create();
        quat.rotateX(rot, rot, this.rotate.x);
        quat.rotateY(rot, rot, this.rotate.y);
        quat.rotateZ(rot, rot, this.rotate.z);
        mat4.fromRotationTranslationScale(this.m, rot, this.position, this.scale);
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
