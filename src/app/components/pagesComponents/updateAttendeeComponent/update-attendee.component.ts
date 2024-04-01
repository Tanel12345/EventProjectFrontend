
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiResponse, EventService } from 'src/app/services/eventservice/event.service';
import { SharedService } from 'src/app/services/sharedService/shared.service';
import { environment } from 'src/environments/environment.prod';
@Component({
  selector: 'app-update-attendee',
  templateUrl: './update-attendee.component.html',
  styleUrls: ['./update-attendee.component.css']
})
export class UpdateAttendeeComponent {
  apiUrl = environment.apiUrl;

  headerInfo: any = {
    pageName: 'Osavõtja andmete uuendamise vaade',
    additionalInfo: 'Uuenda osavõtja andmeid',
  };

  individualAttendeeId: number | undefined;
  legalAttendeeId: number | undefined;
  eventId: number | undefined | null;
  eventDetails:any;
  errorMessage: string = '';
  

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  individualAttendeeDetails: any | null | undefined;
  legalAttendeeDetails: any | null | undefined;
  
  individualForm!: FormGroup;
  legalForm!: FormGroup;

  ngOnInit(): void {
    //Lisab selle komponendi headeri info
    this.sharedService.addHeaderInfo(this.headerInfo);

    //ActivatedRoutes tellib home komponendist lisatud eventId query parameetrist
    this.route.queryParams.subscribe((params) => {
      this.individualAttendeeId = +params['individual'] || 0;
      this.legalAttendeeId = +params['legal'] || 0;
      this.eventId = +params['eventId'] || 0; // Use '+' to convert to a number
      
    });

    
    //Tellib eelnevalt subjekti lisatud ürituse ja lisab selle komponendi muutujasse
    this.sharedService.event$.subscribe((event) => {this.eventDetails = event;
      
      //Kui urli ga tuleb individualAttendeeId
      if (this.individualAttendeeId) {

        const selectedIndividualAttendee = this.findIndividualAttendeeById(this.individualAttendeeId);
      // kui osaleja selle id ga leitakse
      if (selectedIndividualAttendee) {
      // lisab osaleja uude muutujasse
      this.individualAttendeeDetails = { ...selectedIndividualAttendee };
      console.log("Selected Individual Attendee Details:", this.individualAttendeeDetails);
    } else {
      console.log("Individual Attendee with ID not found.");
    }
  }
    if (this.legalAttendeeId) {
      const selectedlegalAttendeeDetails = this.findLegalAttendeeById(this.legalAttendeeId);
      this.legalAttendeeDetails = { ...selectedlegalAttendeeDetails };
      console.log("Selected Legal Attendee Details:", this.legalAttendeeDetails);
    }
    console.log("eventDetails on kohe pärast tellimist veel null "+this.legalAttendeeDetails); }, 
    (error) => {this.errorMessage = error;  console.error('Error fetching event:', error);})
    
   
      console.log(this.eventDetails )
      console.log(typeof this.eventDetails);

    // Loome reactive vormi objekti FormGroup ja sellele kuuluvad üksikud formi inputid ehk objektidena formControlid.
    // Formcontrol i nimi ja väärtuseks array mille esimene objekt on antud formcontroli esmane väärtus,antgud juhul lisame esmaseks väärtuseks muutmiseks lisatud osaleja andmed, teiseks kasutame Validaatorit või validaatoreid angulari poolt.

    if (this.individualAttendeeId) {
    this.individualForm = this.fb.group({
      firstName: [this.individualAttendeeDetails.firstName, Validators.required],
      lastName: [this.individualAttendeeDetails.lastName, Validators.required],
      personalCode: [this.individualAttendeeDetails.personalCode, [Validators.required, Validators.pattern(/^\d{11}$/)]],
      paymentMethod: [this.individualAttendeeDetails.paymentMethod, Validators.required],
      additionalInfo: [this.individualAttendeeDetails.additionalInfo, Validators.maxLength(1500)],
    });}

    if (this.legalAttendeeId) {
    this.legalForm = this.fb.group({
      companyName: [this.legalAttendeeDetails.companyName, Validators.required],
      registryCode: [this.legalAttendeeDetails.registrationCode, [Validators.required, Validators.pattern('^[0-9]*$')]], 
      numberOfParticipants: [this.legalAttendeeDetails.numberOfParticipant, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.max(25)]], 
      paymentMethod: [this.legalAttendeeDetails.paymentMethod , Validators.required],
      additionalInfo: [this.legalAttendeeDetails.additionalInfo , Validators.maxLength(5000)],
    });}
  }

  
  
  
  
  findIndividualAttendeeById(individualAttendeeId: number) {
    // Kontrollib kas eventDetails sisaldab  osalejat
    if (this.eventDetails.individualAttendees && this.eventDetails.individualAttendees.length > 0) {
      // Tagastab täpsustatud id ga osaleja
      return this.eventDetails.individualAttendees.find((attendee: { id: number; }) => attendee.id === individualAttendeeId);
    } else {
      // Tagastab nulli kui osalejat ei leitud
      return null;
    }
  }
    
  findLegalAttendeeById(legalAttendeeId: number) {
      
      if (this.eventDetails.legalAttendees && this.eventDetails.legalAttendees.length > 0) {
        return this.eventDetails.legalAttendees.find((attendee: { id: number; }) => attendee.id === legalAttendeeId);
      } else {
   
        return null;
    }
  }

  updateIndividual() {
    
    if (this.individualForm.valid) {
      const individualFormData = {
        firstName: this.individualForm.get('firstName')?.value,
        lastName: this.individualForm.get('lastName')?.value,
        personalCode: this.individualForm.get('personalCode')?.value,
        paymentMethod: this.individualForm.get('paymentMethod')?.value,
        additionalInfo: this.individualForm.get('additionalInfo')?.value,
      };

      this.eventService
        .updateIndividualAttendeeFromEvent(
          this.apiUrl+'/api/events/events/'+this.eventId+'/individualAttendees/'+this.individualAttendeeId,
           individualFormData
         
        )
        .subscribe(
          (response: ApiResponse) => {
            // Handle successful response
            console.log('Response:', response);
            this.router.navigate(['/eventAttendees'], { queryParams: { eventId: this.eventId } });
          },
          (error) => {
            // Handli error
            console.error('Error:', error);
            this.errorMessage = error.message;
          }
        );
    } else {
      // Käime läbi iga formcontroli
      Object.keys(this.individualForm.controls).forEach((field) => {
        const control = this.individualForm.get(field);
        //Kui control on invalid, siis määramr
        if (control?.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }
  

  updateLegal() {
    if (this.legalForm.valid) {
      const legalFormData = {
        companyName: this.legalForm.get('companyName')?.value,
        registrationCode: this.legalForm.get('registryCode')?.value,
        numberOfParticipant: this.legalForm.get('numberOfParticipants')?.value,
        paymentMethod: this.legalForm.get('paymentMethod')?.value,
        additionalInfo: this.legalForm.get('additionalInfo')?.value,
      };
      
      
      this.eventService
        .updateLegalAttendeeFromEvent(
          this.apiUrl+'/api/events/events/'+this.eventId+'/legalAttendees/'+this.legalAttendeeId,
           legalFormData
         
        )
        .subscribe(
          (response: ApiResponse) => {
            // Handle successful response
            console.log('Response:', response);
            this.router.navigate(['/eventAttendees'], { queryParams: { eventId: this.eventId } });
          },
          (error) => {
            // Handli error
            console.error('Error:', error);
            this.errorMessage = error.message;
          }
        );
    } else {
      // Käime läbi iga formcontroli
      Object.keys(this.legalForm.controls).forEach((field) => {
        const control = this.legalForm.get(field);
        //Kui control on invalid, siis määramr
        if (control?.invalid) {
          control.markAsTouched({ onlySelf: true });this.legalAttendeeDetails
      }
    });

    }
  }
}

