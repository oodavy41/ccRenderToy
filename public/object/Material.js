class Material {
    const
    var M4f = "2331",
        V3f = "2332",
        I1i = "2333";

    constructor(ver_path, fra_path, gl) {
        this.vs = create_shader(ver_path, gl, gl.VERTEX_SHADER);
        this.fs = create_shader(fra_path, gl, gl.FRAGMENT_SHADER);
        this.prog = create_program(this.vs, this.fs, gl);
        this.uniforms = {};
    }

    use(gl) {
        gl.useProgram(this.prog);
    }

    //value:数据类型传入数组，纹理类型传入Texture.texture
    set_uniform(type, name, value, gl) {
        switch (type) {
            case M4f:
                this.uniforms[name] = gl.getUniformLocation(that.prog, name);
                gl.uniformMatrix4fv(uni, false, value);
                break;
            case V3f:
                this.uniforms[name] = gl.getUniformLocation(that.prog, name);
                gl.uniform3fv(uni, value);
                break;
            case I1i:
                this.uniforms[name] = gl.getUniformLocation(that.prog, name);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, value);
                gl.uniform1i(uni, 0);
                break;
        }

    }


}
