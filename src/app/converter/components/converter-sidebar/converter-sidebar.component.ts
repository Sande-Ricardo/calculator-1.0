import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MagnitudeDefinition, FavoriteConversion } from '../../models/converter.model';

@Component({
  selector: 'app-converter-sidebar',
  templateUrl: './converter-sidebar.component.html',
  styleUrls: ['./converter-sidebar.component.scss']
})
export class ConverterSidebarComponent {
  @Input() magnitude!: MagnitudeDefinition;
  @Input() isOpen: boolean = true;
  @Input() activeTab: 'dimensional' | 'constants' | 'prefixes' | 'favorites' = 'dimensional';

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() activeTabChange = new EventEmitter<'dimensional' | 'constants' | 'prefixes' | 'favorites'>();
  @Output() injectConstant = new EventEmitter<number>();
  @Output() applyFavorite = new EventEmitter<FavoriteConversion>();

  setTab(tab: 'dimensional' | 'constants' | 'prefixes' | 'favorites'): void {
    this.activeTab = tab;
    this.activeTabChange.emit(tab);
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }

  onInjectConstant(val: number): void {
    this.injectConstant.emit(val);
  }

  onApplyFavorite(fav: FavoriteConversion): void {
    this.applyFavorite.emit(fav);
  }
}
