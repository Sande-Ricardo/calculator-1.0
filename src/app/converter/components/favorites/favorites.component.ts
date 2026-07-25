import { Component, Output, EventEmitter } from '@angular/core';
import { ConverterFavoritesService } from '../../services/converter-favorites.service';
import { ConverterDataService } from '../../services/converter-data.service';
import { FavoriteConversion } from '../../models/converter.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent {
  @Output() applyFavorite = new EventEmitter<FavoriteConversion>();

  constructor(
    public favoritesService: ConverterFavoritesService,
    private dataService: ConverterDataService
  ) {}

  onApply(fav: FavoriteConversion): void {
    this.applyFavorite.emit(fav);
  }

  onRemove(id: string, ev: MouseEvent): void {
    ev.stopPropagation();
    this.favoritesService.removeFavorite(id);
  }

  getMagnitudeName(magKey: string): string {
    return this.dataService.MAGNITUDES[magKey]?.name || magKey;
  }
}
