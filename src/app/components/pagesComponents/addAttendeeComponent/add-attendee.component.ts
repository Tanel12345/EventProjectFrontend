import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EventService,
  IndividualAttendees,
  LegalAttendees,
} from 'src/app/services/eventservice/event.service';
import { SharedService } from 'src/app/services/sharedService/shared.service';

@Component({
  selector: 'app-add-attendee',
  templateUrl: './add-attendee.component.html',
  styleUrls: ['./add-attendee.component.css'],
})
export class AddAttendeeComponent {
  headerInfo: any = {
    pageName: 'Osavõtjate lisamise vaade',
    additionalInfo: 'Lisa nii eraisikutest kui ettevõttetest osavõtjaid',
  };

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {}

  individualAttendeeDetails: any | null | undefined;
  legalAttendeeDetails: any | null | undefined;
  errorMessage: any | null | undefined;
  eventId: number | undefined | null;

  shoudAddindividualVariable: boolean = false;
  shoudAddLegalVariable: boolean = false;
  individualForm!: FormGroup;
  legalForm!: FormGroup;

  ngOnInit(): void {
    //Lisab selle komponendi headeri info
    this.sharedService.addHeaderInfo(this.headerInfo);

    //ActivatedRoutes tellib home komponendist lisatud eventId query parameetrist
    this.route.queryParams.subscribe((params) => {
      this.eventId = +params['eventId'] || 0; // Use '+' to convert to a number
      console.log('evendi id ' + this.eventId);
    });

    // Loome reactive vormi objekti FormGroup ja sellele kuuluvad üksikud formi inputid ehk objektidena formControlid.
    // Formcontrol i nimi ja väärtuseks array mille esimene objekt on antud formcontroli esmane väärtus, teiseks kasutame Validaatorit või validaatoreid angulari poolt.
    this.individualForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      personalCode: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      paymentMethod: ['', Validators.required],
      additionalInfo: ['', Validators.maxLength(1500)],
    });

    this.legalForm = this.fb.group({
      companyName: ['', Validators.required],
      registryCode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      numberOfParticipants: ['', [Validators.required, Validators.pattern('^[0-9]*$'),Validators.max(25)]], 
      paymentMethod: ['', Validators.required],
      additionalInfo: ['', Validators.maxLength(5000)],
    });
  }

  //Salvesta eraisikust osaleja sama ürituse id alla andmebaasi
  saveIndividual(): void {
    console.log('Form status:', this.individualForm.status);
    console.log('Form value:', this.individualForm.value);
    console.log(this.individualForm);
    if (this.individualForm.valid) {
      const individualFormData = {
        firstName: this.individualForm.get('firstName')?.value,
        lastName: this.individualForm.get('lastName')?.value,
        personalCode: this.individualForm.get('personalCode')?.value,
        paymentMethod: this.individualForm.get('paymentMethod')?.value,
        additionalInfo: this.individualForm.get('additionalInfo')?.value,
      };

      this.eventService
        .addIndividualAttendee(
          'http://localhost:8080/api/events/addIndividualAttendeeToEventId/' +
            this.eventId,
          individualFormData
        )
        .subscribe(
          (response: IndividualAttendees) => {
            // Handle successful response
            console.log('Response:', response);
            this.router.navigate(['/main']);
          },
          (error) => {
            // Handli error
            console.error('Error:', error);
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

  saveLegal(): void {
    if (this.legalForm.valid) {
      const legalFormData = {
        companyName: this.legalForm.get('companyName')?.value,
        registrationCode: this.legalForm.get('registryCode')?.value,
        numberOfParticipant: this.legalForm.get('numberOfParticipants')?.value,
        paymentMethod: this.legalForm.get('paymentMethod')?.value,
        additionalInfo: this.legalForm.get('additionalInfo')?.value,
      };
      console.log(legalFormData)

      this.eventService
        .addLegalAttendee(
          'http://localhost:8080/api/events/addLegalAttendeeToEventId/' +
            this.eventId,
          legalFormData
        )
        .subscribe(
          (response: LegalAttendees) => {
            // Handle successful response
            console.log('Response:', response);
            this.router.navigate(['/main']);
          },
          (error) => {
            // Handli error
            console.error('Error:', error);
          }
        );
    } else {
      // Handle form validation errors
      Object.keys(this.legalForm.controls).forEach((field) => {
        const control = this.legalForm.get(field);
        if (control?.invalid) {
          control.markAsTouched({ onlySelf: true });
        }
      });
    }
  }

  shoudAddIndividual(): void {
    this.shoudAddindividualVariable = true;
    this.shoudAddLegalVariable = false;
  }

  shoudAddLegal(): void {
    this.shoudAddLegalVariable = true;
    this.shoudAddindividualVariable = false;
  }
}
