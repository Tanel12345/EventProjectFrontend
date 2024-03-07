import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, EventService } from 'src/app/services/eventservice/event.service';
import { SharedService } from 'src/app/services/sharedService/shared.service';

@Component({
  selector: 'app-event-attendees',
  templateUrl: './event-attendees.component.html',
  styleUrls: ['./event-attendees.component.css']
})
export class EventAttendeesComponent {



  headerInfo: any = {pageName: "Osavõtjate vaade",
  additionalInfo: "Nii eraisikutest kui ettevõttetest osavõtjad"}
  
  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router, private sharedService: SharedService){}
    
  eventDetails: any | null | undefined;
  errorMessage: any| null | undefined;
  eventId: number | undefined | null;
    
  
  ngOnInit(): void {
      
    //Lisab selle komponendi headeri info
    this.sharedService.addHeaderInfo(this.headerInfo);
    
    //tellib home komponendist lisatud eventId query parameetrist
    this.route.queryParams.subscribe(params => {
      this.eventId = +params['eventId'] || 0; // Use '+' to convert to a number
      console.log("evendi id "+this.eventId);
    });
   
    if (this.eventId) {
      this.getEventDetails();

    //Tellib eelnevalt subjekti lisatud ürituse ja lisab selle komponendi muutujasse
    this.sharedService.event$.subscribe((event) => {this.eventDetails = event;
      console.log("eventDetails on kohe pärast tellimist veel null "+this.eventDetails); }, 
      (error) => {this.errorMessage = error;  console.error('Error fetching event:', error);})
      
    }else{this.errorMessage = 'Invalid eventId';}}

    //Kustutab sellelt ürituselt sisestatud id ga eraisikust osaleja ja uuendab state sharedservises
  deleteIndividualAttendee(attendeeId: number) {
    this.eventService.deleteIndividualAttendee("http://localhost:8080/api/events/events/"+this.eventId+"/individualAttendees/"+ attendeeId).subscribe({
      next: (data: ApiResponse) => {
        console.log('osaleja kustutati(frontend) '+data.message+' (backend)');
       
          this.getEventDetails();
      },
      error: (error) => {
        console.error('Osalejat ei kustutatud:', error);
        if(error.statusText === "Unknown Error"){this.errorMessage = "Server ei vasta"}else{
        this.errorMessage = "Osalejat ei kustutatud: " + error.errorMessage }
        
      }
  });
  }


  //Kustutab sellelt ürituselt sisestatud id ga ettevõttest osaleja ja uuendab state sharedservises
  deleteLegalAttendee(attendeeId: number) {
    this.eventService.deleteLegalAttendee("http://localhost:8080/api/events/events/"+this.eventId+"/legalAttendees/"+ attendeeId).subscribe({
      next: (data: ApiResponse) => {
        console.log('osaleja kustutati (frontend) '+data.message+' (backend)');
       
          this.getEventDetails();
      },
      error: (error) => {
        console.error('Osalejat ei kustutatud:', error);
        if(error.statusText === "Unknown Error"){this.errorMessage = "Server ei vasta"}else{
        this.errorMessage = "Osalejat ei kustutatud: " + error.errorMessage }
        
      }

   });
  } 

    //Tirib ürituse detailid koos osalejatega
    getEventDetails() {

    this.eventService.getEvent("http://localhost:8080/api/events/getEventDetailsWithAttendeesById/"+this.eventId).subscribe({
      next: (data) => {
      
        this.sharedService.addEvent(data)
      },
      error: (error) => {
        console.error('Ei saanud üritust:', error);
        if(error.statusText === "Unknown Error"){this.errorMessage = "Server ei vasta"}else{
        this.errorMessage = "Ei saanud üritust: " + error.errorMessage }
      }
    });

  }


    navigateToUpdateAttendeeViewIndividual(individual: number) {

    this.router.navigate(['/updateAttendee'], { queryParams: { individual: individual, eventId: this.eventId  }});
    }
    navigateToUpdateAttendeeViewLegal(legal: number ) {

      this.router.navigate(['/updateAttendee'], { queryParams: { legal: legal, eventId: this.eventId  } });
    }
    
}
