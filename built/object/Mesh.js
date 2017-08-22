System.register(["../glfuncs"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var glfuncs_1, Mesh;
    return {
        setters: [
            function (glfuncs_1_1) {
                glfuncs_1 = glfuncs_1_1;
            }
        ],
        execute: function () {
            Mesh = (function () {
                //
                //arr格式 [[name,[arr],length],[name1,[arr1],len]...,[index_arr]]
                function Mesh() {
                    this.arr_bkup = {};
                    this.arrs = null;
                    this.material = null;
                    this.arr_bkup = {};
                    this.index_buffer = null;
                    this.index_length = 0;
                }
                Mesh.prototype.set_mesh = function (arr) {
                    this.arrs = arr;
                };
                Mesh.prototype.set_mat = function (mat) {
                    this.material = mat;
                };
                Mesh.prototype.init = function (gl) {
                    var program = this.material.prog;
                    if (!program)
                        console.log("no Program Binded!");
                    for (var i = 0, l = this.arrs.length; i < l; i++) {
                        var arr = this.arrs[i];
                        if (i < l - 1)
                            this.arr_bkup[arr[0]] = glfuncs_1.upload_array_att(arr[1], arr[0], program, gl);
                        else {
                            this.index_buffer = glfuncs_1.create_ibo(arr, gl);
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
                            this.index_length = arr.length;
                        }
                    }
                };
                Mesh.prototype.draw = function (gl) {
                    this.material.use(gl);
                    for (var i = 0, l = this.arrs.length - 1; i < l; i++) {
                        var arr = this.arrs[i];
                        if (this.arr_bkup[arr[0]]) {
                            gl.bindBuffer(gl.ARRAY_BUFFER, this.arr_bkup[arr[0]].vbo);
                            gl.vertexAttribPointer(this.arr_bkup[arr[0]].att, arr[2], gl.FLOAT, false, 0, 0);
                        }
                    }
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
                    gl.drawElements(gl.TRIANGLES, this.index_length, gl.UNSIGNED_SHORT, 0);
                };
                return Mesh;
            }());
            exports_1("Mesh", Mesh);
        }
    };
});
