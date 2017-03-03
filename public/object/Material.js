class Material {

    constructor(ver_path, fra_path, gl) {
        this.vs = create_shader(ver_path, gl, gl.VERTEX_SHADER);
        this.fs = create_shader(fra_path, gl, gl.FRAGMENT_SHADER);
        this.prog = create_program(this.vs, this.fs, gl);
    }
}
