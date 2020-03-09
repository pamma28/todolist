import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatTabsModule],
  exports: [MatButtonModule, MatInputModule, MatFormFieldModule, MatTabsModule],
})
export class MaterialModule {}
