import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.css'],
  imports: [CommonModule]
})
export class WidgetsComponent {
  items: string[] = [
    'https://t4.ftcdn.net/jpg/05/69/49/63/240_F_569496344_tEf2nCw2bTBV0daUd2sWvRxSzga2diiX.jpg',
    'https://t4.ftcdn.net/jpg/02/67/56/03/240_F_267560350_CQ4RBi4gFXll7ppl7srUnWqXUq14KoGM.jpg',
    'https://t3.ftcdn.net/jpg/07/55/28/76/240_F_755287628_PGerIoOomg01OyR8mesg91vNPB08wtnW.jpg',
  ];
  currentIndex: number = 1; // Start at the first real slide (index 1)
  transition: string = 'transform 0.5s ease-in-out';
  isMobileView: boolean = false;

  private touchStartX: number = 0;
  private touchEndX: number = 0;

  constructor() {
    this.updateViewMode();
  }

  @HostListener('window:resize', [])
  updateViewMode(): void {
    this.isMobileView = window.innerWidth <= 768; // Adjust threshold for mobile view
  }

  get translateX(): number {
    return -this.currentIndex * 100;
  }

  nextSlide(): void {
    this.transition = 'transform 0.5s ease-in-out';
    this.currentIndex++;

    if (this.currentIndex === this.items.length + 1) {
      // After the transition, jump to the first real slide
      setTimeout(() => {
        this.transition = 'none';
        this.currentIndex = 1;
      }, 500); // Match the transition duration
    }
  }

  prevSlide(): void {
    this.transition = 'transform 0.5s ease-in-out';
    this.currentIndex--;

    if (this.currentIndex === 0) {
      // After the transition, jump to the last real slide
      setTimeout(() => {
        this.transition = 'none';
        this.currentIndex = this.items.length;
      }, 500); // Match the transition duration
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
  }

  onTouchEnd(): void {
    const deltaX = this.touchStartX - this.touchEndX;
    const threshold = 50; // Minimum swipe distance to trigger slide

    if (deltaX > threshold) {
      // Swipe left
      this.nextSlide();
    } else if (deltaX < -threshold) {
      // Swipe right
      this.prevSlide();
    }

    // Reset touch positions
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  getCurrentSlideIndex(): number {
    // Map the currentIndex to the original items array
    if (this.currentIndex === 0) return this.items.length - 1;
    if (this.currentIndex === this.items.length + 1) return 0;
    return this.currentIndex - 1;
  }
}
