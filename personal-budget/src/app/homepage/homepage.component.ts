import { AfterViewInit, Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';
import { DataService } from '../data.service';
import * as d3 from 'd3';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  dataSource =  {
    datasets: [
        {
            data: [],
            backgroundColor: [
              '#ffcd56',
              '#ff6384',
              '#36a2eb',
              '#8e2be2',
              '#ffc0cb',
              '#adff2f',
              '#ffa500',
            ]
        }
    ],
    labels: []
};

    private svg;
    private margin = 50;
    private width = 750;
    private height = 600;
    // The radius of the pie chart is half the smallest side
    private radius = Math.min(this.width, this.height) / 2 - this.margin;
    private colors;

  constructor(private http: HttpClient, public data1: DataService) {

  }
  public labels = []

  ngAfterViewInit(): void {


    this.data1.getBudget()
    .subscribe((res: any) => {
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        this.dataSource.datasets[0].data[i] = res[i].budget;
        this.dataSource.labels[i] = res[i].title;

    }

    this.createChart();
    this.createSvg();
    this.drawChart(res);


    });


  }

  // tslint:disable-next-line: typedef
  createChart() {
    const ctx = document.getElementById('myChart');
    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
}

private createSvg(): void {
  this.svg = d3.select("figure#pie")
  .append("svg")
  .attr("width", this.width)
  .attr("height", this.height)
  .append("g")
  .attr(
    "transform",
    "translate(" + this.width / 2 + "," + this.height / 2 + ")"
  );
}


private drawChart(data): void {
  for (var i = 0; i < data.length; i++) {
    this.labels[i] = data[i].title;
  }
    this.colors = d3.scaleOrdinal()
    .domain(this.labels)
    .range(["#c7d3ec", "#a5b8db", "#879cc4", "#677795", "#5a6782"]);

// Compute the position of each group on the pie:
const pie = d3.pie<any>().value((d: any) => Number(d.budget));

// Build the pie chart
this.svg
.selectAll('pieces')
.data(pie(data))
.enter()
.append('path')
.attr('d', d3.arc()
  .innerRadius(0)
  .outerRadius(this.radius)
)
.attr('fill', (d, i) => (this.colors(i)))
.attr("stroke", "#121926")
.style("stroke-width", "1px");

// Add labels
const labelLocation = d3.arc()
.innerRadius(100)
.outerRadius(this.radius);

this.svg
.selectAll('pieces')
.data(pie(data))
.enter()
.append('text')
.text(d => d.data.title)
.attr("transform", d => "translate(" + labelLocation.centroid(d) + ")")
.style("text-anchor", "middle")
.style("font-size", 15);
}


}
