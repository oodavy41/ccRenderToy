onload = function() {

    var glc = document.getElementById('wobaglccc');
    var gl = glc.getContext('webgl');

    gl.clearColor(0, 0, 0, 1);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var vs = create_shader('vs', gl);
    var fs = create_shader('fs', gl);

    var prog = create_program(vs, fs, gl);

    var att_lo = gl.getActiveAttrib(prog, 'position');

    var atts = 3;

    var vertex_pos = [
        0, 1, 0,
        1, 0, 0, -1, 0, 0
    ];

    var vbo = create_vbo(vertex_pos, gl);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(att_lo);

    gl.vertexAttribPointer(att_lo, atts, gl.FLOAT, false, 0, 0);


    var mMat = mat4.identity(mat4.create());
    var vMat = mat4.create();
    var pMat = mat4.create();
    var mvp = mat4.create();

    mat4.lookAt([0, 1, 3], [0, 1, 0], [0, 1, 0], vMat);

    mat4.perspective(90, glc.width / glc.height, 0.1, 100, pMat);

    mat4.multiply(pMat, vMat, mvp);
    mat4.multiply(mvp, mMat, mvp);

    var uniloca = gl.getUniformLocation(prog, 'mvpMatrix');

    gl.uniformMatrix4fv(uniloca, false, mvp);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.flush();
}
