import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';

interface CourseData{
  course: Course;
  lessons: Lesson[];
}

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent {

  // Observable
  data$: Observable<CourseData>;

  // Constructor
  constructor(private route: ActivatedRoute,
    private coursesService: CoursesService) {


  }

  // Initialization
  ngOnInit(){

    // Get URL param courseId
    const courseId = parseInt(this.route.snapshot.paramMap.get("courseId"));

    // Get course for that Id
    const course$ = this.coursesService.loadCoursesById(courseId)
    .pipe(
      // Emit initial value to ensure combine latest emits right away
      startWith(null)
    );

    // Get all lessons for that Id
    const lessons$ = this.coursesService.loadAllCourseLessons(courseId)
    .pipe(
      // Emit initial value to ensure combine latest emits right away
      startWith(null)
    );;

    // Combine observables and map to data observable as CourseData
    this.data$ = combineLatest([course$, lessons$])
    .pipe(
      map(
        ([course, lessons]) => {
          return {
            course,
            lessons
          }
        }
      ),
      tap(console.log));
  }
}











