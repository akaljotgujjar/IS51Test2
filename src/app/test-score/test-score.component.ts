import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastService } from '../toast/toast.service';

export interface ITestScore {
  id?: number;
  testName: string;
  pointsPoss: number;
  pointsRec: number;
  percent: number;
  grade: string;
}

@Component({
  selector: 'app-test-score',
  templateUrl: './test-score.component.html',
  styleUrls: ['./test-score.component.css']
})
export class TestScoreComponent implements OnInit {

  tests: Array<ITestScore> = [];
  params: string;
  testName: any;
  constructor(
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    this.tests = await this.loadContacts();
  }

  async loadContacts() {
    let tests = JSON.parse(localStorage.getItem('test'));
    if (tests && tests.length > 0) {
    } else {
      tests = await this.loadTestsFromJson();
    }
    this.tests = tests;
    return tests;
  }

  async loadTestsFromJson() {
    const tests = await this.http.get('assets/tests.json').toPromise();
    return tests.json();

  }

  addTest() {
    const test: ITestScore = {
      testName: null,
      pointsPoss: null,
      pointsRec: null,
      percent: null,
      grade: null
    };
    this.tests.unshift(test);
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem('test', JSON.stringify(this.tests));
    // this.toastService.showToast('success', 2000, 'Success! Items Saved!');
    console.log('save....', this.saveToLocalStorage());

  }

  delete(index: number) {
    this.tests.splice(index, 1);
    this.saveToLocalStorage();
  }

  search(params: string) {
    // console.log('from search....params', params);
    this.tests = this.tests.filter((tests: ITestScore) => {
      return this.testName.toLowerCase() === params.toLowerCase();
    });
  }

  computeGrades() {
    console.log('from finalize().....');
    const data = this.calculate();
    localStorage.setItem('calculatedData', JSON.stringify(data));
    this.router.navigate(['home', data]);
  }

  calculate() {
    let percent = 0;
    for (let i = 0; i < this.tests.length; i++) {
      percent += this.tests[i].percent;
    }
    return {
      numberOfGrades: this.tests.length,
      pointsPoss: percent,
      precent: percent * .10,
      grade: percent + (percent * .10)
    };
  }







}
