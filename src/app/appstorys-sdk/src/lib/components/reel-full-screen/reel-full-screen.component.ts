// reel-full-screen.component.ts
import { Component, Input, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReelsDetails } from '../reels/reels.component';

@Component({
  selector: 'app-reel-full-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reel-full-screen.component.html',
  styleUrls: ['./reel-full-screen.component.css']
})
export class ReelFullScreenComponent implements OnInit {
  @Input() reelsDetails!: ReelsDetails;
  @Input() startIndex = 0;
  @Output() close = new EventEmitter<void>();

  currentIndex = 0;
  
  // Touch handling for swipe
  private touchStartY: number = 0;
  private touchEndY: number = 0;
  private swipeThreshold = 50;

  ngOnInit() {
    this.currentIndex = this.startIndex;
  }
  
  navigateUp() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  
  navigateDown() {
    if (this.currentIndex < this.reelsDetails.reels.length - 1) {
      this.currentIndex++;
    }
  }
  
  // Touch event handlers for vertical swipe
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleVerticalSwipe();
  }

  private handleVerticalSwipe() {
    const swipeDistance = this.touchEndY - this.touchStartY;
    
    if (Math.abs(swipeDistance) > this.swipeThreshold) {
      if (swipeDistance > 0) {
        // Swiped down
        this.navigateUp();
      } else {
        // Swiped up
        this.navigateDown();
      }
    }
  }
}