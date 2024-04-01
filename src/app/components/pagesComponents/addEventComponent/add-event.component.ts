import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse, EventService } from 'src/app/services/eventservice/event.service';
import { SharedService } from 'src/app/services/sharedService/shared.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent {

  apiUrl = environment.apiUrl;
  headerInfo: any = {
    pageName: 'Ürituse lisamise vaade',
    additionalInfo: 'Lisa tulevaid üritusi',
  };

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

 
  errorMessage: any | null | undefined;
  eventForm!: FormGroup;

  ngOnInit(): void {
    //Lisab selle komponendi headeri info
    this.sharedService.addHeaderInfo(this.headerInfo);

    

    // Loome reactive vormi objekti FormGroup ja sellele kuuluvad üksikud formi inputid ehk objektidena formControlid.
    // Formcontrol i nimi ja väärtuseks array mille esimene objekt on antud formcontroli esmane väärtus, teiseks kasutame Validaatorit või validaatoreid angulari poolt.
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator()]],
      time: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      additionalInfo: ['', Validators.maxLength(1000)],
    });

    
  }
    
  saveNewEvent() {
    console.log(this.eventForm)
    if (this.eventForm.valid) {

      const dateValue = this.eventForm.get('date')?.value;
      const timeValue = this.eventForm.get('time')?.value;
     

      const locationAddress = { 
      street: this.eventForm.get('street')?.value,
      city: this.eventForm.get('city')?.value,
      state: this.eventForm.get('state')?.value,
      zipCode: this.eventForm.get('zipCode')?.value,}

      const eventFormData = {
        name: this.eventForm.get('name')?.value,
        time: this.combineDateAndTime(dateValue, timeValue),
        additionalInfo: this.eventForm.get('additionalInfo')?.value,
        locationAddress: locationAddress
      };

      this.eventService
        .createEventWithoutAttendees(
          this.apiUrl+'/api/events/createEventWithoutAttendees' ,eventFormData
        )
        .subscribe(
          (response: ApiResponse) => {
            // Handle successful response
            console.log('Response:', response);
            this.router.navigate(['/']);
          },
          (error) => {
            // Handli error
            console.error('Error:', error);
            if (error.error && error.error.message) {
              this.errorMessage = error.error.message; 
            } else {
              this.errorMessage = 'Server ei vasta'; 
            }
            
          }
        );
     } else {
      // Käime läbi iga formcontroli
      Object.keys(this.eventForm.controls).forEach((field) => {
        const control = this.eventForm.get(field);
        //Kui control on invalid, siis määrame et on puudutatud on true
        if (control?.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }
  combineDateAndTime(dateValue: any, timeValue: any): string {
    
    if (dateValue && timeValue) {
      // Liidame kuupäeva ja aja, t keskel
      return `${dateValue}T${timeValue}`;
    }
  
    return ''; 
  }

  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();

      if (isNaN(selectedDate.getTime()) || selectedDate < currentDate) {
        return { 'futureDate': true };
      }
  
      return null;
    };
  }
}
  