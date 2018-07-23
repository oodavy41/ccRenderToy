
import { TexManager } from '../ResManager';
import { Material } from './Material';

export class Texture {

    index: number;
    img: HTMLImageElement;
    texture: WebGLTexture;

    constructor(src: string, gl: WebGLRenderingContext, mat: Material) {
        this.index = mat.textures.length;
        mat.textures.push(this);
        this.img = new Image();
        const that = this;
        this.img.onload = function () {
            that.texture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + that.index);
            console.log('tex', that.index + ':' + src);
            gl.bindTexture(gl.TEXTURE_2D, that.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(
                gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this as HTMLCanvasElement);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);

        };
        this.img.src = src;
    }

    bind(gl: WebGLRenderingContext) {
        gl.activeTexture(gl.TEXTURE0 + this.index);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
}

export class CubeTexture {

    index: number;
    img: HTMLImageElement[];
    texture: WebGLTexture;
    cubePromise: number;

    // src:[+x,-x,+y,-y,+z,-z]
    constructor(src: HTMLImageElement[], gl: WebGLRenderingContext, mat: Material) {
        this.index = mat.textures.length;
        mat.textures.push(this);
        this.img = src;
        this.cubePromise = 0;
        console.log('cubemap', this.index);

        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + this.index);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

        const targets = [
            gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
        ];

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        for (let i = 0; i < 6; i++) {
            gl.texImage2D(targets[i], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img[i]);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

    }

    bind(gl) {
        gl.activeTexture(gl.TEXTURE0 + this.index);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    }
}

