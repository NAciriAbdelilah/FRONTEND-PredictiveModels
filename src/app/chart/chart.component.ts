import { Component, OnInit } from '@angular/core';
import { OutputModelService } from '../services/output-model.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {


  constructor(private outputModelService: OutputModelService) {}

  ngOnInit(): void {


  }
}
