
import { TexManager } from '../../../Rlyeh/ResManager';
import { Scenes } from '../../../Rlyeh/Scenes';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeroService } from '../../hero.service';
import { RObject } from '../../../Rlyeh/object/Object';
import { forkJoin } from '../../../../node_modules/rxjs';
import { skybox, donghnut } from '../../../Rlyeh/baseModels';
import { Transform } from '../../../Rlyeh/object/Transform';
import { GLg } from '../../../Rlyeh/GLCore/GL';
import { MTL_TYPE } from '../../../Rlyeh/object/Material';
import { objLoader } from 'src/Rlyeh/loader';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  @ViewChild('webgl') glCanvas: ElementRef;
  private gl: WebGLRenderingContext;
  private scenes: Scenes;
  private time: Date;
  private texManager: TexManager;
  private objs: RObject[];
  constructor(private heroService: HeroService) { }

  async ngOnInit() {
    let glc = <HTMLCanvasElement>this.glCanvas.nativeElement;
    this.gl = glc.getContext('webgl');
    const gl = this.gl;

    this.scenes = new Scenes(glc);
    this.time = new Date();
    let thegl = this.scenes.GLCtrl;

    let light_direction = [-10, 0, -1, 0];
    let light_color = [1, 1, 1];
    let camera_pos = [-3, 6, 6];
    let camera_front = [0, 0, -1];
    let camera_up = [0, 1, 0];
    let camera_info = [Math.PI / 3, glc.width / glc.height, 0.01, 100];


    thegl.create(glc);
    thegl.set_light(light_direction, light_color);
    thegl.set_cam_pos(camera_pos);
    thegl.set_cam_front(camera_front);
    thegl.set_cam_up(camera_up);
    thegl.set_cam_info(camera_info);
    thegl.set_cam_ptype();

    let resPath = '../../../assets/resource/';
    let skyboxPath = [
      'skyboxs/bs2/X.png',
      'skyboxs/bs2/-X.png',
      'skyboxs/bs2/Y.png',
      'skyboxs/bs2/-Y.png',
      'skyboxs/bs2/Z.png',
      'skyboxs/bs2/-Z.png'
    ];
    let skyboxImage = [];
    let sb;
    let sbpromise = await forkJoin([
      this.heroService.getBlob(resPath + skyboxPath[0]),
      this.heroService.getBlob(resPath + skyboxPath[1]),
      this.heroService.getBlob(resPath + skyboxPath[2]),
      this.heroService.getBlob(resPath + skyboxPath[3]),
      this.heroService.getBlob(resPath + skyboxPath[4]),
      this.heroService.getBlob(resPath + skyboxPath[5]),
    ]).toPromise();
    sbpromise.forEach((value, index) => {
      let im = new Image();
      im.onload = () => { window.URL.revokeObjectURL(im.src); };
      im.src = window.URL.createObjectURL(value);
      skyboxImage[index] = im;
    });
    sb = skybox(skyboxImage, thegl.gl, this.texManager);
    sb.setEarlyDraw((transform: Transform, glg: GLg) => {
      transform.set_pos(thegl.camera_pos[0], thegl.camera_pos[1], thegl.camera_pos[2]);
      glg.gl.cullFace(glg.gl.FRONT);
    });
    sb.setLateDraw((transform: Transform, glg: GLg) => {
      glg.gl.cullFace(glg.gl.BACK);
    });



    let donghnut1 = donghnut(30, 36, 1, 3, thegl);
    donghnut1.setInfo((tran: Transform) => {
      tran.set_pos(10, 3, 2);
      tran.Mesh[0].material.set_uniform(
        MTL_TYPE.I1i,
        'tex',
        sb[0].Mesh[0].material.uniforms['tex'].value,
        thegl.gl
      );
    });
    donghnut1.setEarlyDraw((transform: Transform, glg: GLg) => {
      let metalless = parseFloat((document.getElementById('metals') as HTMLInputElement).value);
      let smoothness = parseFloat((document.getElementById('smooths') as HTMLInputElement).value);
      transform.Mesh[0].material.set_uniform(MTL_TYPE._1f, 'metalless', metalless, thegl.gl);
      transform.Mesh[0].material.set_uniform(MTL_TYPE._1f, 'smoothness', smoothness, thegl.gl);
      transform.set_rz(this.time.getTime() / 2000);
      transform.set_rx(this.time.getTime() / 1000);
    });

    this.scenes.LoadSence([sb, donghnut1]);
    this.scenes.Run();
  }

  objsss() {
    let thegl = this.scenes.GLCtrl;
    let resPah = '', resPath = '';
    let sb = [];
    let texMgr = this.texManager;
    // ----------------------------------

    let objs1 = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_phone', texMgr);

    let objs11 = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'anim_edge_phone', texMgr);
    objs11.setEarlyDraw((transform: Transform, glg: GLg) => {
      glg.gl.cullFace(glg.gl.FRONT);
    });
    objs11.setLateDraw((transform: Transform, glg: GLg) => {
      glg.gl.cullFace(glg.gl.BACK);
    });


    // ----------------------------------

    let objs2 = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'text_phone', texMgr);
    objs2.setInfo((tran: Transform) => {
      tran.set_pos(0, 0, 2);
    });


    // ----------------------------------


    let objsrefl = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'reflect_mat', texMgr);
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

    let objsrefr = objLoader(resPah + 'models/mwzz/', 'mwzz.obj', thegl.mtllib, thegl.gl, 'refract_mat', texMgr);
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


