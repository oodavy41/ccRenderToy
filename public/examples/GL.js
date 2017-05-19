class GLg {
    constructor() {
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

    create(id) {
        this.gl = initgl(id);
    }

    set_light(direction, color) {
        this.light_c = color;
        this.light_d = direction;
    }

    set_cam_pos(pos) {
        this.camera_pos = vec3.fromValues(pos[0], pos[1], pos[2]);
        this.makemvp();
    }

    set_cam_front(f) {
        this.camera_front = vec3.fromValues(f[0], f[1], f[2]);
        this.makemvp();
    }

    make_cam_look() {
        var pos = this.camera_pos;
        var front = this.camera_front;
        return [pos[0] + front[0], pos[1] + front[1], pos[2] + front[2]];
    }

    set_cam_up(up) {
        this.camera_up = vec3.fromValues(up[0], up[1], up[2]);
        this.makemvp();
    }

    set_cam_info(info) {
        this.camera_info = info;
        this.makemvp();
    }

    //设定初始相机朝向，作为今后视角转向基础
    set_cam_ptype() {
        this.camera_ptype = this.make_cam_look();
    }

    makemvp() {
        if (this.camera_pos && this.camera_front && this.camera_up && this.camera_info) {
            this.mvp = makeMvp([this.camera_pos, this.make_cam_look(), this.camera_up], this.camera_info);
            this.camera_right = vec3.create();
            vec3.cross(this.camera_right, this.camera_front, this.camera_up);
        }
    }

    fps_ctrl() {
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


        this.fps_angel[0] = Math.min(this.fps_angel[0], Math.PI / 2-0.04);
        this.fps_angel[0] = Math.max(this.fps_angel[0], -Math.PI / 2-0.04);
        if (this.fps_angel[1] > Math.PI)
            this.fps_angel[1] += -Math.PI * 2;
        if (this.fps_angel[1] < -Math.PI)
            this.fps_angel[1] += Math.PI * 2;

        //console.log(this.fps_angel[0] + '|' + this.fps_angel[1] + '|' + ret[0] + '|' + ret[1]);


        var lookat = this.camera_ptype;
        var nlookat = vec3.create();
        vec3.rotateX(nlookat, lookat, this.camera_pos, this.fps_angel[0]);
        vec3.rotateY(nlookat, nlookat, this.camera_pos, this.fps_angel[1]);

        vec3.subtract(this.camera_front, nlookat, this.camera_pos);

        vec3.cross(this.camera_right, this.camera_front, this.camera_up);

        vec3.normalize(this.camera_front, this.camera_front);
        vec3.normalize(this.camera_right, this.camera_right);

        this.movectrl();

        this.makemvp();

        return ret;
    }

    movectrl() {
        var abf = vec3.create(), abr = vec3.create();
        var wasd = [
            this.camera_front,
            vec3.scale(abr, this.camera_right, -1),
            vec3.scale(abf, this.camera_front, -1),
            this.camera_right
        ]

        var ret = vec3.fromValues(0, 0, 0);

        for (var i = 0; i < 4; i++) {
            if (this.movement[i] === 1) {
                vec3.add(ret, ret, wasd[i]);
            }
        }

        vec3.normalize(ret, ret);

        vec3.scale(ret, ret, set.MoveSpeed);

        vec3.add(this.camera_pos, this.camera_pos, ret);
        vec3.add(this.camera_ptype, this.camera_ptype, ret);
    }


    //arr格式[[positions],[normals],[color/textureCood],[index],textureSrc]
    get_model(arr, flag) {
        var c4t2;
        switch (flag) {
            case this.COLOR:
                c4t2 = 4;
                break;
            case this.TEXTURE:
                c4t2 = 2;
                if (arr[4])
                    this.textures.push(create_texture(arr[4]));
                break;
        }

        this.vert_arr['pos'] = upload_array_att(
            arr[0], 'position', this.prog, this.gl, [3, this.gl.FLOAT, false, 0, 0]);

        this.vert_arr['nor'] = upload_array_att(
            arr[1], 'normal', this.prog, this.gl, [3, this.gl.FLOAT, false, 0, 0]);

        this.vert_arr['col/coo'] = upload_array_att(
            arr[2], 'color', this.prog, this.gl, [c4t2, this.gl.FLOAT, false, 0, 0]);

        this.vert_arr['ind'] = create_ibo(arr[3], this.gl);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vert_arr['ind']);
        this.IBOlength = arr[3].length;

    }

    //若传入texture需要传入经过create_texture返回的['tex']
    set_uniform(uni_arr) {
        var that = this;
        var gl = this.gl;
        uni_arr.forEach(function(e) {
            var uni;
            switch (e[0]) {
                case that.M4F:
                    uni = gl.getUniformLocation(that.prog, e[1]);
                    gl.uniformMatrix4fv(uni, false, e[2]);
                    break;
                case that.V3F:
                    uni = gl.getUniformLocation(that.prog, e[1]);
                    gl.uniform3fv(uni, e[2]);
                    break;
                case that.I1I:
                    uni = gl.getUniformLocation(that.prog, e[1]);
                    gl.activeTexture(gl.TEXTURE0);
                    gl.bindTexture(gl.TEXTURE_2D, e[2]);
                    gl.uniform1i(uni, 0);
                    break;
            }
            that.uniforms[e[1]] = uni;
        })
    }

    set_static_mvp(mvp) {
        this.stat_mvp_mat = mvp;
    }

    update() {
        var m = mat4.create();
        mat4.rotateY(m, this.stat_mvp_mat, (new Date()).getTime() / 1000);
        //mat4.rotateX(m, m, (new Date()).getTime() / 2000);
        //mat4.rotateZ(m, m, (new Date()).getTime() / 3000);
        this.gl.uniformMatrix4fv(this.uniforms['mvpMatrix'], false, m);

        this.gl.drawElements(this.gl.TRIANGLES, this.IBOlength, this.gl.UNSIGNED_SHORT, 0);
    }
}
