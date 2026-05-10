import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../../services/teacher';
import { Teacher, TeacherAssignment } from '../../../models/teacher.model';

@Component({
  selector: 'app-teacher-assign',
  standalone: false,
  templateUrl: './teacher-assign.html',
  styleUrls: ['./teacher-assign.css']
})
export class TeacherAssignComponent implements OnInit {
  teachers: Teacher[] = [];
  selectedTeacherId = '';
  selectedTeacher: Teacher | undefined;
  assignments: TeacherAssignment[] = [];
  isLoading = false;

  subjects = ['math', 'english', 'science', 'history', 'geography', 'technology'];
  grades = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5', 'grade-6', 'grade-7', 'grade-8', 'grade-9', 'grade-10', 'grade-11', 'grade-12'];

  newGradeId = '';
  newSubjectId = '';

  constructor(
    private readonly teacherService: TeacherService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.teacherService.getAll().subscribe(teachers => {
      this.teachers = teachers;
    });
  }

  onTeacherSelect(): void {
    this.selectedTeacher = this.teachers.find(t => t.id === this.selectedTeacherId);
    this.assignments = this.selectedTeacher ? [...this.selectedTeacher.assignments] : [];
  }

  addAssignment(): void {
    if (this.newGradeId && this.newSubjectId) {
      const exists = this.assignments.some(a => a.gradeId === this.newGradeId && a.subjectId === this.newSubjectId);
      if (!exists) {
        this.assignments.push({ gradeId: this.newGradeId, subjectId: this.newSubjectId });
      }
      this.newGradeId = '';
      this.newSubjectId = '';
    }
  }

  removeAssignment(index: number): void {
    this.assignments.splice(index, 1);
  }

  saveAssignments(): void {
    if (this.selectedTeacherId) {
      this.isLoading = true;
      this.teacherService.assignSubjects(this.selectedTeacherId, this.assignments).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/app/teachers']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/teachers']);
  }
}
