var att_p = 'position';
var att_uv = 'coord';
var att_n = 'normal';


function objLoader(objpath, objname, mtllib, gl) {

    var obj = loadFile(objpath + objname);


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
    var line = '',
        lineFirstChar = '',
        lineSecondChar = '';
    var lineLength = 0;
    var result = [];

    // Faster to just trim left side of the line. Use if available.
    var trimLeft = (typeof ''.trimLeft === 'function');

    function addFace(f, v, u, n) {
        v = (parseInt(v) - 1) * 3;
        u = (parseInt(u) - 1) * 3;
        n = (parseInt(n) - 1) * 3;
        var s;
        switch (f) {
            case 0:
                s = v + '/' + u + '/' + n;
                if (!temphash[s]) {
                    state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                    state.uvs.push(uvs[u], uvs[u + 1], uvs[u + 2]);
                    state.normals.push(normals[n], normals[n + 1], normals[n + 2]);
                    state.indexs.push(state.size);
                    state.size++;
                } else
                    state.indexs.push(temphash[s]);
                break;
            case 1:
                s = v + '/' + u;
                if (!temphash[s]) {
                    state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                    state.uvs.push(uvs[u], uvs[u + 1], uvs[u + 2]);
                    state.indexs.push(state.size);
                    state.size++;
                } else
                    state.indexs.push(temphash[s]);
                break;
            case 2:
                s = v + '/' + '/' + n;
                if (!temphash[s]) {
                    state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                    state.normals.push(normals[n], normals[n + 1], normals[n + 2]);
                    state.indexs.push(state.size);
                    state.size++;
                } else
                    state.indexs.push(temphash[s]);
                break;
            case 3:
                s = v;
                if (!temphash[s]) {
                    state.vertices.push(vertices[v], vertices[v + 1], vertices[v + 2]);
                    state.indexs.push(state.size);
                    state.size++;
                } else
                    state.indexs.push(temphash[s]);
                break;
        }
    }

    for (var i = 0, l = lines.length; i < l; i++) {

        line = lines[i];

        line = trimLeft ? line.trimLeft() : line.trim();

        lineLength = line.length;

        if (lineLength === 0) continue;

        lineFirstChar = line.charAt(0);

        // @todo invoke passed in handler if any
        if (lineFirstChar === '#') continue;

        if (lineFirstChar === 'v') {

            lineSecondChar = line.charAt(1);

            if (lineSecondChar === ' ' && (result = regexp.vertex_pattern.exec(line)) !== null) {

                // 0                  1      2      3
                // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                vertices.push(
                    parseFloat(result[1]),
                    parseFloat(result[2]),
                    parseFloat(result[3])
                );

            } else if (lineSecondChar === 'n' && (result = regexp.normal_pattern.exec(line)) !== null) {

                // 0                   1      2      3
                // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

                normals.push(
                    parseFloat(result[1]),
                    parseFloat(result[2]),
                    parseFloat(result[3])
                );

            } else if (lineSecondChar === 't' && (result = regexp.uv_pattern.exec(line)) !== null) {

                // 0               1      2
                // ["vt 0.1 0.2", "0.1", "0.2"]

                uvs.push(
                    parseFloat(result[1]),
                    parseFloat(result[2])
                );

            } else {

                throw new Error("Unexpected vertex/normal/uv line: '" + line + "'");

            }

        } else if (lineFirstChar === "f") {

            if ((result = regexp.face_vertex_uv_normal.exec(line)) !== null) {

                // f vertex/uv/normal vertex/uv/normal vertex/uv/normal
                // 0                        1    2    3    4    5    6    7    8    9   10         11         12
                // ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]

                var e;
                if (result[10] == undefined) {
                    e = [1, 4, 7];
                } else {
                    e = [1, 4, 7, 1, 7, 10];
                }

                e.forEach(function (e) {
                    addFace(0, result[e], result[e + 1], result[e + 2]);
                });


            } else if ((result = regexp.face_vertex_uv.exec(line)) !== null) {

                // f vertex/uv vertex/uv vertex/uv
                // 0                  1    2    3    4    5    6   7          8
                // ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]

                var e;
                if (result[7] == undefined) {
                    e = [1, 3, 5];
                } else {
                    e = [1, 3, 5, 1, 5, 7];
                }

                e.forEach(function (e) {
                    addFace(1, result[e], result[e + 1], undefined);
                })


            } else if ((result = regexp.face_vertex_normal.exec(line)) !== null) {

                // f vertex//normal vertex//normal vertex//normal
                // 0                     1    2    3    4    5    6   7          8
                // ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]

                var e;
                if (result[7] == undefined) {
                    e = [1, 3, 5];
                } else {
                    e = [1, 3, 5, 1, 5, 7];
                }

                e.forEach(function (e) {
                    addFace(2, result[e], undefined, result[e + 1]);
                });


            } else if ((result = regexp.face_vertex.exec(line)) !== null) {

                // f vertex vertex vertex
                // 0            1    2    3   4
                // ["f 1 2 3", "1", "2", "3", undefined]

                var e;
                if (result[4] == undefined) {
                    e = [1, 2, 3];
                } else {
                    e = [1, 2, 3, 1, 3, 4];
                }

                e.forEach(function (e) {
                    addFace(3, result[e], undefined, undefined);
                });


            } else {

                throw new Error("Unexpected face line: '" + line + "'");

            }

        } else if (lineFirstChar === "l") {

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

        } else if ((result = regexp.object_pattern.exec(line)) !== null) {

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

            retObjs[name] = new Transform();

        } else if (regexp.material_use_pattern.test(line)) {

            // material

            //state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);

            var matname = line.substring(7).trim();
            if (state.mesh) {

                var mesh = state.mesh;
                mesh.set_mesh([
                    [att_p, state.vertices, 3],
                    [att_uv, state.uvs, 2],
                    [att_n, state.normals, 3],
                    state.indexs
                ]);
                retObjs[name].add_mesh(mesh);

                state = {
                    mesh: null,
                    vertices: [],
                    normals: [],
                    uvs: [],
                    indexs: [],
                    size: 0
                };

                temphash = {};
            }


            state.mesh = new Mesh();
            if (!mtllib[matname])
                console.log('no such mtl:' + matname);
            state.mesh.set_mat(mtllib[matname]);


        } else if (regexp.material_library_pattern.test(line)) {

            // mtl file

            mtlLoader(objpath, line.substring(7).trim(), mtllib, gl);

        } else if ((result = regexp.smoothing_pattern.exec(line)) !== null) {

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

        } else {

            // Handle null terminated files without exception
            if (line === '\0') continue;

            throw new Error("Unexpected line: '" + line + "'");

        }

    }

    return retObjs;
}

