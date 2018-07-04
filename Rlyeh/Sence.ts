import {glclear} from "./GLCore/glfuncs";
import {GLg} from "./GLCore/GL";
import {Material} from "./object/Material";
import {skybox, donghnut} from "./baseModels";
import "./GLOBAL/GLOBAL.d"
import { TexManager } from './ResManager';
import { Transform } from './object/Transform';
import { Object } from "./object/Object";


export class Sence {

    SELF:Sence;
    GLCtrl : GLg;
    Time:number;
    deltaTime:number;
    state:number;
    glc : HTMLCanvasElement;
    OBJs:Object[];
    initFuns:Function[];
    updtFuns:Function[];

    constructor(canvas : HTMLCanvasElement) {
        this.SELF=this;
        this.state=0;
        this.initFuns=new Array;
        this.updtFuns=new Array;

        this.glc = canvas;
        this.GLCtrl.create(this.glc);

        this.Time = 0;
        this.deltaTime=0;

        this.GLCtrl.set_light([1,1,1,0], [1,1,1]);
        this.GLCtrl.set_cam_pos([-1,1,1]);
        this.GLCtrl.set_cam_front([0,0,1]);
        this.GLCtrl.set_cam_up([0,1,0]);

        this.GLCtrl.set_cam_info([
            Math.PI / 3,
            this.glc.width / this.glc.height,
            0.01,
            100
        ]);

        this.GLCtrl.set_cam_ptype();
        this.OBJs=[];

    }

    ObjNums(){
        return this.OBJs.length;
    }

    LoadSence(objs:Object[]){ //will overwrite exist objs
        this.OBJs=objs;
    }

    AddObj(obj:Object){
        this.OBJs.push(obj);
    }

    Run(){
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
                this.OBJs[i][tran].init(this.GLCtrl);
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
        glclear(this.GLCtrl.gl);

        this.GLCtrl.fps_ctrl();

        for (var i = 0, l = this.OBJs.length; i < l; i++) {
            for (var tran in this.OBJs[i]) {
                this.OBJs[i][tran].draw(this.GLCtrl);
            }
        }
        this.GLCtrl.gl.flush();


        requestAnimationFrame(this.update);
    };

};
