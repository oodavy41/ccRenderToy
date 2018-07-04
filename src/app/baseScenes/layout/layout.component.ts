import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent {
  navItems = [
    { name: 'info', icon: 'anticon-right', link: '/detail/11' },
    { name: 'dash', icon: 'anticon-right', link: '/dashboard' },
  ];
  isCollapsed = true;

}
