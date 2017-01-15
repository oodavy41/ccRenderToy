onload = function() {
    var glc = document.getElementById('wobaglccc');
    var gl = initgl('wobaglccc');

    var vs = create_shader('shaders/base_vx.glsl', gl, gl.VERTEX_SHADER);
    var fs = create_shader('shaders/base_ft.glsl', gl, gl.FRAGMENT_SHADER);

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
    var vMat = mat4.identity(mat4.create());
    var pMat = mat4.identity(mat4.create());
    var mvp = mat4.identity(mat4.create());

    mat4.lookAt(vMat, [0, 1, 3], [0, 1, 0], [0, 1, 0]);

    mat4.perspective(pMat, 90, glc.width / glc.height, 0.1, 100);

    mat4.multiply(mvp, pMat, vMat);
    mat4.multiply(mvp, mvp, mMat);

    var uniloca = gl.getUniformLocation(prog, 'mvpMatrix');

    gl.uniformMatrix4fv(uniloca, false, mvp);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.flush();
}
