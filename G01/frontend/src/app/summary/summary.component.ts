import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services'; // Import the data service
import { Chart } from 'chart.js/auto'; // Import Chart.js

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  diagnosticsData: any[] = []; // To store data fetched from the API
  errorRateChart: any; // Chart instance for error rate
  efficiencyChart: any; // Chart instance for efficiency
  successRateChart: any; // Chart instance for success rate

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    console.log('SummaryComponent initialized'); // Log to track initialization
    this.dataService.getDiagnosticsData().subscribe({
      next: (data) => {
        console.log('Diagnostics data received:', data); // Debugging log
        if (Array.isArray(data)) {
          this.diagnosticsData = data; // Store fetched data if it's an array
        } else if (data && data.data && Array.isArray(data.data)) {
          this.diagnosticsData = data.data; // Store fetched data if it's nested
        } else {
          console.error('Unexpected data format:', data); // Handle unexpected data format
          this.diagnosticsData = [];
        }

        console.log('Raw diagnostics data:', this.diagnosticsData); // Log the raw data
        this.createGraphs(); // Call method to create graphs after data is loaded
      },
      error: (err) => {
        console.error('Error fetching data:', err); // Handle errors
      }
    });
  }

  createGraphs(): void {
    if (Array.isArray(this.diagnosticsData)) {
      // Log the structure of diagnosticsData to check property names
      console.log('Checking diagnosticsData:', this.diagnosticsData);

      // Map the data with fallbacks in case of missing or incorrect values
      const months = this.diagnosticsData.map((item: any) => item.month || 'Unknown'); // Map to 'month' from your data
      const errorRates = this.diagnosticsData.map((item: any) => item.diagnostic_error_rate || 0); // Map to 'diagnostic_error_rate'
      const efficiencyRates = this.diagnosticsData.map((item: any) => item.hospital_efficiency || 0); // Map to 'hospital_efficiency'
      const successRates = this.diagnosticsData.map((item: any) => item.disease_detection_success_rate || 0); // Map to 'disease_detection_success_rate'

      console.log('Months:', months);
      console.log('Error Rates:', errorRates);
      console.log('Efficiency Rates:', efficiencyRates);
      console.log('Success Rates:', successRates);

      // Diagnostic Error Reduction Over Time
      this.errorRateChart = new Chart('errorRateChart', {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Diagnostic Error Rate (%)',
            data: errorRates,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow resizing to fit the container
          plugins: {
            title: {
              display: true,
              text: 'AI Diagnostic Error Reduction Over Time',
              font: {
                size: 18, // Font size for the title
                weight: 'bold', // Optional: Set the weight of the font
                family: 'Arial', // Optional: Set the font family
                lineHeight: 1.2, // Optional: Set line height
              },
              color: 'black', // Set the color of the title text
              padding: {
                top: 10, // Optional: Adjust the top padding for the title
                bottom: 10, // Optional: Adjust the bottom padding for the title
              }
            },
            legend: {
              labels: {
                color: 'black', // Set the color of the legend labels
                font: {
                  size: 16, // Increase the font size for legend labels
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'black', // Set the color of the x-axis labels
                font: {
                  size: 14, // Increase font size for x-axis labels
                  weight: 'bold', // Optional: Make the font bold
                }
              },
              title: {
                display: true,
                text: 'Months', // X-axis label
                color: 'black',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            y: {
              ticks: {
                color: 'black', // Set the color of the y-axis labels
                font: {
                  size: 14, // Increase font size for y-axis labels
                  weight: 'bold', // Optional: Make the font bold
                }
              },
              title: {
                display: true,
                text: 'Error Rate (%)', // Y-axis label
                color: 'black',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        }
      });

      // AI Impact on Hospital Efficiency
      this.efficiencyChart = new Chart('efficiencyChart', {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Hospital Efficiency (%)',
            data: efficiencyRates,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow resizing to fit the container
          plugins: {
            title: {
              display: true,
              text: 'AI Impact on Hospital Efficiency',
              font: {
                size: 18, // Font size for the title
                weight: 'bold', // Optional: Set the weight of the font
                family: 'Arial', // Optional: Set the font family
                lineHeight: 1.2, // Optional: Set line height
              },
              color: 'black', // Set the color of the title text
              padding: {
                top: 10, // Optional: Adjust the top padding for the title
                bottom: 10, // Optional: Adjust the bottom padding for the title
              }
            },
            legend: {
              labels: {
                color: 'black', // Set the color of the legend labels
                font: {
                  size: 16, // Increase the font size for legend labels
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'black', // Set the color of the x-axis labels
                font: {
                  size: 14, // Increase font size for x-axis labels
                  weight: 'bold', // Optional: Make the font bold
                }
              },
              title: {
                display: true,
                text: 'Months', // X-axis label
                color: 'black',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            y: {
              ticks: {
                color: 'black', // Set the color of the y-axis labels
                font: {
                  size: 14, // Increase font size for y-axis labels
                  weight: 'bold', // Optional: Make the font bold
                }
              },
              title: {
                display: true,
                text: 'Efficiency (%)', // Y-axis label
                color: 'black',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        }
      });

      // AI Success in Disease Detection
      this.successRateChart = new Chart('successRateChart', {
        type: 'line',
        data: {
          labels: months,
          datasets: [{
            label: 'Disease Detection Success Rate (%)',
            data: successRates,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow resizing to fit the container
          plugins: {
            title: {
              display: true,
              text: 'AI Success in Disease Detection',
              font: {
                size: 18, // Font size for the title
                weight: 'bold', // Optional: Set the weight of the font
                family: 'Arial', // Optional: Set the font family
                lineHeight: 1.2, // Optional: Set line height
              },
              color: 'black', // Set the color of the title text
              padding: {
                top: 10, // Optional: Adjust the top padding for the title
                bottom: 10, // Optional: Adjust the bottom padding for the title
              }
            },
            legend: {
              labels: {
                color: 'black', // Set the color of the legend labels
                font: {
                  size: 16, // Increase the font size for legend labels
                }
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: 'black', // Set the color of the x-axis labels
                font: {
                  size: 14, // Increase font size for x-axis labels
                  weight: 'bold', // Optional: Make the font bold
                }
              },
              title: {
                display: true,
                text: 'Months', // X-axis label
                color: 'black',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            },
            y: {
              ticks: {
                color: 'black', // Set the color of the y-axis labels
                font: {
                  size: 14, // Increase font size for y-axis labels
                  weight: 'bold', // Optional: Make the font bold
                }
              },
              title: {
                display: true,
                text: 'Success Rate (%)', // Y-axis label
                color: 'black',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              }
            }
          }
        }
      });
    } else {
      console.error('Data is not an array:', this.diagnosticsData);
    }
  }
}
