import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  private header = new BehaviorSubject<any>({}); //Behavioursubject observable headeri info jaoks
   headerInfo$ = this.header.asObservable(); //Tellijate muutuja
   addHeaderInfo(headerInfo: any): void { this.header.next(headerInfo);}

   private eventHolder = new BehaviorSubject<any[]>([]); //Behavioursubject observable kuhu lisame andmed
   events$ = this.eventHolder.asObservable(); //Tellijate muutuja
   addEvents(events: any[]) { this.eventHolder.next(events);}

   private specificEvent = new BehaviorSubject<any | null>(null); //Behavioursubject observable kuhu lisame andmed
   event$ = this.specificEvent.asObservable(); //Tellijate muutuja
   addEvent(event: any) { this.specificEvent.next(event);
}
}
