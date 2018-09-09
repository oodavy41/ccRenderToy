
import { vec4, vec3 } from 'gl-matrix';
import { CTransform } from './component/CTransform';

export enum LIGHT_TYPE { POINT, SPOT, DIRECTION }

export class Light extends CTransform {
    type: LIGHT_TYPE;
    lightDirection: vec3;
    lightColor: vec4;
    spotAngel: number;

    constructor(type: LIGHT_TYPE, lightDir: vec3, lightCol: vec4, angel?: number) {
        super();
        if (type === LIGHT_TYPE.SPOT && angel === undefined) {
            console.error('define an spot light without angel!');
        }
        this.type = type;
        this.lightDirection = lightDir;
        this.lightColor = lightCol;
    }
}
