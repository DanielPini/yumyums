import type { IFuseOptions } from 'fuse.js';
import type { Cuisine, Food, Meal } from '../types';

/** Fuzzy-match options for food name/alias search: tolerant of typos and word order, name weighted above aliases. */
export const FOOD_FUSE_OPTIONS: IFuseOptions<Food> = {
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'aliases', weight: 0.3 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/** Fuzzy-match options for meal/cuisine name search, used by the global search bar. */
export const NAME_FUSE_OPTIONS: IFuseOptions<Meal | Cuisine> = {
  keys: ['name'],
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
};
