import { glclear } from './GLCore/glfuncs';
import { GLg } from './GLCore/GL';
import { Material } from './object/Material';
import { skybox, donghnut } from './baseModels';
import { ResManager } from './ResManager';
import { Transform } from './object/Transform';
import { RObject } from './object/Object';


export class Scenes {

    SELF: Scenes;
    GLCtrl: GLg;
    Time: number;
    deltaTime: number;
    state: number;
    glc: HTMLCanvasElement;
    OBJs: RObject[];
    initFuns: Function[];
    updtFuns: Function[];

    constructor(canvas: HTMLCanvasElement) {
        this.SELF = this;
        this.state = 0;
        this.initFuns = [];
        this.updtFuns = [];

        this.glc = canvas;
        this.GLCtrl = new GLg(canvas);
        this.GLCtrl.create(this.glc);

        this.Time = 0;
        this.deltaTime = 0;

        this.GLCtrl.set_light([1, 1, 1, 0], [1, 1, 1]);
        this.GLCtrl.set_cam_pos([-1, 1, 1]);
        this.GLCtrl.set_cam_front([0, 0, 1]);
        this.GLCtrl.set_cam_up([0, 1, 0]);

        this.GLCtrl.set_cam_info([
            Math.PI / 3,
            this.glc.width / this.glc.height,
            0.01,
            100
        ]);

        this.GLCtrl.set_cam_ptype();
        this.OBJs = [];

    }

    ObjNums() {
        return this.OBJs.length;
    }

    LoadSence(objs: RObject[]) { // will overwrite exist objs
        this.OBJs = objs;
    }

    AddObj(obj: RObject) {
        this.OBJs.push(obj);
    }

    Run() {
        if (this.OBJs.length !== 0) {
            this.Init();
            this.update();
        } else {
            console.warn('no any OBJS be loaded');
        }
    }

    Init() {
        this.Time = Date.now();
        for (let i = 0, l = this.OBJs.length; i < l; i++) {
            this.OBJs[i].init(this.GLCtrl);
        }
        this.state++;
    }

    update() {

        this.deltaTime = Date.now() - this.Time;
        this.Time = Date.now();
        // ===========================render cycle
        glclear(this.GLCtrl.gl);

        this.GLCtrl.fps_ctrl();

        for (let i = 0, l = this.OBJs.length; i < l; i++) {
            this.OBJs[i].draw(this.GLCtrl);
        }
        this.GLCtrl.gl.flush();


        requestAnimationFrame(this.update.bind(this));
    }

}
