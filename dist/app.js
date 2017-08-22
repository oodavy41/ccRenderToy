/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, !(function webpackMissingModule() { var e = new Error("Cannot find module \"gl-matrix\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, gl_matrix_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function initgl(id) {
        var glc = document.getElementById(id);
        var gl = glc.getContext('webgl');
        if (!gl) {
            alert('no support for Webgl in this browser\nWEBGL无法在此浏览器初始化');
            return;
        }
        gl.clearColor(0.3, 0.3, 0.3, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.depthFunc(gl.LEQUAL);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        return gl;
    }
    exports.initgl = initgl;
    function glclear(gl) {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
    exports.glclear = glclear;
    function create_shader(path, gl, type) {
        var shader;
        var shaderSRC = loadFile(path);
        shader = gl.createShader(type);
        gl.shaderSource(shader, shaderSRC);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            return shader;
        else
            console.log(type.toString() + ":" + gl.getShaderInfoLog(shader));
    }
    exports.create_shader = create_shader;
    function create_program(vs, fs, gl) {
        var program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            return program;
        }
        else
            console.log('pro:' + gl.getProgramInfoLog(program));
    }
    exports.create_program = create_program;
    function create_vbo(data, gl) {
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }
    exports.create_vbo = create_vbo;
    function create_ibo(data, gl) {
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    }
    exports.create_ibo = create_ibo;
    function loadFile(path) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', path, false);
        xhr.send();
        if (xhr.status == 200)
            return xhr.responseText;
        else
            console.log("no such file:" + path);
    }
    exports.loadFile = loadFile;
    function makeMvp(view3v, pers4f) {
        var mMat = gl_matrix_1.mat4.create();
        var vMat = gl_matrix_1.mat4.create();
        var pMat = gl_matrix_1.mat4.create();
        var mvp = gl_matrix_1.mat4.create();
        gl_matrix_1.mat4.lookAt(vMat, view3v[0], view3v[1], view3v[2]);
        gl_matrix_1.mat4.perspective(pMat, pers4f[0], pers4f[1], pers4f[2], pers4f[3]);
        gl_matrix_1.mat4.multiply(mvp, pMat, vMat);
        gl_matrix_1.mat4.multiply(mvp, mvp, mMat);
        return mvp;
    }
    exports.makeMvp = makeMvp;
    function upload_array_att(array, att_name, program, gl) {
        var att = gl.getAttribLocation(program, att_name);
        if (att === -1) {
            console.log('no attribute called:' + att_name);
            return null;
        }
        var vbo = create_vbo(array, gl);
        gl.enableVertexAttribArray(att);
        return {
            'att': att,
            'vbo': vbo
        };
    }
    exports.upload_array_att = upload_array_att;
    // export function static_uni(arr:number[], smvp:mat4) {
    //     var ret = vec4.create();
    //     vec4.transformMat4(ret, arr, smvp);
    //     return [ret[0], ret[1], ret[2]];
    // }
    function create_texture(src, gl) {
        var img = new Image();
        var texture;
        img.onload = function () {
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        img.src = src;
        return {
            'img': img,
            'tex': texture
        };
    }
    exports.create_texture = create_texture;
    function set_obj_info(obj, fun) {
        for (var tran in obj) {
            fun(obj[tran]);
        }
    }
    exports.set_obj_info = set_obj_info;
    function rewrite_edraw(obj, fun) {
        for (var tran in obj) {
            obj[tran].earlydraw = fun;
        }
    }
    exports.rewrite_edraw = rewrite_edraw;
    function rewrite_ldraw(obj, fun) {
        for (var tran in obj) {
            obj[tran].latedraw = fun;
        }
    }
    exports.rewrite_ldraw = rewrite_ldraw;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, glfuncs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Material = (function () {
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
    exports.Material = Material;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, !(function webpackMissingModule() { var e = new Error("Cannot find module \"gl-matrix\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, glm, glfuncs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GLg = (function () {
        function GLg() {
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
        GLg.prototype.create = function (id) {
            this.gl = glfuncs_1.initgl(id);
        };
        GLg.prototype.set_light = function (direction, color) {
            this.light_c = color;
            this.light_d = direction;
        };
        GLg.prototype.set_cam_pos = function (pos) {
            this.camera_pos = glm.vec3.fromValues(pos[0], pos[1], pos[2]);
            this.makemvp();
        };
        GLg.prototype.set_cam_front = function (f) {
            this.camera_front = glm.vec4.fromValues(f[0], f[1], f[2], f[3]);
            this.makemvp();
        };
        GLg.prototype.make_cam_look = function () {
            if (this.camera_front[3] == 0) {
                var pos = this.camera_pos;
                var front = this.camera_front;
                return [pos[0] + front[0], pos[1] + front[1], pos[2] + front[2]];
            }
            else
                return [this.camera_front[0], this.camera_front[1], this.camera_front[2]];
        };
        GLg.prototype.set_cam_up = function (up) {
            this.camera_up = glm.vec3.fromValues(up[0], up[1], up[2]);
            this.makemvp();
        };
        GLg.prototype.set_cam_info = function (info) {
            this.camera_info = info;
            this.makemvp();
        };
        //设定初始相机朝向，作为今后视角转向基础
        GLg.prototype.set_cam_ptype = function () {
            this.camera_ptype = this.make_cam_look();
        };
        GLg.prototype.makemvp = function () {
            if (this.camera_pos && this.camera_front && this.camera_up && this.camera_info) {
                this.mvp = glfuncs_1.makeMvp([this.camera_pos, this.make_cam_look(), this.camera_up], this.camera_info);
                this.camera_right = glm.vec3.create();
                glm.vec3.cross(this.camera_right, this.camera_front, this.camera_up);
            }
        };
        GLg.prototype.fps_ctrl = function () {
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
            this.fps_angel[0] = Math.min(this.fps_angel[0], Math.PI / 2 - 0.04);
            this.fps_angel[0] = Math.max(this.fps_angel[0], -Math.PI / 2 - 0.04);
            if (this.fps_angel[1] > Math.PI)
                this.fps_angel[1] += -Math.PI * 2;
            if (this.fps_angel[1] < -Math.PI)
                this.fps_angel[1] += Math.PI * 2;
            //console.log(this.fps_angel[0] + '|' + this.fps_angel[1] + '|' + ret[0] + '|' + ret[1]);
            var lookat = this.camera_ptype;
            var nlookat = glm.vec3.create();
            glm.vec3.rotateX(nlookat, lookat, this.camera_pos, this.fps_angel[0]);
            glm.vec3.rotateY(nlookat, nlookat, this.camera_pos, this.fps_angel[1]);
            glm.vec3.subtract(this.camera_front, nlookat, this.camera_pos);
            glm.vec3.cross(this.camera_right, this.camera_front, this.camera_up);
            glm.vec3.normalize(this.camera_front, this.camera_front);
            glm.vec3.normalize(this.camera_right, this.camera_right);
            this.movectrl();
            this.makemvp();
            return ret;
        };
        GLg.prototype.movectrl = function () {
            var abf = glm.vec3.create(), abr = glm.vec3.create();
            var wasd = [
                this.camera_front,
                glm.vec3.scale(abr, this.camera_right, -1),
                glm.vec3.scale(abf, this.camera_front, -1),
                this.camera_right
            ];
            var ret = glm.vec3.fromValues(0, 0, 0);
            for (var i = 0; i < 4; i++) {
                if (this.movement[i] === 1) {
                    glm.vec3.add(ret, ret, wasd[i]);
                }
            }
            glm.vec3.normalize(ret, ret);
            glm.vec3.scale(ret, ret, set.MoveSpeed);
            glm.vec3.add(this.camera_pos, this.camera_pos, ret);
            glm.vec3.add(this.camera_ptype, this.camera_ptype, ret);
        };
        GLg.prototype.set_static_mvp = function (mvp) {
            this.stat_mvp_mat = mvp;
        };
        return GLg;
    }());
    exports.GLg = GLg;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, !(function webpackMissingModule() { var e = new Error("Cannot find module \"gl-matrix\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()), __webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, glm, Material_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Transform = (function () {
        function Transform() {
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
        Transform.prototype.add_mesh = function (mesh) {
            this.Mesh.push(mesh);
        };
        Transform.prototype.init = function (glg) {
            if (!(glg.mvp && glg.light_d && glg.light_c)) {
                console.log('no camera or light info');
            }
            else {
                for (var ms in this.Mesh) {
                    var mesh = this.Mesh[ms];
                    mesh.init(glg.gl);
                    mesh.material.set_uniform(Material_1.Material.V4f, 'lightDirection', glg.light_d, glg.gl);
                    mesh.material.set_uniform(Material_1.Material.V3f, 'lightColor', glg.light_c, glg.gl);
                    mesh.material.set_uniform(Material_1.Material.V3f, 'cameraPos', glg.camera_pos, glg.gl);
                    mesh.material.set_uniform(Material_1.Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
                    mesh.material.set_uniform(Material_1.Material.M4f, 'modelMatrix', this.m, glg.gl);
                    mesh.material.set_uniform(Material_1.Material.M3f, 'normalMatrix', this.nm, glg.gl);
                }
            }
        };
        Transform.prototype.draw = function (glg) {
            this.earlydraw(glg);
            for (var ms in this.Mesh) {
                var mesh = this.Mesh[ms];
                mesh.material.set_uniform(Material_1.Material.V4f, 'lightDirection', glg.light_d, glg.gl);
                mesh.material.set_uniform(Material_1.Material.V3f, 'cameraPos', glg.camera_pos, glg.gl);
                mesh.material.set_uniform(Material_1.Material.M4f, 'mvpMatrix', glg.mvp, glg.gl);
                mesh.material.set_uniform(Material_1.Material.M4f, 'modelMatrix', this.m, glg.gl);
                mesh.material.set_uniform(Material_1.Material.M3f, 'normalMatrix', this.nm, glg.gl);
                mesh.draw(glg.gl);
            }
            this.latedraw(glg);
        };
        Transform.prototype.earlydraw = function (gl) { };
        Transform.prototype.latedraw = function (gl) { };
        Transform.prototype.make_transform = function () {
            var rot = glm.quat.create();
            glm.quat.rotateX(rot, rot, this.rotate.x);
            glm.quat.rotateY(rot, rot, this.rotate.y);
            glm.quat.rotateZ(rot, rot, this.rotate.z);
            glm.mat4.fromRotationTranslationScale(this.m, rot, this.position, this.scale);
            glm.mat3.normalFromMat4(this.nm, this.m);
        };
        Transform.prototype.set_pos = function (x, y, z) {
            this.position = glm.vec3.fromValues(x, y, z);
            this.make_transform();
        };
        Transform.prototype.set_rx = function (x) {
            this.rotate.x = x;
            this.make_transform();
        };
        Transform.prototype.set_ry = function (y) {
            this.rotate.y = y;
            this.make_transform();
        };
        Transform.prototype.set_rz = function (z) {
            this.rotate.z = z;
            this.make_transform();
        };
        Transform.prototype.set_scale = function (x, y, z) {
            this.scale = glm.vec3.fromValues(x, y, z);
            this.make_transform();
        };
        return Transform;
    }());
    exports.Transform = Transform;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, glfuncs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Mesh = (function () {
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
    exports.Mesh = Mesh;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(6), __webpack_require__(0), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, GLOBAL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Texture = (function () {
        function Texture(src, gl, mat) {
            this.index = mat.textures.length;
            mat.textures.push(this);
            this.img = new Image();
            var that = this;
            this.img.onload = function () {
                that.texture = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0 + that.index);
                console.log('tex', that.index + ':' + src);
                gl.bindTexture(gl.TEXTURE_2D, that.texture);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D, null);
                GLOBAL_1.loadProg--;
                GLOBAL_1.progress.innerText = GLOBAL_1.loadProg + '';
                GLOBAL_1.promise();
            };
            this.img.src = src;
            GLOBAL_1.loadProg++;
            GLOBAL_1.progress.innerText = GLOBAL_1.loadProg + '';
        }
        Texture.prototype.bind = function (gl) {
            gl.activeTexture(gl.TEXTURE0 + this.index);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
        };
        return Texture;
    }());
    exports.Texture = Texture;
    var CubeTexture = (function () {
        //src:[+x,-x,+y,-y,+z,-z]
        function CubeTexture(src, gl, mat) {
            this.index = mat.textures.length;
            mat.textures.push(this);
            this.img = new Array(6);
            var that = this;
            this.cubePromise = 0;
            for (var i = 0; i < 6; i++) {
                this.img[i] = new Image();
                this.img[i].onload = function () {
                    that.cubePromise++;
                    console.log('cubemap', that.index + ':' + this.src);
                    if (that.cubePromise == 6) {
                        that.texture = gl.createTexture();
                        gl.activeTexture(gl.TEXTURE0 + that.index);
                        gl.bindTexture(gl.TEXTURE_CUBE_MAP, that.texture);
                        var targets = [
                            gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                        ];
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
                        for (var j in targets) {
                            gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, that.img[j]);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                        }
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                        GLOBAL_1.loadProg--;
                        GLOBAL_1.progress.innerText = GLOBAL_1.loadProg + '';
                        GLOBAL_1.promise();
                    }
                };
                this.img[i].src = src[i];
            }
            GLOBAL_1.loadProg++;
            GLOBAL_1.progress.innerText = GLOBAL_1.loadProg + '';
        }
        CubeTexture.prototype.bind = function (gl) {
            gl.activeTexture(gl.TEXTURE0 + this.index);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        };
        return CubeTexture;
    }());
    exports.CubeTexture = CubeTexture;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.statuss = document.getElementById('statuss');
    exports.progress = document.getElementById('progress');
    exports.loadProg = 0;
    exports.att_p = 'position';
    exports.att_uv = 'coord';
    exports.att_n = 'normal';
    exports.att_c = 'color';
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(2), __webpack_require__(8), __webpack_require__(1), __webpack_require__(9), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, glfuncs_1, GL_1, loader_1, Material_1, baseModels_1, GLOBAL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onload = function () {
        var glc = document.getElementById('wobaglccc');
        var fps = document.getElementById('fps');
        var date = new Date();
        GLOBAL_1.thegl = new GL_1.GLg();
        glc.addEventListener('click', can_on_click);
        window.addEventListener('mousemove', on_mouse_move);
        window.addEventListener('keypress', on_key_press);
        window.addEventListener('keyup', on_key_up);
        var light_direction = [-10, 0, -1, 0];
        var light_color = [1, 1, 1];
        var camera_pos = [-3, 6, 6];
        var camera_front = [0, 0, -1];
        var camera_up = [0, 1, 0];
        var camera_info = [Math.PI / 3, glc.width / glc.height, 0.01, 100];
        GLOBAL_1.thegl.create('wobaglccc');
        GLOBAL_1.thegl.set_light(light_direction, light_color);
        GLOBAL_1.thegl.set_cam_pos(camera_pos);
        GLOBAL_1.thegl.set_cam_front(camera_front);
        GLOBAL_1.thegl.set_cam_up(camera_up);
        GLOBAL_1.thegl.set_cam_info(camera_info);
        GLOBAL_1.thegl.set_cam_ptype();
        var resPah = "../resource/";
        //----------------------------------
        var sb = baseModels_1.skybox([
            resPah + 'skyboxs/bs2/X.png',
            resPah + 'skyboxs/bs2/-X.png',
            resPah + 'skyboxs/bs2/Y.png',
            resPah + 'skyboxs/bs2/-Y.png',
            resPah + 'skyboxs/bs2/Z.png',
            resPah + 'skyboxs/bs2/-Z.png'
        ], GLOBAL_1.thegl.gl);
        glfuncs_1.rewrite_edraw(sb, function (glg) {
            this.set_pos(GLOBAL_1.thegl.camera_pos[0], GLOBAL_1.thegl.camera_pos[1], GLOBAL_1.thegl.camera_pos[2]);
            glg.gl.cullFace(glg.gl.FRONT);
        });
        glfuncs_1.rewrite_ldraw(sb, function (glg) {
            glg.gl.cullFace(glg.gl.BACK);
        });
        //----------------------------------
        var objs1 = loader_1.objLoader(resPah + 'models/mwzz/', 'mwzz.obj', GLOBAL_1.thegl.mtllib, GLOBAL_1.thegl.gl, 'anim_phone');
        var objs11 = loader_1.objLoader(resPah + 'models/mwzz/', 'mwzz.obj', GLOBAL_1.thegl.mtllib, GLOBAL_1.thegl.gl, 'anim_edge_phone');
        glfuncs_1.rewrite_edraw(objs11, function (glg) {
            glg.gl.cullFace(glg.gl.FRONT);
        });
        glfuncs_1.rewrite_ldraw(objs11, function (glg) {
            glg.gl.cullFace(glg.gl.BACK);
        });
        //----------------------------------
        var objs2 = loader_1.objLoader(resPah + 'models/mwzz/', 'mwzz.obj', GLOBAL_1.thegl.mtllib, GLOBAL_1.thegl.gl, 'text_phone');
        glfuncs_1.set_obj_info(objs2, function (tran) {
            tran.set_pos(0, 0, 2);
        });
        //----------------------------------
        var objsrefl = loader_1.objLoader(resPah + 'models/mwzz/', 'mwzz.obj', GLOBAL_1.thegl.mtllib, GLOBAL_1.thegl.gl, 'reflect_mat');
        glfuncs_1.set_obj_info(objsrefl, function (tran) {
            tran.Mesh[0].material.set_uniform(Material_1.Material.I1i, 'tex', sb[0].Mesh[0].material.uniforms['tex'].value, GLOBAL_1.thegl.gl);
            tran.set_pos(0, 0, 4);
        });
        //----------------------------------
        var objsrefr = loader_1.objLoader(resPah + 'models/mwzz/', 'mwzz.obj', GLOBAL_1.thegl.mtllib, GLOBAL_1.thegl.gl, 'refract_mat');
        glfuncs_1.set_obj_info(objsrefr, function (tran) {
            tran.Mesh[0].material.set_uniform(Material_1.Material.I1i, 'tex', sb[0].Mesh[0].material.uniforms['tex'].value, GLOBAL_1.thegl.gl);
            tran.Mesh[0].material.set_uniform(Material_1.Material._1f, 'ratio', 1 / 1.52, GLOBAL_1.thegl.gl);
            tran.set_pos(0, 0, 6);
        });
        //----------------------------------
        var objs3 = baseModels_1.donghnut(30, 36, 1, 3, GLOBAL_1.thegl);
        glfuncs_1.set_obj_info(objs3, function (tran) {
            tran.set_pos(10, 3, 2);
            tran.Mesh[0].material.set_uniform(Material_1.Material.I1i, 'tex', sb[0].Mesh[0].material.uniforms['tex'].value, GLOBAL_1.thegl.gl);
        });
        glfuncs_1.rewrite_edraw(objs3, function () {
            var metalless = parseFloat(document.getElementById('metals').value);
            var smoothness = parseFloat(document.getElementById('smooths').value);
            this.Mesh[0].material.set_uniform(Material_1.Material._1f, 'metalless', metalless, GLOBAL_1.thegl.gl);
            this.Mesh[0].material.set_uniform(Material_1.Material._1f, 'smoothness', smoothness, GLOBAL_1.thegl.gl);
            this.set_rz(date.getTime() / 2000);
            this.set_rx(date.getTime() / 1000);
        });
        //----------------------------------
        var objs = [sb, objs1, objs11, objs2, objsrefl, objsrefr, objs3];
        var update = function () {
            glfuncs_1.glclear(GLOBAL_1.thegl.gl);
            GLOBAL_1.thegl.fps_ctrl();
            for (var i = 0, l = objs.length; i < l; i++) {
                for (var tran in objs[i]) {
                    objs[i][tran].draw(GLOBAL_1.thegl);
                }
            }
            //============================fps display============
            var thisfps = 1000 / ((new Date()).getTime() - date.getTime());
            date = new Date();
            fps.textContent = 'FPS:' + parseInt(thisfps + "");
            GLOBAL_1.thegl.gl.flush();
            requestAnimationFrame(update);
        };
        GLOBAL_1.promise = function () {
            if (GLOBAL_1.loadProg == 0) {
                for (var i = 0, l = objs.length; i < l; i++) {
                    for (var tran in objs[i]) {
                        objs[i][tran].init(GLOBAL_1.thegl);
                    }
                }
                GLOBAL_1.statuss.innerText = 'Done';
                GLOBAL_1.progress.innerText = '';
                update();
            }
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(0), __webpack_require__(1), __webpack_require__(3), __webpack_require__(4), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, glfuncs_1, Material_1, Transform_1, Mesh_1, Texture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function objLoader(objpath, objname, mtllib, gl, mtlflag) {
        var obj = glfuncs_1.loadFile(objpath + objname);
        var regexp = {
            // v float float float
            vertex_pattern: /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
            // vn float float float
            normal_pattern: /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
            // vt float float
            uv_pattern: /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
            // f vertex vertex vertex
            face_vertex: /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
            // f vertex/uv vertex/uv vertex/uv
            face_vertex_uv: /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
            // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
            face_vertex_uv_normal: /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
            // f vertex//normal vertex//normal vertex//normal
            face_vertex_normal: /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
            // o object_name | g group_name
            object_pattern: /^[og]\s*(.+)?/,
            // s boolean
            smoothing_pattern: /^s\s+(\d+|on|off)/,
            // mtllib file_reference
            material_library_pattern: /^mtllib /,
            // usemtl material_name
            material_use_pattern: /^usemtl /
        };
        var retObjs = {};
        var state;
        var name;
        var vertices = [];
        var normals = [];
        var uvs = [];
        var temphash = {};
        if (obj.indexOf('\r\n') !== -1) {
            // This is faster than String.split with regex that splits on both
            obj = obj.replace(/\r\n/g, '\n');
        }
        if (obj.indexOf('\\\n') !== -1) {
            // join lines separated by a line continuation character (\)
            obj = obj.replace(/\\\n/g, '');
        }
        var lines = obj.split('\n');
        var line = '', lineFirstChar = '', lineSecondChar = '';
        var lineLength = 0;
        var result = [];
        function addFace(f, v, u, n) {
            v = (parseInt(v) - 1) * 3;
            u = (parseInt(u) - 1) * 2;
            n = (parseInt(n) - 1) * 3;
            var s;
            switch (f) {
                case 0:
                    s = v + '/' + u + '/' + n;
                    if (!temphash[s]) {
                        state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                        state.uvs.push(uvs[u], uvs[u + 1]);
                        state.normals.push(normals[n], normals[n + 1], normals[n + 2]);
                        state.indexs.push(state.size);
                        state.size++;
                    }
                    else
                        state.indexs.push(temphash[s]);
                    break;
                case 1:
                    s = v + '/' + u;
                    if (!temphash[s]) {
                        state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                        state.uvs.push(uvs[u], uvs[u + 1]);
                        state.indexs.push(state.size);
                        state.size++;
                    }
                    else
                        state.indexs.push(temphash[s]);
                    break;
                case 2:
                    s = v + '/' + '/' + n;
                    if (!temphash[s]) {
                        state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                        state.normals.push(normals[n], normals[n + 1], normals[n + 2]);
                        state.indexs.push(state.size);
                        state.size++;
                    }
                    else
                        state.indexs.push(temphash[s]);
                    break;
                case 3:
                    s = v;
                    if (!temphash[s]) {
                        state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                        state.indexs.push(state.size);
                        state.size++;
                    }
                    else
                        state.indexs.push(temphash[s]);
                    break;
            }
        }
        for (var i = 0, l = lines.length; i < l; i++) {
            line = lines[i];
            line = line.trim();
            lineLength = line.length;
            if (lineLength === 0)
                continue;
            lineFirstChar = line.charAt(0);
            // @todo invoke passed in handler if any
            if (lineFirstChar === '#')
                continue;
            if (lineFirstChar === 'v') {
                lineSecondChar = line.charAt(1);
                if (lineSecondChar === ' ' && (result = regexp.vertex_pattern.exec(line)) !== null) {
                    // 0                  1      2      3
                    // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                    vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                }
                else if (lineSecondChar === 'n' && (result = regexp.normal_pattern.exec(line)) !== null) {
                    // 0                   1      2      3
                    // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]
                    normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
                }
                else if (lineSecondChar === 't' && (result = regexp.uv_pattern.exec(line)) !== null) {
                    // 0               1      2
                    // ["vt 0.1 0.2", "0.1", "0.2"]
                    uvs.push(parseFloat(result[1]), parseFloat(result[2]));
                }
                else {
                    throw new Error("Unexpected vertex/normal/uv line: '" + line + "'");
                }
            }
            else if (lineFirstChar === "f") {
                if ((result = regexp.face_vertex_uv_normal.exec(line)) !== null) {
                    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
                    // 0                        1    2    3    4    5    6    7    8    9   10         11         12
                    // ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]
                    var e;
                    if (result[10] == undefined) {
                        e = [1, 4, 7];
                    }
                    else {
                        e = [1, 4, 7, 1, 7, 10];
                    }
                    e.forEach(function (e) {
                        addFace(0, result[e], result[e + 1], result[e + 2]);
                    });
                }
                else if ((result = regexp.face_vertex_uv.exec(line)) !== null) {
                    // f vertex/uv vertex/uv vertex/uv
                    // 0                  1    2    3    4    5    6   7          8
                    // ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]
                    var e;
                    if (result[7] == undefined) {
                        e = [1, 3, 5];
                    }
                    else {
                        e = [1, 3, 5, 1, 5, 7];
                    }
                    e.forEach(function (e) {
                        addFace(1, result[e], result[e + 1], undefined);
                    });
                }
                else if ((result = regexp.face_vertex_normal.exec(line)) !== null) {
                    // f vertex//normal vertex//normal vertex//normal
                    // 0                     1    2    3    4    5    6   7          8
                    // ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]
                    var e;
                    if (result[7] == undefined) {
                        e = [1, 3, 5];
                    }
                    else {
                        e = [1, 3, 5, 1, 5, 7];
                    }
                    e.forEach(function (e) {
                        addFace(2, result[e], undefined, result[e + 1]);
                    });
                }
                else if ((result = regexp.face_vertex.exec(line)) !== null) {
                    // f vertex vertex vertex
                    // 0            1    2    3   4
                    // ["f 1 2 3", "1", "2", "3", undefined]
                    var e;
                    if (result[4] == undefined) {
                        e = [1, 2, 3];
                    }
                    else {
                        e = [1, 2, 3, 1, 3, 4];
                    }
                    e.forEach(function (e) {
                        addFace(3, result[e], undefined, undefined);
                    });
                }
                else {
                    throw new Error("Unexpected face line: '" + line + "'");
                }
            }
            else if (lineFirstChar === "l") {
                /*var lineParts = line.substring(1).trim().split(" ");
                 var lineVertices = [],
                 lineUVs = [];
    
                 if (line.indexOf("/") === -1) {
    
                 lineVertices = lineParts;
    
                 } else {
    
                 for (var li = 0, llen = lineParts.length; li < llen; li++) {
    
                 var parts = lineParts[li].split("/");
    
                 if (parts[0] !== "") lineVertices.push(parts[0]);
                 if (parts[1] !== "") lineUVs.push(parts[1]);
    
                 }
    
                 }
                 state.addLineGeometry(lineVertices, lineUVs);*/
            }
            else if ((result = regexp.object_pattern.exec(line)) !== null) {
                // o object_name
                // or
                // g group_name
                // WORKAROUND: https://bugs.chromium.org/p/v8/issues/detail?id=2869
                // var name = result[ 0 ].substr( 1 ).trim();
                if (result[0].substr(1).trim() == 'default')
                    continue;
                if (state && name) {
                    var mesh = state.mesh;
                    mesh.set_mesh([
                        [att_p, state.vertices, 3],
                        [att_uv, state.uvs, 2],
                        [att_n, state.normals, 3],
                        state.indexs
                    ]);
                    retObjs[name].add_mesh(mesh);
                }
                state = {
                    mesh: null,
                    vertices: [],
                    normals: [],
                    uvs: [],
                    indexs: [],
                    size: 0
                };
                temphash = {};
                name = result[0].substr(1).trim();
                retObjs[name] = new Transform_1.Transform();
            }
            else if (regexp.material_use_pattern.test(line)) {
                // material
                //state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
                var matname = line.substring(7).trim() + mtlflag;
                if (state && state.mesh) {
                    var mesh = state.mesh;
                    mesh.set_mesh([
                        [att_p, state.vertices, 3],
                        [att_uv, state.uvs, 2],
                        [att_n, state.normals, 3],
                        state.indexs
                    ]);
                    retObjs[name].add_mesh(mesh);
                }
                state = {
                    mesh: null,
                    vertices: [],
                    normals: [],
                    uvs: [],
                    indexs: [],
                    size: 0
                };
                temphash = {};
                state.mesh = new Mesh_1.Mesh();
                if (!mtllib[matname])
                    console.log('no such mtl:' + matname);
                state.mesh.set_mat(mtllib[matname]);
            }
            else if (regexp.material_library_pattern.test(line)) {
                // mtl file
                mtlLoader(objpath, line.substring(7).trim(), mtllib, gl, mtlflag);
            }
            else if ((result = regexp.smoothing_pattern.exec(line)) !== null) {
                // smooth shading
                // @todo Handle files that have varying smooth values for a set of faces inside one geometry,
                // but does not define a usemtl for each face set.
                // This should be detected and a dummy material created (later MultiMaterial and geometry groups).
                // This requires some care to not create extra material on each smooth value for "normal" obj files.
                // where explicit usemtl defines geometry groups.
                // Example asset: examples/models/obj/cerberus/Cerberus.obj
                /*var value = result[1].trim().toLowerCase();
                 state.object.smooth = (value === '1' || value === 'on');
    
                 var material = state.object.currentMaterial();
                 if (material) {
    
                 material.smooth = state.object.smooth;
    
                 }*/
            }
            else {
                // Handle null terminated files without exception
                if (line === '\0')
                    continue;
                throw new Error("Unexpected line: '" + line + "'");
            }
        }
        //end of file do
        var mesh = state.mesh;
        mesh.set_mesh([
            [att_p, state.vertices, 3],
            [att_uv, state.uvs, 2],
            [att_n, state.normals, 3],
            state.indexs
        ]);
        retObjs[name].add_mesh(mesh);
        return retObjs;
    }
    exports.objLoader = objLoader;
    function mtlLoader(path, mtlname, mtllib, gl, mtlflag) {
        var mtl = glfuncs_1.loadFile(path + mtlname);
        var shadpas = 'shaders/';
        var shadname = mtlflag;
        var keyhash = { ka: 'ambient', kd: 'diffuse', ks: 'specular' };
        var lines = mtl.split('\n');
        var thismtl;
        var delimiter_pattern = /\s+/;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            line = line.trim();
            if (line.length === 0 || line.charAt(0) === '#') {
                // Blank line or comment ignore
                continue;
            }
            var pos = line.indexOf(' ');
            var key = (pos >= 0) ? line.substring(0, pos) : line;
            key = key.toLowerCase();
            var value = (pos >= 0) ? line.substring(pos + 1) : '';
            value = value.trim();
            if (key === 'newmtl') {
                value += mtlflag;
                // New material
                if (mtllib[value])
                    console.log("same mtl name", value);
                var vpath = shadpas + shadname + '.vert';
                var fpath = shadpas + shadname + '.frag';
                thismtl = mtllib[value] = new Material_1.Material(vpath, fpath, gl);
                console.log('mtlload', value);
                thismtl.set_uniform(Material_1.Material._1f, 'powup', 0.1, gl);
            }
            else if (thismtl) {
                if (key === 'ka' || key === 'kd' || key === 'ks') {
                    var ss = value.split(delimiter_pattern, 3);
                    var v = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
                    thismtl.set_uniform(Material_1.Material.V3f, keyhash[key], v, gl);
                }
                else if (key === 'ns') {
                    thismtl.set_uniform(Material_1.Material._1f, 'powup', parseFloat(value), gl);
                }
                else if (key === 'map_kd') {
                    thismtl.set_uniform(Material_1.Material._1b, 'usetex', true, gl);
                    var tex = new Texture_1.Texture(path + value, gl, thismtl);
                    thismtl.set_uniform(Material_1.Material.I1i, 'tex', tex, gl);
                }
            }
        }
    }
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(3), __webpack_require__(4), __webpack_require__(1), __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Transform_1, Mesh_1, Material_1, Texture_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function donghnut(row, column, irad, rad, glg) {
        var pos = new Array(), nor = new Array(), col = new Array(), idx = new Array();
        for (var i = 0; i <= row; i++) {
            var r = Math.PI * 2 / row * i;
            var rr = Math.cos(r);
            var ry = Math.sin(r);
            for (var ii = 0; ii <= column; ii++) {
                var tr = Math.PI * 2 / column * ii;
                var tx = (rr * irad + rad) * Math.cos(tr);
                var ty = ry * irad;
                var tz = (rr * irad + rad) * Math.sin(tr);
                var rx = rr * Math.cos(tr);
                var rz = rr * Math.sin(tr);
                pos.push(tx, ty, tz);
                nor.push(rx, ry, rz);
                var tc = hsva(360 / column * ii, 1, 1, 1);
                col.push(tc[0], tc[1], tc[2], tc[3]);
            }
        }
        for (i = 0; i < row; i++) {
            for (ii = 0; ii < column; ii++) {
                r = (column + 1) * i + ii;
                idx.push(r, r + column + 1, r + 1);
                idx.push(r + column + 1, r + column + 2, r + 1);
            }
        }
        var ret = new Transform_1.Transform();
        var mesh = new Mesh_1.Mesh();
        mesh.set_mesh([
            [att_p, pos, 3],
            [att_c, col, 4],
            [att_n, nor, 3],
            idx
        ]);
        var mat = new Material_1.Material('shaders/base_phone.vert', 'shaders/base_phone.frag', glg.gl);
        mesh.set_mat(mat);
        ret.add_mesh(mesh);
        return [ret];
    }
    exports.donghnut = donghnut;
    function hsva(h, s, v, a) {
        if (s > 1 || v > 1 || a > 1) {
            return;
        }
        var th = h % 360;
        var i = Math.floor(th / 60);
        var f = th / 60 - i;
        var m = v * (1 - s);
        var n = v * (1 - s * f);
        var k = v * (1 - s * (1 - f));
        var color = new Array();
        if (s == 0) {
            color.push(v, v, v, a);
        }
        else {
            var r = new Array(v, n, m, m, k, v);
            var g = new Array(k, v, v, n, m, m);
            var b = new Array(m, m, k, v, v, n);
            color.push(r[i], g[i], b[i], a);
        }
        return color;
    }
    exports.hsva = hsva;
    function cube(side) {
        var s = (side || 1) / 2;
        var coords = [];
        var normals = [];
        var texCoords = [];
        var indices = [];
        function face(xyz, nrm) {
            var start = coords.length / 3;
            var i;
            for (i = 0; i < 12; i++) {
                coords.push(xyz[i]);
            }
            for (i = 0; i < 4; i++) {
                normals.push(nrm[0], nrm[1], nrm[2]);
            }
            texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
            indices.push(start, start + 1, start + 2, start, start + 2, start + 3);
        }
        face([-s, -s, s, s, -s, s, s, s, s, -s, s, s], [0, 0, 1]);
        face([-s, -s, -s, -s, s, -s, s, s, -s, s, -s, -s], [0, 0, -1]);
        face([-s, s, -s, -s, s, s, s, s, s, s, s, -s], [0, 1, 0]);
        face([-s, -s, -s, s, -s, -s, s, -s, s, -s, -s, s], [0, -1, 0]);
        face([s, -s, -s, s, s, -s, s, s, s, s, -s, s], [1, 0, 0]);
        face([-s, -s, -s, -s, -s, s, -s, s, s, -s, s, -s], [-1, 0, 0]);
        return [coords, texCoords, normals, indices];
    }
    exports.cube = cube;
    function skybox(srcs, gl) {
        var m = cube(50);
        var ret = new Transform_1.Transform();
        var mesh = new Mesh_1.Mesh();
        mesh.set_mesh([
            [att_p, m[0], 3],
            m[3]
        ]);
        var mat = new Material_1.Material('shaders/skybox.vert', 'shaders/skybox.frag', gl);
        var tex = new Texture_1.CubeTexture(srcs, gl, mat);
        mat.set_uniform(Material_1.Material.I1i, 'tex', tex, gl);
        mat.set_uniform(Material_1.Material._1f, 'usetex', true, gl);
        mesh.set_mat(mat);
        ret.add_mesh(mesh);
        return [ret];
    }
    exports.skybox = skybox;
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })
/******/ ]);