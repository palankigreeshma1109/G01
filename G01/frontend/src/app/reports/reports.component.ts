import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services'; // Import the data service
import { Chart } from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  reportsData: any[] = []; // To store data fetched from the API
  aiAdoptionBarChart: any; // Chart instance for Bar Chart
  aiAdoptionPieChart: any; // Chart instance for Pie Chart

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    console.log('ReportsComponent initialized'); // Debugging log
    this.dataService.getAIAdoptionData().subscribe({
      next: (data) => {
        console.log('Reports data received:', data); // Debugging log
        if (Array.isArray(data)) {
          this.reportsData = data; // Store fetched data if it's an array
        } else if (data && data.data && Array.isArray(data.data)) {
          this.reportsData = data.data; // Handle nested data format
        } else {
          console.error('Unexpected data format:', data); // Handle unexpected data
          this.reportsData = [];
        }

        console.log('Raw reports data:', this.reportsData); // Log the raw data
        this.createGraphs(); // Call method to create graphs after data is loaded
      },
      error: (err) => {
        console.error('Error fetching reports data:', err); // Handle errors
      }
    });
  }

  createGraphs(): void {
    if (Array.isArray(this.reportsData)) {
      // Log the structure of diagnosticsData to check property names
      console.log('Checking diagnosticsData:', this.reportsData);

      // Map the data to the chart structure
      const healthcareDomains = this.reportsData.map((item: any) => item.healthcare_domain || 'Unknown');
      const aiAdoptionPercentages = this.reportsData.map((item: any) => item.ai_adoption_percentage || 0);

      console.log('Healthcare Domains:', healthcareDomains);
      console.log('AI Adoption Percentages:', aiAdoptionPercentages);

      // Plot Bar Chart for AI Adoption
      this.aiAdoptionBarChart = new Chart('aiAdoptionBarChart', {
        type: 'bar',
        data: {
          labels: healthcareDomains,
          datasets: [{
            label: 'Percentage of AI Adoption (%)',
            data: aiAdoptionPercentages,
            backgroundColor: 'rgba(135, 206, 235, 0.7)', // Sky blue color
            borderColor: 'rgba(135, 206, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow resizing to fit the container
          plugins: {
            title: {
              display: true,
              text: 'AI Applications in Healthcare Domains',
              color: 'black', // Title color set to black
              font: {
                size: 20, // Set font size for the title
                weight: 'bold', // Set font weight to bold
                family: 'Arial', // Set font family to Arial
              },
              padding: {
                top: 10,
                bottom: 10,
              }
            },
            legend: {
              labels: {
                color: 'black', // Set label color in the legend to black
                font: {
                  size: 14, // Set font size for labels
                  family: 'Arial',
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Healthcare Domain', // x-axis title text
                color: 'black', // Set x-axis label color to black
                font: {
                  size: 16, // Font size for x-axis label
                  weight: 'bold',
                }
              },
              ticks: {
                color: 'black' // Set tick label color to black
              }
            },
            y: {
              title: {
                display: true,
                text: 'Percentage of AI Adoption (%)', // y-axis title text
                color: 'black', // Set y-axis label color to black
                font: {
                  size: 16, // Font size for y-axis label
                  weight: 'bold',
                }
              },
              ticks: {
                color: 'black' // Set tick label color to black
              }
            }
          }
        }
      });

      // Plot Pie Chart for AI Adoption Distribution
      this.aiAdoptionPieChart = new Chart('aiAdoptionPieChart', {
        type: 'pie',
        data: {
          labels: healthcareDomains,
          datasets: [{
            label: 'AI Adoption Distribution',
            data: aiAdoptionPercentages,
            backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0'], // Custom colors
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow resizing
          plugins: {
            title: {
              display: true,
              text: 'Distribution of AI Applications in Healthcare',
              color: 'black', // Set title color to black
              font: {
                size: 20, // Font size for pie chart title
                weight: 'bold', // Font weight for title
                family: 'Arial', // Font family for title
              }
            },
            legend: {
              labels: {
                color: 'black', // Set label color in the legend to black
                font: {
                  size: 14, // Font size for labels in legend
                  family: 'Arial',
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem: any) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                }
              }
            }
          }
        }
      });
    } else {
      console.error('Reports data is not an array:', this.reportsData);
    }
  }
}
