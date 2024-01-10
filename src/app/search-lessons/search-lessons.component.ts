import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectionStrategy} from '@angular/core';
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
  concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './search-lessons.component.html',
  styleUrls: ['./search-lessons.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Only update when pushed
})
export class SearchLessonsComponent {

  // Observable for lesson search results
  searchResults$: Observable<Lesson[]>;

  // Holds active lesson
  activeLesson:Lesson;

  // Constructor
  constructor(private coursesService:CoursesService) {


  }

  // Search function
  onSearch(search:string){
      // Save search results from search lessons using search
      this.searchResults$ = this.coursesService.searchLessons(search);
  }

  // Handles opening lessons
  openLesson(lesson:Lesson){
      // Set to active lesson
      this.activeLesson = lesson;
  }

  // Returns back to search
  onBackToSearch(){
      // Clear active lesson
      this.activeLesson = null;
  }

}











