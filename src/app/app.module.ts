import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HomeComponent } from './components/pagesComponents/homeComponent/home.component';
import { EventAttendeesComponent } from './components/pagesComponents/event-attendees/event-attendees.component';
import { AddEventComponent } from './components/pagesComponents/addEventComponent/add-event.component';
import { AddAttendeeComponent } from './components/pagesComponents/addAttendeeComponent/add-attendee.component';
import { UpdateAttendeeComponent } from './components/pagesComponents/updateAttendeeComponent/update-attendee.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventAttendeesComponent,
    AddEventComponent,
    AddAttendeeComponent,
    UpdateAttendeeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
