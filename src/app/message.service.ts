import { Injectable } from '@angular/core';
import { NzMessageBaseService, NzMessageService } from 'ng-zorro-antd';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: string[] = [];
  constructor(private message: NzMessageService) { }
  add(message: string) {
    this.createBasicMSG(message);
  }

  createBasicMSG(msg: string) {
    this.message.info(msg);
  }

  createLoadingMSG(msg: string): string {
    return this.message.loading(msg, { nzDuration: 0 }).messageId;
  }

  endLoadingMSG(id: string) {
    this.message.remove(id);
  }
  clear() {
    this.messages = [];
  }
}
