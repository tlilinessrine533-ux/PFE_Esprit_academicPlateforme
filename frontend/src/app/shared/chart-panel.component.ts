import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-panel',
  standalone: true,
  templateUrl: './chart-panel.component.html',
  styleUrl: './chart-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartPanelComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input({ required: true }) type: ChartType = 'bar';
  @Input({ required: true }) data: ChartData<ChartType> = { labels: [], datasets: [] };
  @Input() options: ChartOptions<ChartType> | null = null;
  @Input() height = 280;
  @Input() legend = true;
  @Input() emptyLabel = 'Aucune donnee disponible pour ce graphique.';
  @Input() renderWhenZero = false;

  @ViewChild('chartCanvas')
  set chartCanvas(value: ElementRef<HTMLCanvasElement> | undefined) {
    this.canvasRef = value;
    if (value) {
      this.scheduleRender();
    }
  }

  private canvasRef?: ElementRef<HTMLCanvasElement>;
  private chart: Chart | null = null;
  private themeObserver: MutationObserver | null = null;
  private pendingRenderTimeout: ReturnType<typeof setTimeout> | null = null;

  get hasRenderableData() {
    if (this.renderWhenZero) {
      return this.data.datasets.some((dataset) => Array.isArray(dataset.data) && dataset.data.length > 0);
    }

    return this.data.datasets.some((dataset) => this.datasetHasMeaningfulValues(dataset.data as Array<unknown>));
  }

  ngAfterViewInit() {
    this.observeThemeChanges();
    this.scheduleRender();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['type'] || changes['options'] || changes['legend']) {
      this.scheduleRender();
    }
  }

  ngOnDestroy() {
    this.destroyChart();
    this.themeObserver?.disconnect();
    if (this.pendingRenderTimeout) {
      clearTimeout(this.pendingRenderTimeout);
      this.pendingRenderTimeout = null;
    }
  }

  private scheduleRender() {
    if (this.pendingRenderTimeout) {
      clearTimeout(this.pendingRenderTimeout);
      this.pendingRenderTimeout = null;
    }

    this.pendingRenderTimeout = setTimeout(() => {
      this.pendingRenderTimeout = null;
      this.renderChart();
    }, 0);
  }

  private renderChart() {
    this.destroyChart();

    if (!this.canvasRef || !this.hasRenderableData) {
      return;
    }

    const baseOptions = this.buildBaseOptions();
    const config: ChartConfiguration<ChartType> = {
      type: this.type,
      data: this.data,
      options: {
        ...baseOptions,
        ...(this.options ?? {})
      }
    };

    const context = this.canvasRef.nativeElement.getContext('2d');
    if (!context) {
      return;
    }

    this.chart = new Chart(context, config);
  }

  private destroyChart() {
    if (!this.chart) {
      return;
    }

    this.chart.destroy();
    this.chart = null;
  }

  private buildBaseOptions(): ChartOptions<ChartType> {
    const isDarkMode = this.isDarkMode();
    const labelColor = isDarkMode ? 'rgba(226, 232, 240, 0.9)' : 'rgba(51, 65, 85, 0.9)';
    const gridColor = isDarkMode ? 'rgba(148, 163, 184, 0.18)' : 'rgba(148, 163, 184, 0.24)';

    const baseOptions: ChartOptions<ChartType> = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 520,
        easing: 'easeOutCubic'
      },
      plugins: {
        legend: {
          display: this.legend,
          labels: {
            color: labelColor,
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 10,
            boxHeight: 10,
            font: {
              size: 11,
              weight: 700
            }
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? 'rgba(15, 23, 42, 0.96)' : 'rgba(15, 23, 42, 0.88)',
          titleColor: '#f8fafc',
          bodyColor: '#f8fafc',
          borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.28)' : 'rgba(148, 163, 184, 0.22)',
          borderWidth: 1,
          padding: 10
        }
      }
    };

    if (this.type === 'radar') {
      return {
        ...baseOptions,
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            angleLines: {
              color: gridColor
            },
            pointLabels: {
              color: labelColor,
              font: {
                size: 11,
                weight: 700
              }
            },
            ticks: {
              color: labelColor,
              backdropColor: 'transparent',
              precision: 0
            }
          }
        }
      };
    }

    if (this.type === 'doughnut' || this.type === 'pie') {
      return baseOptions;
    }

    return {
      ...baseOptions,
      scales: {
        x: {
          ticks: {
            color: labelColor,
            font: {
              size: 11,
              weight: 700
            }
          },
          grid: {
            color: gridColor
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: labelColor,
            precision: 0,
            font: {
              size: 11,
              weight: 700
            }
          },
          grid: {
            color: gridColor
          }
        }
      }
    };
  }

  private datasetHasMeaningfulValues(values: Array<unknown>) {
    if (!Array.isArray(values) || values.length === 0) {
      return false;
    }

    return values.some((value) => {
      if (typeof value === 'number') {
        return value !== 0;
      }

      if (value != null && typeof value === 'object' && 'y' in (value as Record<string, unknown>)) {
        return Number((value as Record<string, unknown>)['y']) !== 0;
      }

      return value != null;
    });
  }

  private observeThemeChanges() {
    if (typeof MutationObserver === 'undefined') {
      return;
    }

    this.themeObserver = new MutationObserver(() => {
      this.scheduleRender();
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  private isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }
}
