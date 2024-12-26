import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FloaterComponent } from './components/floater/floater.component';
import { BannerComponent } from './components/banner/banner.component';
import { VerifyAccountService } from './utils/verify-account.service';
import { VerifyUserService } from './utils/verify-user.service';
import { TrackScreenService } from './utils/track-screen.service';
import { TrackUserActionService } from './utils/track-user-action.service';
import { AppStorysService } from './utils/app-storys.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FloaterComponent,
    BannerComponent,
  ],
  providers: [
    VerifyAccountService,
    VerifyUserService,
    TrackScreenService,
    TrackUserActionService,
    AppStorysService,
    // Add other services here
  ],
  exports: [
    FloaterComponent,
    BannerComponent,
    // Add other components to be exposed
  ],
})
export class AppStorysSdkModule { }
