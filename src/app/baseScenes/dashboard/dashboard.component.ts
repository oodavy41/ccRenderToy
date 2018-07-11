import { TexManager } from './../../../../Rlyeh/ResManager';
import { Scenes } from './../../../../Rlyeh/Scenes';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeroService } from '../../hero.service';

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
  constructor(private heroService: HeroService) { }

  ngOnInit() {
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
  }

  onMouseMove(event: any) {
    console.log(event.clientX, event.clientY);
  }
}
