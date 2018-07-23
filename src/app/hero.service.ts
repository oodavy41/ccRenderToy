import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';


import { MessageService } from './message.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getText(url: string) {
    return this.http.get(url, { responseType: 'text' });
  }

  getBlob(url: string) {
    return this.http.get(url, { responseType: 'blob' });
  }

}
