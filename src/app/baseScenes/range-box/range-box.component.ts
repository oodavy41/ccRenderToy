import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-range-box',
  templateUrl: './range-box.component.html',
  styleUrls: ['./range-box.component.css']
})
export class RangeBoxComponent implements OnInit {

  LightDirectionX: number;
  LightDirectionY: number;
  LightDirectionZ: number;
  Smoothness: number;
  Metaless: number;

  constructor() {
    this.LightDirectionX = -10;
    this.LightDirectionY = 0;
    this.LightDirectionZ = 1;
    this.Smoothness = 32;
    this.Metaless = 0.5;
  }

  ngOnInit() {
  }

}
