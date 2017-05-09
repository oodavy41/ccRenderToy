var thegl;

var loadProg = 0;
var statuss = document.getElementById('statuss');
var progress = document.getElementById('progress');
var promise;

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

    var objs1 = objLoader('models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_phone');
    var objs2 = objLoader('models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'text_phone');
    var objs3 = [donghnut(30, 36, 1, 3, thegl)];
    var objs = [objs1, objs2, objs3];


    var update = function () {
        glclear(thegl.gl);

        thegl.fps_ctrl();

        for (var i = 0, l = objs.length; i < l; i++) {
            for (var tran in objs[i]) {
                objs[i][tran].draw(thegl);
                if (i == 2) {
                    objs[i][tran].set_rx(date.getTime() / 1000);
                }
                console.log('draw', i + tran);
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

                    objs[i][tran].set_pos(3 * i, 3 * i, 0);

                    objs[i][tran].init(thegl);
                    console.log('init', i + tran);
                }
            }
            statuss.innerText = 'Done';
            progress.innerText = '';

            update();
        }
    };

};

