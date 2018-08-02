import { RangeBoxComponent } from '../range-box/range-box.component';

import { Scenes } from '../../../Rlyeh/Scenes';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeroService } from '../../hero.service';
import { RObject } from '../../../Rlyeh/object/Object';
import { forkJoin, Observable } from 'rxjs';
import { skybox, donghnut } from '../../../Rlyeh/baseModels';
import { Transform } from '../../../Rlyeh/object/Transform';
import { GLg } from '../../../Rlyeh/GLCore/GL';
import { MTL_TYPE } from '../../../Rlyeh/object/Material';
import { objLoader } from '../../../Rlyeh/loader';
import { viewClassName } from '@angular/compiler';
import { MessageService } from '../../message.service';
import { ResManager } from '../../../Rlyeh/ResManager';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  @ViewChild('webgl') glCanvas: ElementRef;
  @ViewChild('rangebox') rangebox: RangeBoxComponent;
  private gl: WebGLRenderingContext;
  private scenes: Scenes;
  private time: Date;
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  async ngOnInit() {
    let glc = <HTMLCanvasElement>this.glCanvas.nativeElement;

    let resMgr = new ResManager();
    this.scenes = new Scenes(glc, resMgr);
    let thegl = this.scenes.GL;

    let loading = this.messageService.createLoadingMSG('loading');

    let light_direction = [-10, 0, -1, 0];
    let light_color = [1, 1, 1];
    let camera_pos = [-3, 6, 6];
    let camera_front = [0, 0, -1];
    let camera_up = [0, 1, 0];
    let camera_info = [Math.PI / 3, glc.width / glc.height, 0.01, 100];

    this.scenes.mainCamera.set_light(light_direction, light_color);
    this.scenes.mainCamera.set_cam_pos(camera_pos);
    this.scenes.mainCamera.set_cam_front(camera_front);
    this.scenes.mainCamera.set_cam_up(camera_up);
    this.scenes.mainCamera.set_cam_info(camera_info);
    this.scenes.mainCamera.set_cam_ptype();

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
      'models/teapot/default.png',
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
      'models/teapot/default.mtl',
      'models/teapot/teapot.obj',
    ];

    let imagePromise = await forkJoin(
      imgPath.map<Observable<Blob>>(value => this.heroService.getBlob(`${resPath}${value}`))
    ).toPromise();
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

    let textPromise = await forkJoin(
      textPath.map<Observable<string>>((value) => this.heroService.getText(`${resPath}${value}`))
    ).toPromise();
    textPromise.forEach((value, index) => {
      resMgr.add(`${resPath}${textPath[index]}`, value);
    });

    let sb = skybox([
      `${resPath}${imgPath[0]}`,
      `${resPath}${imgPath[1]}`,
      `${resPath}${imgPath[2]}`,
      `${resPath}${imgPath[3]}`,
      `${resPath}${imgPath[4]}`,
      `${resPath}${imgPath[5]}`,
    ], thegl, resMgr);
    sb.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      transform.set_pos(thegl.camera_pos[0], thegl.camera_pos[1], thegl.camera_pos[2]);
      gl.cullFace(gl.FRONT);
    });
    sb.setLateDraw((transform: Transform, gl: WebGLRenderingContext) => {
      gl.cullFace(gl.BACK);
    });



    let donghnut1 = donghnut(30, 36, 1, 3, thegl);
    donghnut1.setInfo((tran: Transform) => {
      tran.set_pos(1, 3, 2);
      tran.Mesh[0].material.set_uniform[MTL_TYPE.I1i](
        'tex',
        sb.Tranforms[0].Mesh[0].material.uniforms['tex'].value,
        thegl
      );
    });
    donghnut1.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      let metalless = this.rangebox.Metaless;
      let smoothness = this.rangebox.Smoothness;
      transform.Mesh[0].material.set_uniform[MTL_TYPE._1f]('metalless', metalless, thegl.gl);
      transform.Mesh[0].material.set_uniform[MTL_TYPE._1f]('smoothness', smoothness, thegl.gl);
      transform.set_rz(Date.now() / 2000);
      transform.set_rx(Date.now() / 1000);
    });

    this.messageService.endLoadingMSG(loading);
    this.scenes.LoadSence([sb, donghnut1]);
    this.scenes.Run();
  }

  objsss() {
    let thegl = this.scenes.GL;
    let resPath = '';
    let sb = [];
    // ----------------------------------

    let objs1 = objLoader(resPath + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_phone', thegl.resManager);

    let objs11 = objLoader(resPath + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_edge_phone', thegl.resManager);
    objs11.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      gl.cullFace(gl.FRONT);
    });
    objs11.setLateDraw((transform: Transform, gl: WebGLRenderingContext) => {
      gl.cullFace(gl.BACK);
    });


    // ----------------------------------

    let objs2 = objLoader(resPath + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'text_phone', thegl.resManager);
    objs2.setInfo((tran: Transform) => {
      tran.set_pos(0, 0, 2);
    });


    // ----------------------------------


    let objsrefl = objLoader(resPath + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'reflect_mat', thegl.resManager);
    objsrefl.setInfo((tran: Transform) => {
      tran.Mesh[0].material.set_uniform(
        MTL_TYPE.I1i,
        'tex',
        sb[0].Mesh[0].material.uniforms['tex'].value,
        thegl.gl
      );
      tran.set_pos(0, 0, 4);
    });


    // ----------------------------------

    let objsrefr = objLoader(resPath + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'refract_mat', thegl.resManager);
    objsrefr.setInfo((tran: Transform) => {
      tran.Mesh[0].material.set_uniform(
        MTL_TYPE.I1i,
        'tex',
        sb[0].Mesh[0].material.uniforms['tex'].value,
        thegl.gl
      );
      tran.Mesh[0].material.set_uniform(MTL_TYPE._1f, 'ratio', 1 / 1.52, thegl.gl);
      tran.set_pos(0, 0, 6);
    });

  }


  onMouseMove(event: any) {
    console.log(event.clientX, event.clientY);
  }
}


