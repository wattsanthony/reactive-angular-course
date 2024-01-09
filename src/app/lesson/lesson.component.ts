import { Component, OnInit } from '@angular/core';
import { Lesson } from '../model/lesson';
import { Input } from '@angular/core';

@Component({
  selector: 'lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent  {

  @Input()
  lesson:Lesson;
}
