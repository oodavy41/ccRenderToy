
import { Transform } from './Transform';
import { Mesh } from './Mesh';

export class RObject {
    Tranforms: Transform[];

    constructor(trans?: Transform[]) {
        this.Tranforms = trans || new Array<Transform>();
    }

    newT(name: string) {
        this.Tranforms[name] = new Transform();
    }

    addmesh(name: string, mesh: Mesh) {
        this.Tranforms[name].addmesh(mesh);
    }

    init(gl: WebGLRenderingContext) {
        this.Tranforms.forEach(tran => {
            tran.init(gl);
        });
    }

    draw(gl: WebGLRenderingContext) {
        this.Tranforms.forEach(tran => {
            tran.draw(gl);
        });
    }


    setInfo(gl: WebGLRenderingContext, fun: (arg: Transform, arg2: WebGLRenderingContext) => void) {
        this.Tranforms.forEach(tran => {
            fun(tran, gl);
        });
    }

    setEarlyDraw(fun: (arg: Transform, arg2: WebGLRenderingContext) => void) {
        this.Tranforms.forEach(tran => {
            tran.addEarlyDrawFunc(fun);
        });
    }

    cleanEarlyDraw() {
        this.Tranforms.forEach(tran => {
            tran.cleanEarlyDrawFunc();
        });
    }

    setLateDraw(fun: (arg: Transform, arg2: WebGLRenderingContext) => void) {
        this.Tranforms.forEach(tran => {
            tran.addLateDrawFunc(fun);
        });
    }

    cleanLateDraw() {
        this.Tranforms.forEach(tran => {
            tran.cleanLateDrawFunc();
        });
    }

}
