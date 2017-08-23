import {rewrite_edraw, rewrite_ldraw, set_obj_info, glclear} from "./glfuncs";
import {GLg} from "./GL";
import {objLoader} from "./loader";
import {Material} from "./object/Material";
import {skybox, donghnut} from "./baseModels";
import "./GLOBAL/GLOBAL.d"
import { TexManager } from './object/Texture';
import { Transform } from './object/Transform';


class Sence {

    SELF:Sence;
    GLGL : GLg;
    Time:number;
    deltaTime:number;
    state:number;
    glc : HTMLCanvasElement;
    TxMgr:TexManager;
    OBJs:Transform[][];
    initFuns:Function[];
    updtFuns:Function[];

    constructor(canvas : HTMLCanvasElement) {
        this.SELF=this;
        this.state=0;
        this.initFuns=new Array;
        this.updtFuns=new Array;

        this.glc = canvas;
        this.GLGL.create(this.glc);

        this.Time = 0;
        this.deltaTime=0;

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

    Ready(){
        if(this.OBJs.length!=0){
            this.Init();
            this.update();
        }else
            console.warn("no any OBJS be loaded");
    }

    Init(){
        this.initFuns.forEach(element => {
            element(this.SELF);
        });

        for (var i = 0, l = this.OBJs.length; i < l; i++) {
            for (var tran in this.OBJs[i]) {
                this.OBJs[i][tran].init(this.GLGL);
            }
        } 
        this.state++;
    }

    update() {
        this.updtFuns.forEach(element => {
            element(this.SELF);
        });

        this.deltaTime=Date.now() - this.Time;
        this.Time=Date.now();
        //===========================render cycle
        glclear(this.GLGL.gl);

        this.GLGL.fps_ctrl();

        for (var i = 0, l = this.OBJs.length; i < l; i++) {
            for (var tran in this.OBJs[i]) {
                this.OBJs[i][tran].draw(this.GLGL);
            }
        }
        this.GLGL.gl.flush();


        requestAnimationFrame(this.update);
    };

    getTexMgr(prog:Function){
        this.TxMgr=new TexManager(this.Ready,prog);
    }

};