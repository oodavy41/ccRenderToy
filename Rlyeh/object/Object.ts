import { GLg } from './../GLCore/GL';
import { Transform } from './Transform';
import { Mesh } from './Mesh';

export class Object {
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

    init(glg: GLg) {
        this.Tranforms.forEach(tran => {
            tran.init(glg);
        });
    }

    draw(glg: GLg) {
        this.Tranforms.forEach(tran => {
            tran.draw(glg);
        });
    }


    setInfo(fun: Function) {
        this.Tranforms.forEach(tran => {
            fun(tran);
        });
    }

    setEarlyDraw(fun: Function) {
        this.Tranforms.forEach(tran => {
            tran.addEarlyDrawFunc(fun);
        });
    }

    cleanEarlyDraw(fun: Function) {
        this.Tranforms.forEach(tran => {
            tran.cleanEarlyDrawFunc();
        });
    }

    setLateDraw(fun: Function) {
        this.Tranforms.forEach(tran => {
            tran.addEarlyDrawFunc(fun);
        });
    }

    cleanLateDraw(fun: Function) {
        this.Tranforms.forEach(tran => {
            tran.cleanLateDrawFunc();
        });
    }

}
