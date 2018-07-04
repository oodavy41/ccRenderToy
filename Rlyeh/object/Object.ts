import {Transform} from "./Transform"
import { Mesh } from "./Mesh";

export class Object{
    Tranforms:Transform[];

    constructor(trans?:Transform[]){
        this.Tranforms= trans || new Array<Transform>();
    }

    newT(name:string){
        this.Tranforms[name]=new Transform();
    }

    addmesh(name:string,mesh:Mesh){
        this.Tranforms[name].addmesh(mesh);
    }

    setInfo(fun:Function){
        this.Tranforms.forEach(element => {
            fun(element);
        });
    }

    setEarlyDraw(fun:Function){
        this.Tranforms.forEach(element => {
            element.addEarlyDrawFunc(fun);
        });
    }

    cleanEarlyDraw(fun:Function){
        this.Tranforms.forEach(element => {
            element.cleanEarlyDrawFunc();
        });
    }

    setLateDraw(fun:Function){
        this.Tranforms.forEach(element => {
            element.addEarlyDrawFunc(fun);
        });
    }

    cleanLateDraw(fun:Function){
        this.Tranforms.forEach(element => {
            element.cleanLateDrawFunc();
        });
    }

}