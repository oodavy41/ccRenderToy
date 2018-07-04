import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';


import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {

  constructor(private messageService: MessageService) { }

}
