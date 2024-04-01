import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pagesComponents/homeComponent/home.component';
import { AddEventComponent } from './components/pagesComponents/addEventComponent/add-event.component';
import { AddAttendeeComponent } from './components/pagesComponents/addAttendeeComponent/add-attendee.component';
import { UpdateAttendeeComponent } from './components/pagesComponents/updateAttendeeComponent/update-attendee.component';
import { EventAttendeesComponent } from './components/pagesComponents/eventAttendeesComponent/event-attendees.component';
import { NotFoundComponentComponent } from './components/exception/not-found-component/not-found-component.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'addEvent', component: AddEventComponent},
  {path: 'addAttendee', component: AddAttendeeComponent},
  {path: 'updateAttendee', component: UpdateAttendeeComponent},
  {path: 'eventAttendees', component: EventAttendeesComponent}, 


  {path: '404', component: NotFoundComponentComponent},
  
  {path: '**', redirectTo: '404'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
