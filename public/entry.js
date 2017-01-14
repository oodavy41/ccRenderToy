onload = function() {

    var m4 = new mat4();
    var glc = document.getElementById('wobaglccc');
    var gl = glc.getContext('webgl');

    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vs = create_shader('vs');
    var fs = create_shader('fs');

    var prog = create_program(vs, fs);

    var att_lo = gl.getActiveAttrib(prog, 'position');

    var atts = 3;

    var vertex_pos = [
        0, 1, 0,
        1, 0, 0, -1, 0, 0
    ];

    var vbo = create_vbo(vertex_pos);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(att_lo);

    gl.vertexAttribPointer(att_lo, atts, gl.FLOAT, false, 0, 0);



}
