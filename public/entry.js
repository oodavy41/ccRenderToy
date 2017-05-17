var thegl;

var loadProg = 0;
var statuss = document.getElementById('statuss');
var progress = document.getElementById('progress');
var promise;
var EMPTY_FUN=function () {};

onload = function() {
    var glc = document.getElementById('wobaglccc');
    var fps = document.getElementById('fps');


    var date = new Date();

    thegl = new GLg();

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


    thegl.create('wobaglccc');
    thegl.set_light(light_direction, light_color);
    thegl.set_cam_pos(camera_pos);
    thegl.set_cam_front(camera_front);
    thegl.set_cam_up(camera_up);
    thegl.set_cam_info(camera_info);
    thegl.set_cam_ptype();


    var sb=skybox([
        'skyboxs/bluesky/X.png',
        'skyboxs/bluesky/-X.png',
        'skyboxs/bluesky/Y.png',
        'skyboxs/bluesky/-Y.png',
        'skyboxs/bluesky/Z.png',
        'skyboxs/bluesky/-Z.png'],thegl.gl);

    rewrite_edraw(sb,function (glg) {
        this.set_pos(thegl.camera_pos[0],thegl.camera_pos[1],thegl.camera_pos[2]);
        //glg.gl.cullFace(glg.gl.FRONT);
    });
    rewrite_ldraw(sb,function (glg) {
        //glg.gl.cullFace(glg.gl.BACK);
    });

    var objs1 = objLoader('models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_phone');

    var objs11 = objLoader('models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_edge_phone');
    rewrite_edraw (objs11,function(glg) {
        glg.gl.cullFace(glg.gl.FRONT);
    });
    rewrite_ldraw(objs11,function (glg) {
        glg.gl.cullFace(glg.gl.BACK);
    });

    var objs2 = objLoader('models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'text_phone');
    set_obj_info(objs2,function (tran) {
        tran.set_pos(0,0,2)
    });

    var objs3 = [donghnut(30, 36, 1, 3, thegl)];
    set_obj_info(objs3,function (tran) {
        tran.set_pos(5,10,0);
    });
    rewrite_edraw(objs3,function () {
        this.set_rx(date.getTime() / 1000);
    });

    var objs = [objs1,objs11,objs2, objs3];



    var update = function () {
        glclear(thegl.gl);

        thegl.fps_ctrl();

        for (var i = 0, l = objs.length; i < l; i++) {
            for (var tran in objs[i]) {
                objs[i][tran].draw(thegl);
            }
        }

        //=======a=====================
        var thisfps = 1000 / ((new Date()).getTime() - date.getTime());
        date = new Date();
        fps.textContent = 'FPS:' + parseInt(thisfps);
        thegl.gl.flush();
        requestAnimationFrame(update);
    };


    promise = function () {
        if (loadProg == 0) {

            for (var i = 0, l = objs.length; i < l; i++) {
                for (var tran in objs[i]) {
                    objs[i][tran].init(thegl);
                }
            }
            statuss.innerText = 'Done';
            progress.innerText = '';

            update();
        }
    };

};

