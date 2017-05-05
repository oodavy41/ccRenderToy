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

    var objs = objLoader('models/item01/', 'item01.obj', thegl.mtllib, thegl.gl);


    var update = function () {
        glclear(thegl.gl);

        thegl.fps_ctrl();

        for (var tran in objs) {
            objs[tran].draw(thegl);
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

            for (var tran in objs) {
                objs[tran].init(thegl);
            }
            statuss.innerText = 'Done';
            progress.innerText = '';

            update();
        }
    };

};

