System.register(["./object/Transform", "./object/Mesh", "./object/Material", "./object/Texture"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
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
    exports_1("donghnut", donghnut);
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
    exports_1("hsva", hsva);
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
    exports_1("cube", cube);
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
    exports_1("skybox", skybox);
    var Transform_1, Mesh_1, Material_1, Texture_1;
    return {
        setters: [
            function (Transform_1_1) {
                Transform_1 = Transform_1_1;
            },
            function (Mesh_1_1) {
                Mesh_1 = Mesh_1_1;
            },
            function (Material_1_1) {
                Material_1 = Material_1_1;
            },
            function (Texture_1_1) {
                Texture_1 = Texture_1_1;
            }
        ],
        execute: function () {
        }
    };
});
