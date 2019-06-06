import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { vec3, vec4 } from "gl-matrix";
import { forkJoin, Observable } from "rxjs";

import { EventManager } from "../../../node_modules/@angular/platform-browser";
import { donghnut, panel, skybox } from "../../Rlyeh/baseModels";
import { KeyBoardCtrl } from "../../Rlyeh/handle";
import { Light, LIGHT_TYPE } from "../../Rlyeh/Light";
import { objLoader } from "../../Rlyeh/loader";
import { BasePhoneMat } from "../../Rlyeh/object/materials/BasePhoneMat";
import { DepthMat } from "../../Rlyeh/object/materials/depthMat";
import { ReflectMat } from "../../Rlyeh/object/materials/ReflectMat";
import { RefractMat } from "../../Rlyeh/object/materials/RefractMat";
import { TexPhoneMat } from "../../Rlyeh/object/materials/TexPhoneMat";
import { Transform } from "../../Rlyeh/object/Transform";
import { ResManager } from "../../Rlyeh/ResManager";
import { Scenes } from "../../Rlyeh/Scenes";
import { HeroService } from "../hero.service";
import { MessageService } from "../message.service";
import { BasePhoneShadowMat } from "src/Rlyeh/object/materials/basePhoneShadowMat";

@Component({
  selector: "app-shadowboard",
  templateUrl: "./shadowboard.component.html",
  styleUrls: ["./shadowboard.component.css"]
})
export class ShadowboardComponent implements OnInit {
  @ViewChild("print") printCanvas: ElementRef;
  @ViewChild("frame") frameCanvas: ElementRef;
  lightAngle: number;
  framectx: CanvasRenderingContext2D;
  private scenes: Scenes;
  private time: Date;

  constructor(private heroService: HeroService, private messageService: MessageService, private eventMgr: EventManager) {
    this.lightAngle = 15;
  }

  async ngOnInit() {
    let frame = <HTMLCanvasElement>this.frameCanvas.nativeElement;
    this.framectx = frame.getContext("2d") as CanvasRenderingContext2D;

    let glc = <HTMLCanvasElement>this.printCanvas.nativeElement;
    let resMgr = new ResManager("assets/resource/", "models/", "shaders/", "skyboxs/");
    this.scenes = new Scenes(glc, resMgr);
    let thegl = this.scenes.GL;
    this.scenes["framectx"] = this.framectx;

    let loading = this.messageService.createLoadingMSG("loading");
    let lightRad = 20;
    let light_pos = vec3.fromValues(lightRad, 10, lightRad);
    let light_aim = vec3.fromValues(0, -40, 0);
    let light_color = vec4.fromValues(1, 1, 1, 1);
    let camera_pos = vec3.fromValues(10, 40, 40);
    let cameraAim = vec3.fromValues(0, -20, 0);
    let cameraUp = vec3.fromValues(0, 1, 0);
    let cameraInfo = [Math.PI / 3, glc.width / glc.height, 0.01, 10000];

    this.scenes.lights["Main"] = new Light(LIGHT_TYPE.DIRECTION, light_pos, light_aim, light_color);
    this.scenes.mainCamera.position = camera_pos;
    this.scenes.mainCamera.cameraAim = cameraAim;
    this.scenes.mainCamera.cameraUp = cameraUp;
    this.scenes.mainCamera.cameraInfo = cameraInfo;

    let resPath = "assets/resource/";
    let textPath = [
      // shaders
      "shaders/base_phone_shadow.frag",
      "shaders/base_phone_shadow.vert",
      "shaders/base_phone.frag",
      "shaders/base_phone.vert",
      "shaders/shadow_only.frag",
      "shaders/shadow_only.vert",
      "shaders/text_phone.frag",
      "shaders/text_phone.vert"
    ];

    let textPromise = await forkJoin(
      textPath.map<Observable<string>>(value => this.heroService.getText(`${resPath}${value}`))
    ).toPromise();
    textPromise.forEach((value, index) => {
      resMgr.add(`${resPath}${textPath[index]}`, value);
    });

    this.scenes.EnableShadow(512, 512);
    let donghnut1 = donghnut(30, 36, 1, 3, thegl, resMgr, this.scenes.shadow);
    donghnut1.setInfo(this.scenes, (tran: Transform) => {
      (tran.Mesh[0].material as BasePhoneMat).smoothness = 1;
      tran.position = vec3.fromValues(1, 3, 2);
    });
    donghnut1.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      transform.set_rz(Date.now() / 5000);
    });

    let donghnut2 = donghnut(30, 36, 1, 3, thegl, resMgr, this.scenes.shadow);
    donghnut2.setInfo(this.scenes, (tran: Transform) => {
      (tran.Mesh[0].material as BasePhoneMat).smoothness = 1;
      tran.position = vec3.fromValues(4, 4, 2);
      tran.scale = vec3.fromValues(0.5, 0.5, 0.5);
    });
    donghnut2.setParent(donghnut1);
    donghnut2.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      transform.set_rx(-Date.now() / 2000);
      transform.set_ry(-Date.now() / 2000);
    });

    let donghnut3 = donghnut(30, 36, 1, 3, thegl, resMgr, this.scenes.shadow);
    donghnut3.setInfo(this.scenes, (tran: Transform) => {
      (tran.Mesh[0].material as BasePhoneMat).smoothness = 1;
      tran.position = vec3.fromValues(2, 2, 2);
      tran.scale = vec3.fromValues(0.2, 1, 0.2);
    });
    donghnut3.setParent(donghnut2);
    donghnut3.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      transform.set_rz(Date.now() / 2000);
      transform.set_ry(Date.now() / 2000);
    });
    let donghnut4 = donghnut(30, 36, 1, 3, thegl, resMgr, this.scenes.shadow);
    donghnut4.setInfo(this.scenes, (tran: Transform) => {
      (tran.Mesh[0].material as BasePhoneMat).smoothness = 1;
      tran.position = vec3.fromValues(5, 5, 5);
    });
    donghnut4.setParent(donghnut3);
    donghnut4.setEarlyDraw((transform: Transform, gl: WebGLRenderingContext) => {
      transform.set_rx(Date.now() / 2000);
      transform.set_rz(Date.now() / 2000);
    });

    let ground = panel(80, thegl, this.scenes.shadow, resMgr);
    ground.setInfo(this.scenes, tran => {
      tran.position = vec3.fromValues(0, -40, 0);
      (tran.Mesh[0].material as BasePhoneMat).smoothness = 1;
    });

    this.messageService.endLoadingMSG(loading);
    this.scenes.LoadSence([donghnut1, donghnut2, donghnut3, donghnut4, ground]);
    this.scenes.update = (s: Scenes) => {
      this.scenes.lights["Main"].position = vec3.fromValues(
        Math.sin((this.lightAngle / 180) * Math.PI) * lightRad,
        20,
        Math.cos((this.lightAngle / 180) * Math.PI) * lightRad
      );
      let img = new ImageData(new Uint8ClampedArray(this.scenes.lights["Main"].depthFrame.textData.buffer), 512, 512);
      this.framectx.putImageData(img, 0, 0);
    };
    this.scenes.Run();
  }
}