function mtlLoader(path, mtlname, mtllib, gl) {
    var mtl = loadFile(path + mtlname);

    var shadpas = 'shaders/';
    var shadname = 'text_phone';

    var keyhash = {ka: 'ambient', kd: 'diffuse', ks: 'specular'};

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

        var key = ( pos >= 0 ) ? line.substring(0, pos) : line;
        key = key.toLowerCase();

        var value = ( pos >= 0 ) ? line.substring(pos + 1) : '';
        value = value.trim();

        if (key === 'newmtl') {

            // New material
            if (mtllib[value])
                console.log("already has a same mtl name");
            var vpath = shadpas + shadname + '.vert';
            var fpath = shadpas + shadname + '.frag';

            thismtl = mtllib[value] = new Material(vpath, fpath, gl);

        } else if (thismtl) {

            if (key === 'ka' || key === 'kd' || key === 'ks') {

                var ss = value.split(delimiter_pattern, 3);
                var v = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
                thismtl.set_uniform(Material.V3f, keyhash[key], v, gl);

            } else if (key === 'ns') {

                thismtl.set_uniform(Material._1f, 'powup', parseFloat(value), gl);

            } else if (key === 'map_kd') {

                thismtl.set_uniform(Material._1b, 'usetex', false, gl);
                var tex = new Texture(path + value, gl);
                thismtl.set_uniform(Material.I1i, 'tex', tex, gl);
            }

        }

    }

}

console.log('loader.load');