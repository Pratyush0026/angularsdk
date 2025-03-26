// reel-full-screen.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.currentIndex = this.startIndex;
  }
}