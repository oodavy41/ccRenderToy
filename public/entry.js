onload = function() {
    var glc = document.getElementById('wobaglccc');
    var status = document.getElementById('status');
    var fps = document.getElementById('fps');


    var date = new Date();

    var thegl = new GLg();
    thegl.create('wobaglccc');

    document.getElementById('texture_p').textContent = thegl.gl.getParameter(thegl.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

    var shad_name = 'base_phone';
    thegl.make_pro('shaders/' + shad_name + '.vert', 'shaders/' + shad_name + '.frag');

    var obj = loadFile('models/py01.obj');
    obj = objLoader(obj, undefined);
    var arr = obj['??_1_001'];
    thegl.get_model([arr.vertices, arr.normals, arr.uvs, arr.indexs, undefined], thegl.TEXTURE);

    var light_direction = [10, 0, -1, 0];
    var camera_pos = [0, 20, 100, 1];
    var mvp = makeMvp([
        camera_pos, [0, 0, 0],
        [0, 1, 0]
    ], [Math.PI / 2, glc.width / glc.height, 0.01, 100]);

    light_direction = static_uni(light_direction, mvp);
    camera_pos = static_uni(camera_pos, mvp);

    thegl.set_static_mvp(mvp);

    var uni_a = [
        [thegl.M4F, 'mvpMatrix', mvp],
        [thegl.M4F, 'staticMatrix', mvp],
        [thegl.V3F, 'lightdDirection', light_direction],
        [thegl.V3F, 'cameraPos', camera_pos]
    ];

    thegl.set_uniform(uni_a);

    var update = function() {
        glclear(thegl.gl);

        thegl.update();
        //=======a=====================
        var thisfps = 1000 / ((new Date()).getTime() - date.getTime());
        date = new Date();
        fps.textContent = 'FPS:' + parseInt(thisfps);
        thegl.gl.flush();
        requestAnimationFrame(update);
    };

    update();

};
