import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { EventService } from 'src/app/services/eventservice/event.service';
import { SharedService } from 'src/app/services/sharedService/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  
  headerInfo: any = {pageName: "AVALEHT",
  additionalInfo: "Kõik registreeritud üritused"}

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router, private sharedService: SharedService){}
  allEvents: any;
  errorMessage: any
  
  ngOnInit(): void {
    this.getEvents();
    this.sharedService.events$.subscribe((events) => {this.allEvents = events;})
    this.sharedService.addHeaderInfo(this.headerInfo)
  }

  
  getEvents(): void {
    this.eventService.getEvents("http://localhost:8080/api/events/getAllEvents").subscribe({
      next: (data) => {
      
        this.sharedService.addEvents(data)
        console.log('Product Fields:', this.allEvents);

        console.log("cccc"+this.allEvents[0]);
      },
      error: (error) => {
        console.error('Ei saanud üritusi:', error);
        if(error.statusText === "Unknown Error"){this.errorMessage = "Server ei vasta"}else{
        this.errorMessage = "Ei saanud üritusi: " + error.errorMessage }
      }
    });
  }

    
  addNewEvent() {
    throw new Error('Method not implemented.');
    }


  moveToAttendeesView(eventId: number) {

    
    console.log(eventId)
    this.router.navigate(['/eventAttendees'], { queryParams: { eventId: eventId } });
  
  }

}