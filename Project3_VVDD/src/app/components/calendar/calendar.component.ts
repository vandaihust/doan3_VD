
import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarLunar: string;
  constructor(private calendarService: CalendarService) { }

  ngOnInit(): void {
    this.calendarLunar = this.handleCalendarLunar();
  }
  handleCalendarLunar(): string {
    const adu: string = this.calendarService.showCalendarLunar(11, 3, 1999);
    return adu;
  }
}
