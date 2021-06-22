import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarLunar } from '../common/calendar-lunar';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private app: string;
  constructor(private httpClient: HttpClient) { }
  showCalendarLunar(dd: number, mm: number, yy: number): string {
    let lich = new Array();
    lich = this.tinhlicham(dd, mm, yy);
    this.app = lich[0] + '/' + lich[1] + '/' + lich[2] + '/' + lich[3];
    return this.app;
  }
  tinhlicham(dd: number, mm: number, yy: number) {
    // tslint:disable-next-line:prefer-const
    let lich = new Array();
    const timeZone = 7;
    let calendarLunar = new Array();
    calendarLunar = this.convertSolar2Lunar(dd, mm, yy, timeZone);
    console.log(calendarLunar);
    return calendarLunar;
  }
  INT(d: number) {
    return Math.floor(d);
  }
   jdFromDate(dd, mm, yy) {
    const PI = Math.PI;
    // tslint:disable-next-line:one-variable-per-declaration
    let a: number, y: number, m: number, jd: number;
    a = this.INT((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd = dd + this.INT((153 * m + 2) / 5) + 365 * y + this.INT (y / 4) - this.INT( y / 100) + this.INT( y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + this.INT((153 * m + 2)  / 5) + 365  * y + this.INT(y / 4) - 32083;
    }
    return jd;
  }
  
  
   jdToDate(jd) {
    const PI = Math.PI;
    // tslint:disable-next-line:one-variable-per-declaration
    let a: number, b: number, c: number, d: number, e: number, m: number, day: number, month: number, year: number;
    if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
      a = jd + 32044;
      b = this.INT((4 * a + 3)  / 146097);
      c = a - this.INT((b * 146097) / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    d = this.INT((4 * c + 3 ) / 1461);
    e = c - this.INT((1461 * d ) / 4);
    m = this.INT((5 * e + 2 ) / 153);
    day = e - this.INT((153 * m + 2 ) / 5 ) + 1;
    month = m + 3 - 12 * this.INT (m / 10);
    year = b * 100 + d - 4800 + this.INT(m / 10);
    return new Array(day, month, year);
  }
  
  
   NewMoon(k) {
    const PI = Math.PI;
    // tslint:disable-next-line:one-variable-per-declaration
    let T: number, T2: number, T3: number, dr: number, Jd1: number;
    // tslint:disable-next-line:one-variable-per-declaration
    let M: number, Mpr: number, F: number, C1: number, delta: number, JdNew: number;
    T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = PI / 180;
    Jd1 = 2415020.75933 + 29.53058868*k + 0.0001178*T2 - 0.000000155*T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87*T - 0.009173*T2)*dr); // Mean new moon
    M = 359.2242 + 29.10535608*k - 0.0000333*T2 - 0.00000347*T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806*k + 0.0107306*T2 + 0.00001236*T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646*k - 0.0016528*T2 - 0.00000239*T3; // Moon's argument of latitude
    C1 = (0.1734 - 0.000393*T)*Math.sin(M*dr) + 0.0021*Math.sin(2*dr*M);
    C1 = C1 - 0.4068*Math.sin(Mpr*dr) + 0.0161*Math.sin(dr*2*Mpr);
    C1 = C1 - 0.0004*Math.sin(dr*3*Mpr);
    C1 = C1 + 0.0104*Math.sin(dr*2*F) - 0.0051*Math.sin(dr*(M+Mpr));
    C1 = C1 - 0.0074*Math.sin(dr*(M-Mpr)) + 0.0004*Math.sin(dr*(2*F+M));
    C1 = C1 - 0.0004*Math.sin(dr*(2*F-M)) - 0.0006*Math.sin(dr*(2*F+Mpr));
    C1 = C1 + 0.0010*Math.sin(dr*(2*F-Mpr)) + 0.0005*Math.sin(dr*(2*Mpr+M));
    if (T < -11) {
      delta = 0.001 + 0.000839 * T  + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      delta = -0.000278 + 0.000265 * T  + 0.000262 * T2;
    }
    JdNew = Jd1 + C1 - delta;
    return JdNew;
  }
  
  
   SunLongitude(jdn) {
    const PI = Math.PI;
    // tslint:disable-next-line:typedef-whitespace
    // tslint:disable-next-line:one-variable-per-declaration
    let T: number, T2: number, dr: number, M: number, L0: number, DL: number, L: number;
    T = (jdn - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T*T;
    dr = PI  / 180; // degree to radian
    M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
    DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
    DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
    L = L0 + DL; // true longitude, degree
    L = L*dr;
    L = L - PI * 2 * (this.INT(L / (PI * 2))); // Normalize to (0, 2*PI)
    return L;
  }
  
  
   getSunLongitude(dayNumber, timeZone) {
    const PI = Math.PI;
    return this.INT(this.SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
  }
  
  
   getNewMoonDay(k, timeZone) {
    const PI = Math.PI;
    return this.INT(this.NewMoon(k) + 0.5 + timeZone / 24);
  }
  
  
   getLunarMonth11(yy, timeZone) {
    const PI = Math.PI;
    // tslint:disable-next-line:one-variable-per-declaration
    let k: number, off: number, nm: number, sunLong: number;
    //off = jdFromDate(31, 12, yy) - 2415021.076998695;
    off = this.jdFromDate(31, 12, yy) - 2415021;
    k = this.INT(off / 29.530588853);
    nm = this.getNewMoonDay(k, timeZone);
    sunLong = this.getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
      nm = this.getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }
  
  
   getLeapMonthOffset(a11, timeZone) {
    const PI = Math.PI;
    // tslint:disable-next-line:one-variable-per-declaration
    let k: number, last: number, arc: number, i: number;
    k = this.INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = this.getSunLongitude(this.getNewMoonDay(k+i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = this.getSunLongitude(this.getNewMoonDay(k+i, timeZone), timeZone);
    } while (arc !== last && i < 14);
    return i - 1;
  }
  
  
   convertSolar2Lunar(dd, mm, yy, timeZone) {
    const PI = Math.PI;
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:one-variable-per-declaration
    let k: number, dayNumber: number, monthStart: number, a11: number;
    // tslint:disable-next-line:one-variable-per-declaration
    let b11: number, lunarDay: number, lunarMonth: number, lunarYear: number, lunarLeap: number;
    dayNumber = this.jdFromDate(dd, mm, yy);
    k = this.INT((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = this.getNewMoonDay(k+1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = this.getNewMoonDay(k, timeZone);
    }
    //alert(dayNumber+" -> "+monthStart);
    a11 = this.getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = this.getLunarMonth11(yy-1, timeZone);
    } else {
      lunarYear = yy+1;
      b11 = this.getLunarMonth11(yy+1, timeZone);
    }
    lunarDay = dayNumber - monthStart + 1;
    const diff = this.INT((monthStart - a11) / 29);
    lunarLeap = 0;
    lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      const leapMonthDiff = this.getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff === leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
  }
  
  
   convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
    const PI = Math.PI;
    // tslint:disable-next-line:one-variable-per-declaration
    let k: number, a11: number, b11: number, off: number, leapOff: number, leapMonth: number, monthStart: number;
    if (lunarMonth < 11) {
      a11 = this.getLunarMonth11(lunarYear-1, timeZone);
      b11 = this.getLunarMonth11(lunarYear, timeZone);
    } else {
      a11 = this.getLunarMonth11(lunarYear, timeZone);
      b11 = this.getLunarMonth11(lunarYear+1, timeZone);
    }
    k = this.INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    off = lunarMonth - 11;
    if (off < 0) {
      off += 12;
    }
    if (b11 - a11 > 365) {
      leapOff = this.getLeapMonthOffset(a11, timeZone);
      leapMonth = leapOff - 2;
      if (leapMonth < 0) {
        leapMonth += 12;
      }
      if (lunarLeap !== 0 && lunarMonth !== leapMonth) {
        return new Array(0, 0, 0);
      } else if (lunarLeap !== 0 || off >= leapOff) {
        off += 1;
      }
    }
    monthStart = this.getNewMoonDay(k + off, timeZone);
    return this.jdToDate(monthStart + lunarDay - 1);
  }

}
