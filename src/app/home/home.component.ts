import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // Hold observable course lists
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  // Constructor with service inject
  constructor(private coursesService: CoursesService) {

  }

  // Initialisation
  ngOnInit() {

      // Variable holding courses returned - $ on name means observable
      const courses$ = this.coursesService.loadAllCourses().pipe(
        // Pipe to map
        map(
          // Sort using the sort courses by seq no filter function
          courses => courses.sort(sortCoursesBySeqNo))
      );

      // Derive courses into the beginner and advanced courses
      this.beginnerCourses$ = courses$.pipe(
        // Pipe to map
        map(
          courses => courses.filter(
            // Filter by beginner category
            course => course.category === "BEGINNER"
        ))
      );

      this.advancedCourses$ = courses$.pipe(
        // Pipe to map
        map(
          courses => courses.filter(
            // Filter by beginner category
            course => course.category === "ADVANCED"
        ))
      );
  }
}




