onload = function() {
    var glc = document.getElementById('wobaglccc');
    var status = document.getElementById('status');
    var fps = document.getElementById('fps');
    var gl = initgl('wobaglccc');

    glclear(gl);

    var vs = create_shader('shaders/base_vx.vert', gl, gl.VERTEX_SHADER);
    var fs = create_shader('shaders/base_ft.frag', gl, gl.FRAGMENT_SHADER);
    var prog = create_program(vs, fs, gl);


    // 保存顶点的位置情报的数组
    var vertex_position = [
        0, 1, 0,
        1, 0, 0, -1, 0, 0
    ];

    // 保存顶点的颜色情报的数组
    var vertex_color = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    var points = new Array(2);

    points['pos'] = upload_array_att(
        vertex_position, 'position', prog, gl, [3, gl.FLOAT, false, 0, 0]);

    points['color'] = upload_array_att(
        vertex_color, 'color', prog, gl, [4, gl.FLOAT, false, 0, 0]);


    var mvp = makeMvp([
        [0, 1, 3],
        [0, 1, 0],
        [0, 1, 0]
    ], [Math.PI / 2, glc.width / glc.height, 0.01, 100]);

    var uniloca = gl.getUniformLocation(prog, 'mvpMatrix');
    gl.uniformMatrix4fv(uniloca, false, mvp);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    var date = new Date();


    (function() {
        var thisfps = 1000 / ((new Date()).getTime() - date.getTime());
        date = new Date();
        fps.textContent = 'FPS:' + parseInt(thisfps);

        glclear(gl);

        var thismvp = mat4.create();
        mat4.rotateY(thismvp, mvp, (new Date()).getTime() / 1000);
        gl.uniformMatrix4fv(uniloca, false, thismvp);


        gl.drawArrays(gl.TRIANGLES, 0, 3);

        gl.flush();

        setTimeout(arguments.callee, 0);
    })();

}
