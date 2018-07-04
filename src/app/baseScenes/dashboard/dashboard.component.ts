import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeroService } from '../../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  @ViewChild('webgl') glCanvas: ElementRef;
  public gl: WebGLRenderingContext;
  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.gl = (<HTMLCanvasElement>this.glCanvas.nativeElement).getContext('webgl');
    const gl = this.gl;
    if (!this.gl) {
      alert('no support for Webgl in this browser\nWEBGL无法在此浏览器初始化');
      return;
    }

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }


}
