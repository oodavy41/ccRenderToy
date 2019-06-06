import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
  navItems = [
    { name: 'Normal Rendering', icon: 'anticon-right', link: '/dashboard' },
    { name: 'Shadow Rendering', icon: 'anticon-right', link: '/shadowboard' },
  ];
  isCollapsed = true;

}
