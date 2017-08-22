import {rewrite_edraw, rewrite_ldraw, set_obj_info, glclear} from "./glfuncs";
import {GLg} from "./GL";
import {objLoader} from "./loader";
import {Material} from "./object/Material";
import {skybox, donghnut} from "./baseModels";
import "./GLOBAL/GLOBAL.d"
import { TexManager } from './object/Texture';
import { Transform } from './object/Transform';


class Sence {

    GLGL : GLg;
    Time:Date;
    glc : HTMLCanvasElement;
    TxMgr:TexManager;
    OBJs:Transform[][];

    constructor(canvas : HTMLCanvasElement) {
        this.glc = canvas;
        this.GLGL.create(this.glc);

        this.Time = new Date();

        this.GLGL.set_light([1,1,1,0], [1,1,1]);
        this.GLGL.set_cam_pos([-1,1,1]);
        this.GLGL.set_cam_front([0,0,1]);
        this.GLGL.set_cam_up([0,1,0]);

        this.GLGL.set_cam_info([
            Math.PI / 3,
            this.glc.width / this.glc.height,
            0.01,
            100
        ]);

        this.GLGL.set_cam_ptype();

        this.glc.addEventListener('click', can_on_click);
        window.addEventListener('mousemove', on_mouse_move);
        window.addEventListener('keypress', on_key_press);
        window.addEventListener('keyup', on_key_up);

    }

    Init(){
        for (var i = 0, l = this.OBJs.length; i < l; i++) {
                for (var tran in this.OBJs[i]) {
                    this.OBJs[i][tran].init(this.GLGL);
                }
            }
    }


    getTexMgr(prog:Function){
        this.TxMgr=new TexManager()
    }

    var update = function () {
        glclear(GLGL.gl);

        GLGL.fps_ctrl();

        for (var i = 0, l = objs.length; i < l; i++) {
            for (var tran in objs[i]) {
                objs[i][tran].draw(GLGL);
            }
        }

        //============================fps display============
        var thisfps = 1000 / ((new Date()).getTime() - date.getTime());
        date = new Date();
        fps.textContent = 'FPS:' + parseInt(thisfps + "");
        GLGL
            .gl
            .flush();
        requestAnimationFrame(update);
    };

    promise = function () {
        if (loadProg == 0) {

            for (var i = 0, l = objs.length; i < l; i++) {
                for (var tran in objs[i]) {
                    objs[i][tran].init(GLGL);
                }
            }
            statuss.innerText = 'Done';
            progress.innerText = '';

            update();
        }
    };

};