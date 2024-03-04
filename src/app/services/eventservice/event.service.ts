import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }



  getEvents(url:string): Observable<EventDto[]> {
    return this.http.get<EventDto[]>(url);
  }

  getEvent(url:string): Observable<EventWithAttendeesDto[]> {
    return this.http.get<EventWithAttendeesDto[]>(url);
  }
  deleteIndividualAttendee(url:string): Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(url)
  }
  deleteLegalAttendee(url:string): Observable<ApiResponse>{
    return this.http.delete<ApiResponse>(url)
  }

  addIndividualAttendee(url:string, attendee: object): Observable<IndividualAttendees> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Lisa headerid kui on soovi
    });
  
    return this.http.post<IndividualAttendees>(url, attendee, { headers });
  }


  addLegalAttendee(url:string, attendee: object): Observable<LegalAttendees> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Lisa headerid kui on soovi
    });
    return this.http.post<LegalAttendees>(url, attendee, { headers });
  }
}

export interface ApiResponse{
  message: string;
}
  export interface EventDto {
    id: number;
    name: string;
    date: string; // Using ISO 8601 format for date and time
    locationAddress: LocationAddress;
    attendeesCount: number;
    // Add other properties as needed
  }
  export interface LocationAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    // Add other properties as needed
  }
  export interface EventWithAttendeesDto {
    id: number;
    name: string;
    date: string; // Using ISO 8601 format for date and time
    locationAddress: LocationAddress;
   individualAttendees: IndividualAttendees;
   legalAttendees: LegalAttendees;
    
  }

 export interface IndividualAttendees {
  id: number;
  firstName: string;
  lastName: string;
  personalCode: string;
  paymentMethod: string;
  additionalInfo: string;

 }
 export interface LegalAttendees {
  id: number;
  companyName: string;
  registrationCode: string;
  numberOfParticipant: string;
  paymentMethod: string;
  additionalInfo: string;


 }
