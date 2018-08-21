import { glclear, initgl } from './GLCore/glfuncs';
import { Material } from './object/Material';
import { skybox, donghnut } from './baseModels';
import { ResManager } from './ResManager';
import { Transform } from './object/Transform';
import { RObject } from './object/Object';
import { Camera } from './Camera';
import { Light, LIGHT_TYPE } from './Light';
import { vec3, vec4 } from 'gl-matrix';


export class Scenes {

    SELF: Scenes;
    GL: WebGLRenderingContext;
    mainCamera: Camera;
    cameras: { [key: string]: Camera };
    lights: { [key: string]: Light }; // todo: lights feature
    resManager: ResManager;
    mtllib: { [key: string]: Material };
    Time: number;
    deltaTime: number;
    state: number;
    glc: HTMLCanvasElement;
    OBJs: RObject[];
    initFuns: Function[];
    updtFuns: Function[];

    constructor(canvas: HTMLCanvasElement, resMgr: ResManager) {
        this.SELF = this;
        this.state = 0;
        this.initFuns = [];
        this.updtFuns = [];
        this.resManager = resMgr;

        this.cameras = {};
        this.lights = {};
        this.mainCamera = this.cameras['Main'] = new Camera();
        this.mtllib = {};

        this.glc = canvas;
        this.GL = initgl(canvas);

        this.Time = 0;
        this.deltaTime = 0;

        this.mainCamera.position = vec3.fromValues(-1, 1, 1);
        this.mainCamera.cameraAim = vec3.fromValues(0, 0, 1);
        this.mainCamera.cameraUp = vec3.fromValues(0, 1, 0);

        this.mainCamera.cameraInfo = [
            Math.PI / 3,
            this.glc.width / this.glc.height,
            0.01,
            100
        ];

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
            this.OBJs[i].init(this);
        }
        this.state++;
    }

    update() {

        this.deltaTime = Date.now() - this.Time;
        this.Time = Date.now();
        // ===========================render cycle
        glclear(this.GL);

        for (let i = 0, l = this.OBJs.length; i < l; i++) {
            this.OBJs[i].draw(this);
        }
        this.GL.flush();


        requestAnimationFrame(this.update.bind(this));
    }

}
