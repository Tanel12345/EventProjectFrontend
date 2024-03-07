import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterModule } from '@angular/router';
import { ApiResponse, EventService } from 'src/app/services/eventservice/event.service';
import { SharedService } from 'src/app/services/sharedService/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  
  headerInfo: any = {pageName: "AVALEHT",
  additionalInfo: "Kõik registreeritud üritused"}

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router, private sharedService: SharedService, private datePipe: DatePipe){
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');}
  allEvents: any;
  errorMessage: any
  currentDate: string|null;
  
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
    this.router.navigate(['/addEvent']);
    }


  navigateToAttendeesView(eventId: number) {

    console.log(eventId)
    this.router.navigate(['/eventAttendees'], { queryParams: { eventId: eventId } });
  
  }


  deleteEvent(eventId: number) {


    this.eventService.deleteEvent("http://localhost:8080/api/events/deleteEventById/"+eventId).subscribe(
      (response: ApiResponse) => {
        // Handle successful response
        console.log('Response:', response);
        window.location.reload();
      },
      (error) => {
        // Handli error
        console.error('Error:', error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 0) {
            // Server is not reachable or closed
            console.error('Server ei vasta või on suletud.');
            this.errorMessage = "Server ei vasta või on suletud.";
          } else {
            // Http errorid
            console.error('HTTP error status:', error.status);
            this.errorMessage = error.message;
          }
        } else {
          //Mitte http errorid
          console.error('Non-HTTP error:', error.message);
          this.errorMessage = error.message;
        }
      }
        
      
    );
    
    }


  navigateToAddAttendee(eventId: number) {


    console.log(eventId)
    this.router.navigate(['/addAttendee'], { queryParams: { eventId: eventId } });
  }

}