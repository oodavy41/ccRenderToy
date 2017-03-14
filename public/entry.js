var loadProg = 0;
var statuss = document.getElementById('statuss');
var progress = document.getElementById('progress');
var promise;

onload = function() {
    var glc = document.getElementById('wobaglccc');
    var fps = document.getElementById('fps');

    var light_direction = [10, 0, 1, 0];
    var light_color = [1, 1, 1];
    var camera_pos = [-3, 6, 6];
    var camera_look = [0, 3, 0];
    var camera_up = [0, 1, 0];
    var camera_info = [Math.PI / 2, glc.width / glc.height, 0.01, 100];


    var date = new Date();

    var thegl = new GLg();

    thegl.create('wobaglccc');
    thegl.set_light(light_direction, light_color);
    thegl.set_cam_pos(camera_pos);
    thegl.set_cam_look(camera_look);
    thegl.set_cam_up(camera_up);
    thegl.set_cam_info(camera_info);

    var objs = objLoader('models/Wall/', 'wall.obj', thegl.mtllib, thegl.gl);


    var update = function () {
        glclear(thegl.gl);

        for (var tran in objs) {
            objs[tran].draw(thegl.gl);
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


/*    var shad_name = 'base_phone';
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

 thegl.set_uniform(uni_a);*/