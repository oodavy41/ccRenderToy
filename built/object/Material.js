System.register(["../glfuncs"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var glfuncs_1, Material;
    return {
        setters: [
            function (glfuncs_1_1) {
                glfuncs_1 = glfuncs_1_1;
            }
        ],
        execute: function () {
            Material = (function () {
                function Material(ver_path, fra_path, gl) {
                    this.vs = glfuncs_1.create_shader(ver_path, gl, gl.VERTEX_SHADER);
                    this.fs = glfuncs_1.create_shader(fra_path, gl, gl.FRAGMENT_SHADER);
                    this.prog = glfuncs_1.create_program(this.vs, this.fs, gl);
                    this.textures = [];
                    this.uniforms = {};
                }
                Material.prototype.use = function (gl) {
                    gl.useProgram(this.prog);
                    this.textures.forEach(function (element) {
                        element.bind(gl);
                    });
                };
                //value:数据类型传入数组，纹理类型传入Texture  此前需要useProgram
                Material.prototype.set_uniform = function (type, name, value, gl) {
                    gl.useProgram(this.prog);
                    switch (type) {
                        case Material.M4f:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniformMatrix4fv(this.uniforms[name], false, value);
                                this.uniforms[name].value = value;
                            }
                            break;
                        case Material.M3f:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniformMatrix3fv(this.uniforms[name], false, value);
                                this.uniforms[name].value = value;
                            }
                            break;
                        case Material.V3f:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniform3fv(this.uniforms[name], value);
                                this.uniforms[name].value = value;
                            }
                            break;
                        case Material.V4f:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniform4fv(this.uniforms[name], value);
                                this.uniforms[name].value = value;
                            }
                            break;
                        case Material.I1i:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniform1i(this.uniforms[name], value.index);
                                this.uniforms[name].value = value;
                            }
                            break;
                        case Material._1f:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniform1f(this.uniforms[name], value);
                                this.uniforms[name].value = value;
                            }
                            break;
                        case Material._1b:
                            this.uniforms[name] = gl.getUniformLocation(this.prog, name);
                            if (this.uniforms[name]) {
                                gl.uniform1i(this.uniforms[name], value);
                                this.uniforms[name].value = value;
                            }
                            break;
                    }
                };
                Material.M4f = "2331";
                Material.M3f = "2332";
                Material.V3f = "2341";
                Material.V4f = "2342";
                Material.I1i = "2351";
                Material._1f = "2361";
                Material._1b = "2361";
                return Material;
            }());
            exports_1("Material", Material);
        }
    };
});
