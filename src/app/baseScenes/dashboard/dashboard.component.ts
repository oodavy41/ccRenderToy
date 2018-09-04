import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {vec3, vec4} from 'gl-matrix';
import {forkJoin, Observable} from 'rxjs';

import {EventManager} from '../../../../node_modules/@angular/platform-browser';
import {donghnut, skybox} from '../../../Rlyeh/baseModels';
import {KeyBoardCtrl} from '../../../Rlyeh/handle';
import {Light, LIGHT_TYPE} from '../../../Rlyeh/Light';
import {objLoader} from '../../../Rlyeh/loader';
import {Transform} from '../../../Rlyeh/object/Transform';
import {ResManager} from '../../../Rlyeh/ResManager';
import {Scenes} from '../../../Rlyeh/Scenes';
import {HeroService} from '../../hero.service';
import {MessageService} from '../../message.service';
import {RangeBoxComponent} from '../range-box/range-box.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  @ViewChild('webgl') glCanvas: ElementRef;
  @ViewChild('rangebox') rangebox: RangeBoxComponent;
  private gl: WebGLRenderingContext;
  private inputHandel: KeyBoardCtrl;
  private scenes: Scenes;
  private time: Date;
  constructor(
      private heroService: HeroService, private messageService: MessageService,
      private eventMgr: EventManager) {}

  async ngOnInit() {
    let glc = <HTMLCanvasElement>this.glCanvas.nativeElement;

    let resMgr =
        new ResManager('assets/resource/', 'models/', 'shaders/', 'skyboxs/');
    this.scenes = new Scenes(glc, resMgr);
    this.inputHandel = new KeyBoardCtrl(this.scenes);
    let thegl = this.scenes.GL;

    this.eventMgr.addGlobalEventListener(
        'body', 'mousemove', (event) => this.inputHandel.on_mouse_move(event));
    this.eventMgr.addGlobalEventListener(
        'body', 'keypress', (event) => this.inputHandel.on_key_down(event));
    this.eventMgr.addGlobalEventListener(
        'body', 'keyup', (event) => this.inputHandel.on_key_up(event));

    let loading = this.messageService.createLoadingMSG('loading');

    let light_direction = vec3.fromValues(-10, 0, -1);
    let light_color = vec4.fromValues(1, 1, 1, 1);
    let camera_pos = vec3.fromValues(-15, 8, 16);
    let cameraAim = vec3.fromValues(0, 5, -5);
    let cameraUp = vec3.fromValues(0, 1, 0);
    let cameraInfo = [Math.PI / 3, glc.width / glc.height, 0.01, 100];

    this.scenes.lights['Main'] =
        new Light(LIGHT_TYPE.DIRECTION, light_direction, light_color);
    this.scenes.mainCamera.position = camera_pos;
    this.scenes.mainCamera.cameraAim = cameraAim;
    this.scenes.mainCamera.cameraUp = cameraUp;
    this.scenes.mainCamera.cameraInfo = cameraInfo;

    let resPath = 'assets/resource/';
    let imgPath = [
      // skybox
      'skyboxs/bs2/X.png',
      'skyboxs/bs2/-X.png',
      'skyboxs/bs2/Y.png',
      'skyboxs/bs2/-Y.png',
      'skyboxs/bs2/Z.png',
      'skyboxs/bs2/-Z.png',
      // models
      'models/teapot/default.jpg',
    ];
    let textPath = [
      // shaders
      'shaders/anim_edge_phone.frag',
      'shaders/anim_edge_phone.vert',
      'shaders/anim_phone.frag',
      'shaders/anim_phone.vert',
      'shaders/base_phone.frag',
      'shaders/base_phone.vert',
      'shaders/reflect_mat.frag',
      'shaders/reflect_mat.vert',
      'shaders/refract_mat.frag',
      'shaders/refract_mat.vert',
      'shaders/shadow_only.frag',
      'shaders/shadow_only.vert',
      'shaders/skybox.frag',
      'shaders/skybox.vert',
      'shaders/text_phone.frag',
      'shaders/text_phone.vert',
      // texture
      'models/teapot/teapot.mtl',
      'models/teapot/teapot.obj',
    ];

    let imagePromise =
        await forkJoin(
            imgPath.map<Observable<Blob>>(
                value => this.heroService.getBlob(`${resPath}${value}`)))
            .toPromise();
    for (let i = 0; i < imagePromise.length; i++) {
      let value = imagePromise[i];
      let rx = new Observable<HTMLImageElement>((ob) => {
        let im = new Image();
        im.onload = () => {
          window.URL.revokeObjectURL(im.src);
          ob.next(im);
          ob.complete();
        };
        im.src = window.URL.createObjectURL(value);
      });
      let image = await rx.toPromise();
      resMgr.add(`${resPath}${imgPath[i]}`, image);
    }

    let textPromise =
        await forkJoin(
            textPath.map<Observable<string>>(
                (value) => this.heroService.getText(`${resPath}${value}`)))
            .toPromise();
    textPromise.forEach((value, index) => {
      resMgr.add(`${resPath}${textPath[index]}`, value);
    });

    let sb = skybox(
        [
          `${resPath}${imgPath[0]}`,
          `${resPath}${imgPath[1]}`,
          `${resPath}${imgPath[2]}`,
          `${resPath}${imgPath[3]}`,
          `${resPath}${imgPath[4]}`,
          `${resPath}${imgPath[5]}`,
        ],
        thegl, resMgr);
    sb.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      transform.position = this.scenes.mainCamera.position;
      gl.cullFace(gl.FRONT);
    });
    sb.setLateDraw((transform: Transform, gl: WebGLRenderingContext) => {
      gl.cullFace(gl.BACK);
    });



    let donghnut1 = donghnut(30, 36, 1, 3, thegl, resMgr);
    donghnut1.setInfo(this.scenes, (tran: Transform) => {
      tran.position = vec3.fromValues(1, 3, 2);
      tran.Mesh[0].material.setUniformI1i(
          'tex', sb.Tranforms['skybox'].Mesh[0].material.uniforms['tex'].value,
          thegl);
    });
    donghnut1.setEarlyDraw(
        (transform: Transform, gl: WebGLRenderingContext) => {
          let metalless = this.rangebox.Metaless;
          let smoothness = this.rangebox.Smoothness;
          transform.Mesh[0].material.setUniform_1f(
              'metalless', metalless, thegl);
          transform.Mesh[0].material.setUniform_1f(
              'smoothness', smoothness, thegl);
          transform.set_rz(Date.now() / 2000);
        });

    let donghnut2 = donghnut(30, 36, 1, 3, thegl, resMgr);
    donghnut2.setInfo(this.scenes, (tran: Transform) => {
      tran.position = vec3.fromValues(4, 4, 2);
      tran.scale = vec3.fromValues(0.5, 0.5, 0.5);
      tran.Mesh[0].material.setUniformI1i(
          'tex', sb.Tranforms['skybox'].Mesh[0].material.uniforms['tex'].value,
          thegl);
    });
    donghnut2.setParent(donghnut1);
    donghnut2.setEarlyDraw(
        (transform: Transform, gl: WebGLRenderingContext) => {
          let metalless = this.rangebox.Metaless;
          let smoothness = this.rangebox.Smoothness;
          transform.Mesh[0].material.setUniform_1f(
              'metalless', metalless, thegl);
          transform.Mesh[0].material.setUniform_1f(
              'smoothness', smoothness, thegl);
          transform.set_rx(Date.now() / 2000);
          transform.set_ry(Date.now() / 2000);
        });

    let donghnut3 = donghnut(30, 36, 1, 3, thegl, resMgr);
    donghnut3.setInfo(this.scenes, (tran: Transform) => {
      tran.position = vec3.fromValues(2, 2, 2);
      tran.scale = vec3.fromValues(0.2, 1, 0.2);
      tran.Mesh[0].material.setUniformI1i(
          'tex', sb.Tranforms['skybox'].Mesh[0].material.uniforms['tex'].value,
          thegl);
    });
    donghnut3.setParent(donghnut2);
    donghnut3.setEarlyDraw(
        (transform: Transform, gl: WebGLRenderingContext) => {
          let metalless = this.rangebox.Metaless;
          let smoothness = this.rangebox.Smoothness;
          transform.Mesh[0].material.setUniform_1f(
              'metalless', metalless, thegl);
          transform.Mesh[0].material.setUniform_1f(
              'smoothness', smoothness, thegl);
          transform.set_rx(Date.now() / 2000);
          transform.set_ry(Date.now() / 2000);
        });
    let donghnut4 = donghnut(30, 36, 1, 3, thegl, resMgr);
    donghnut4.setInfo(this.scenes, (tran: Transform) => {
      tran.position = vec3.fromValues(5, 5, 5);
      tran.Mesh[0].material.setUniformI1i(
          'tex', sb.Tranforms['skybox'].Mesh[0].material.uniforms['tex'].value,
          thegl);
    });
    donghnut4.setParent(donghnut3);
    donghnut4.setEarlyDraw(
        (transform: Transform, gl: WebGLRenderingContext) => {
          let metalless = this.rangebox.Metaless;
          let smoothness = this.rangebox.Smoothness;
          transform.Mesh[0].material.setUniform_1f(
              'metalless', metalless, thegl);
          transform.Mesh[0].material.setUniform_1f(
              'smoothness', smoothness, thegl);
          transform.set_rx(Date.now() / 2000);
          transform.set_ry(Date.now() / 2000);
        });

    let teapot = objLoader(
        `${resPath}models/teapot/`, 'teapot.obj', this.scenes.mtllib,
        this.scenes.GL, 'text_phone', resMgr);
    teapot.setInfo(this.scenes, (tran) => {
      tran.position = vec3.fromValues(0, -5, -5);
      tran.scale = vec3.fromValues(0.3, 0.3, 0.3);
    });

    let teapot2 = objLoader(
        `${resPath}models/teapot/`, 'teapot.obj', this.scenes.mtllib,
        this.scenes.GL, 'reflect_mat', resMgr);
    teapot2.setInfo(this.scenes, (tran) => {
      tran.position = vec3.fromValues(-5, -5, -5);
      tran.scale = vec3.fromValues(0.3, 0.3, 0.3);
    });

    let teapot3 = objLoader(
        `${resPath}models/teapot/`, 'teapot.obj', this.scenes.mtllib,
        this.scenes.GL, 'refract_mat', resMgr);
    teapot3.setInfo(this.scenes, (tran) => {
      tran.position = vec3.fromValues(5, -5, -5);
      tran.scale = vec3.fromValues(0.3, 0.3, 0.3);
    });

    this.messageService.endLoadingMSG(loading);
    this.scenes.LoadSence([
      sb, donghnut1, donghnut2, donghnut3, donghnut4, teapot, teapot2, teapot3
    ]);
    this.scenes.update = (s: Scenes) => {
      this.inputHandel.moveCtrl();
    };
    this.scenes.Run();
  }


  onClickCanvas(event: any) {
    this.inputHandel.canv_on_click();
  }
}
