
import {ResManager} from '../ResManager';
import {AMaterial} from './Material';

export class Texture {
  img: HTMLImageElement;
  texture: WebGLTexture;

  constructor(path: string, gl: WebGLRenderingContext, res: ResManager) {
    this.img = <HTMLImageElement>res.get(path);

    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    console.log('tex', ':' + path);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
    gl.texParameteri(
        gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(
        gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  bind(gl: WebGLRenderingContext, index: number) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
  }
}

export class CubeTexture {
  img: HTMLImageElement[];
  texture: WebGLTexture;


  /** src : [+x, -x, +y, -y, +z, -z ]*/
  constructor(src: string[], gl: WebGLRenderingContext, res: ResManager) {
    let imgs = this.img = [];
    src.forEach((path, index) => {
      imgs[index] = res.get(path);
    });

    this.texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    console.log('tex', ':' + src[0]);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);

    const targets = [
      gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
      gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
    ];

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

    for (let i = 0; i < 6; i++) {
      gl.texImage2D(
          targets[i], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img[i]);
      gl.texParameteri(
          gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(
          gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }

  bind(gl: WebGLRenderingContext, index: number) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
  }
}

export class FrameTexture {
  frameBuffer: WebGLFramebuffer;
  texture: WebGLTexture;

  constructor(gl: WebGLRenderingContext, width: number, height: number) {
    this.texture = gl.createTexture();
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    this.frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  }

  bind(gl: WebGLRenderingContext, index: number) {
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
  }
  unbind(gl:WebGLRenderingContext){
    
  }
}