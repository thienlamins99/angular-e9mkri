import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CmStateService {
  values: any = {};

  register(cmID: string) {
    this.values[cmID] = new Subject();
  }

  unregister(cmID: string) {
    this.values[cmID].complete();
    delete this.values[cmID];
  }
}
