import {Component, OnInit} from '@angular/core';
import {Course, sortCoursesBySeqNo} from '../model/course';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import {catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap} from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';

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
    private coursesStore: CoursesStore) {

  }

  // Initialisation
  ngOnInit() {
    // Load courses
    this.reloadCourses();
  }

  // Function to reload courses
  reloadCourses(){

    // Call courses store for required categories
    this.beginnerCourses$ = this.coursesStore.filterByCategory("BEGINNER");

    this.advancedCourses$ = this.coursesStore.filterByCategory("ADVANCED");
  }
}




