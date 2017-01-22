onload = function() {
    var glc = document.getElementById('wobaglccc');
    var status = document.getElementById('status');
    var fps = document.getElementById('fps');

    var gl = initgl('wobaglccc');
    var date = new Date();

    glclear(gl);

    var vs = create_shader('shaders/base_vx.vert', gl, gl.VERTEX_SHADER);
    var fs = create_shader('shaders/base_ft.frag', gl, gl.FRAGMENT_SHADER);
    var prog = create_program(vs, fs, gl);


    var v_v = donghnut(32, 64, 3, 9);
    var v_pos = v_v[0],
        v_nor = v_v[1],
        v_col = v_v[2],
        v_ind = v_v[3];

    var points = new Array(3);

    points['pos'] = upload_array_att(
        v_pos, 'position', prog, gl, [3, gl.FLOAT, false, 0, 0]);

    points['col'] = upload_array_att(
        v_col, 'color', prog, gl, [4, gl.FLOAT, false, 0, 0]);

    points['nor'] = upload_array_att(
        v_nor, 'normal', prog, gl, [3, gl.FLOAT, false, 0, 0]);

    var ibo = create_ibo(v_ind, gl);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);



    var light_direction = [10, 0, -1, 0];
    var camera_pos = [0, 20, 10, 1];

    var mvp = makeMvp([
        camera_pos, [0, 0, 0],
        [0, 1, 0]
    ], [Math.PI / 2, glc.width / glc.height, 0.01, 100]);

    light_direction = static_uni(light_direction, mvp);
    camera_pos = static_uni(camera_pos, mvp);

    var mvpU = gl.getUniformLocation(prog, 'mvpMatrix');
    gl.uniformMatrix4fv(mvpU, false, mvp);
    var smvpU = gl.getUniformLocation(prog, 'staticMatrix');
    gl.uniformMatrix4fv(smvpU, false, mvp);
    var lightdU = gl.getUniformLocation(prog, 'lightdDirection');
    gl.uniform3fv(lightdU, light_direction);
    var cameraPos = gl.getUniformLocation(prog, 'cameraPos');
    gl.uniform3fv(cameraPos, camera_pos);

    var update = function() {
        glclear(gl);
        //=========MAIN LOOP=========

        var thismvp = mat4.create();
        mat4.rotateY(thismvp, mvp, (new Date()).getTime() / 1000);
        mat4.rotateX(thismvp, thismvp, (new Date()).getTime() / 2000);
        mat4.rotateZ(thismvp, thismvp, (new Date()).getTime() / 3000);
        gl.uniformMatrix4fv(mvpU, false, thismvp);


        gl.drawElements(gl.TRIANGLES, v_ind.length, gl.UNSIGNED_SHORT, 0);
        //============================
        var thisfps = 1000 / ((new Date()).getTime() - date.getTime());
        date = new Date();
        fps.textContent = 'FPS:' + parseInt(thisfps);
        gl.flush();
        /*setTimeout(arguments.callee, 0);*/
        requestAnimationFrame(update);
    };

    update();

}
