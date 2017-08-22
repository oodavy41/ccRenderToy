System.register(["../glfuncs", "../GL"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Texture, CubeTexture;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            }
        ],
        execute: function () {
            Texture = (function () {
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
                        loadProg--;
                        progress.innerText = loadProg + '';
                        promise();
                    };
                    this.img.src = src;
                    loadProg++;
                    progress.innerText = loadProg + '';
                }
                Texture.prototype.bind = function (gl) {
                    gl.activeTexture(gl.TEXTURE0 + this.index);
                    gl.bindTexture(gl.TEXTURE_2D, this.texture);
                };
                return Texture;
            }());
            exports_1("Texture", Texture);
            CubeTexture = (function () {
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
                                loadProg--;
                                progress.innerText = loadProg + '';
                                promise();
                            }
                        };
                        this.img[i].src = src[i];
                    }
                    loadProg++;
                    progress.innerText = loadProg + '';
                }
                CubeTexture.prototype.bind = function (gl) {
                    gl.activeTexture(gl.TEXTURE0 + this.index);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
                };
                return CubeTexture;
            }());
            exports_1("CubeTexture", CubeTexture);
        }
    };
});
