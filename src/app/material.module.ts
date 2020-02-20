import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [MatButtonModule, MatGridListModule, MatMenuModule],
  exports: [MatButtonModule, MatGridListModule, MatMenuModule],
})
export class MaterialModule {}
