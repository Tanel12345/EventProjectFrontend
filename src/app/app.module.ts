import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';


import { AddEventComponent } from './components/pagesComponents/addEventComponent/add-event.component';
import { AddAttendeeComponent } from './components/pagesComponents/addAttendeeComponent/add-attendee.component';
import { UpdateAttendeeComponent } from './components/pagesComponents/updateAttendeeComponent/update-attendee.component';
import { EventAttendeesComponent } from './components/pagesComponents/eventAttendeesComponent/event-attendees.component';
import { HeaderComponent } from './components/sharedComponents/header/header.component';
import { FooterComponent } from './components/sharedComponents/footer/footer.component';
import { HomeComponent } from './components/pagesComponents/homeComponent/home.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventAttendeesComponent,
    AddEventComponent,
    AddAttendeeComponent,
    UpdateAttendeeComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
