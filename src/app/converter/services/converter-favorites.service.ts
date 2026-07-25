import { Injectable } from '@angular/core';
import { FavoriteConversion } from '../models/converter.model';

@Injectable({
  providedIn: 'root'
})
export class ConverterFavoritesService {

  private readonly STORAGE_KEY = 'calculato_converter_favorites';

  getFavorites(): FavoriteConversion[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : this.getDefaultFavorites();
    } catch (e) {
      console.warn('Error reading converter favorites from localStorage', e);
      return this.getDefaultFavorites();
    }
  }

  addFavorite(magnitudeKey: string, sourceUnitKey: string, targetUnitKey: string): FavoriteConversion {
    const favorites = this.getFavorites();
    const id = `${magnitudeKey}_${sourceUnitKey}_to_${targetUnitKey}`;
    
    // Avoid duplicate
    const existing = favorites.find(f => f.id === id);
    if (existing) return existing;

    const newFav: FavoriteConversion = {
      id,
      magnitudeKey,
      sourceUnitKey,
      targetUnitKey
    };

    favorites.push(newFav);
    this.saveFavorites(favorites);
    return newFav;
  }

  removeFavorite(id: string): void {
    const favorites = this.getFavorites().filter(f => f.id !== id);
    this.saveFavorites(favorites);
  }

  isFavorite(magnitudeKey: string, sourceUnitKey: string, targetUnitKey: string): boolean {
    const id = `${magnitudeKey}_${sourceUnitKey}_to_${targetUnitKey}`;
    return this.getFavorites().some(f => f.id === id);
  }

  private saveFavorites(favorites: FavoriteConversion[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Error saving converter favorites to localStorage', e);
    }
  }

  private getDefaultFavorites(): FavoriteConversion[] {
    return [
      { id: 'pressure_psi_to_kPa', magnitudeKey: 'pressure', sourceUnitKey: 'psi', targetUnitKey: 'kPa' },
      { id: 'power_kW_to_HP', magnitudeKey: 'power', sourceUnitKey: 'kW', targetUnitKey: 'HP' },
      { id: 'temperature_C_to_F', magnitudeKey: 'temperature', sourceUnitKey: 'C', targetUnitKey: 'F' }
    ];
  }
}
