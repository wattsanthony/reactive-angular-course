import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';

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
  constructor(
    private coursesService: CoursesService, 
    private loadingService:LoadingService,
    private messagesService:MessagesService) {

  }

  // Initialisation
  ngOnInit() {
    // Load courses
    this.reloadCourses();
  }

  // Function to reload courses
  reloadCourses(){

    // Variable holding courses returned - $ on name means observable
    const courses$ = this.coursesService.loadAllCourses().pipe(
      // Pipe to map
      map(
        // Sort using the sort courses by seq no filter function
        courses => courses.sort(sortCoursesBySeqNo)
        ),
        // Catch errors handling
        catchError(
          // Error observable
          err => {
            // Send message to messages service
            const message = "Could not load courses.";
            this.messagesService.showErrors(message);

            // Log error and throwError to end observable chain
            console.log(message, err);
            return throwError(err);
        })
    );

    // Send observable to loading service to monitor
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$);

    // Derive loadCourses$ into the beginner and advanced courses
    this.beginnerCourses$ = loadCourses$.pipe(
      // Pipe to map
      map(
        courses => courses.filter(
          // Filter by beginner category
          course => course.category === "BEGINNER"
      ))
    );

    this.advancedCourses$ = loadCourses$.pipe(
      // Pipe to map
      map(
        courses => courses.filter(
          // Filter by beginner category
          course => course.category === "ADVANCED"
      ))
    );
  }
}




