import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil, debounceTime } from 'rxjs';
import { data } from './app.data';
import { buildArrayFilterCallback } from './array-filter-adaptee';
import { CmAutocompleteComponent } from './cm-autocomplete/cm-autocomplete.component';
import { CmStateService } from './cm-autocomplete/cm-state.service';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, RouterModule, CmAutocompleteComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnDestroy {
  destroy$ = new Subject();

  datasource = data(10);
  filteredDatasource: Array<any> = [];
  cmID = `cm-editor-${new Date().getTime()}`;
  mappingFields = {
    'Task ID': 'TaskID',
    TaskID: 'TaskID',
    Engineer: 'Engineer',
    Designation: 'Designation',
    Status: 'Status',
  };
  autocompletionOptions = [
    { label: 'Task ID', type: 'keyword', apply: '%Task ID%', detail: 'Field' },
    {
      label: 'Engineer',
      type: 'keyword',
      apply: '%Engineer%',
      detail: 'Field',
    },
    {
      label: 'Designation',
      type: 'keyword',
      apply: '%Designation%',
      detail: 'Field',
    },
    { label: 'Status', type: 'keyword', apply: '%Status%', detail: 'Field' },
    { label: 'AND', type: 'keyword', apply: 'AND', detail: 'Expression' },
    { label: 'OR', type: 'keyword', apply: 'OR', detail: 'Expression' },
    { label: 'EQ', type: 'keyword', apply: 'EQ', detail: 'Operator' },
    { label: 'GT', type: 'keyword', apply: 'GT', detail: 'Operator' },
    { label: 'LT', type: 'keyword', apply: 'LT', detail: 'Operator' },
    { label: 'GE', type: 'keyword', apply: 'GE', detail: 'Operator' },
    { label: 'LE', type: 'keyword', apply: 'LE', detail: 'Operator' },
    {
      label: 'STARTSWITH',
      type: 'keyword',
      apply: 'STARTSWITH',
      detail: 'Operator',
    },
    {
      label: 'ENDSWITH',
      type: 'keyword',
      apply: 'ENDSWITH',
      detail: 'Operator',
    },
    {
      label: 'HAS',
      type: 'keyword',
      apply: 'HAS',
      detail: 'Operator',
    },
    {
      label: 'NOT',
      type: 'keyword',
      apply: 'NOT',
      detail: 'Operator',
    },
  ];

  constructor(private __cmState: CmStateService) {
    this.filteredDatasource = this.datasource;
  }

  onReady() {
    this.__cmState.values[this.cmID]
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe({
        next: (value: string) => {
          if (value) {
            this.filteredDatasource = this.datasource.filter((item) =>
              buildArrayFilterCallback(value, item, this.mappingFields)()
            );
          } else {
            this.filteredDatasource = this.datasource;
          }
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
