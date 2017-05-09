
class Material {

    constructor(ver_path, fra_path, gl) {
        this.vs = create_shader(ver_path, gl, gl.VERTEX_SHADER);
        this.fs = create_shader(fra_path, gl, gl.FRAGMENT_SHADER);
        this.prog = create_program(this.vs, this.fs, gl);
        this.uniforms = {};
    }

    use(gl) {
        gl.useProgram(this.prog);
    }

    //value:数据类型传入数组，纹理类型传入Texture  此前需要useProgram
    set_uniform(type, name, value, gl) {
        gl.useProgram(this.prog);
        switch (type) {
            case Material.M4f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniformMatrix4fv(this.uniforms[name], false, value);
                this.uniforms[name].value = value;
                break;
            case Material.M3f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniformMatrix3fv(this.uniforms[name], false, value);
                this.uniforms[name].value = value;
                break;
            case Material.V3f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniform3fv(this.uniforms[name], value);
                this.uniforms[name].value = value;
                break;
            case Material.V4f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniform4fv(this.uniforms[name], value);
                this.uniforms[name].value = value;
                break;
            case Material.I1i:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniform1i(this.uniforms[name], value.index);
                this.uniforms[name].value = value;
                break;
            case Material._1f:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniform1f(this.uniforms[name], value);
                this.uniforms[name].value = value;
                break;
            case Material._1b:
                this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                gl.uniform1i(this.uniforms[name], value);
                this.uniforms[name].value = value;
                break;
        }

    }
}

Material.M4f = "2331";
Material.M3f = "2332";

Material.V3f = "2341";
Material.V4f = "2342";

Material.I1i = "2351";

Material._1f = "2361";
Material._1b = "2361";