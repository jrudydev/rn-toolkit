/**
 * History Stack
 *
 * Manages navigation history with state restoration support.
 */

import type { HistoryEntry, NavigationState, ParsedRoute, RouteParams } from './types';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * History stack configuration
 */
export interface HistoryStackConfig {
  /** Maximum stack size */
  maxSize?: number;
  /** Callback when history changes */
  onChange?: (history: HistoryEntry[], currentIndex: number) => void;
}

/**
 * History stack options
 */
export interface HistoryStackOptions {
  /** Maximum stack size */
  maxSize?: number;
  /** Callback when history changes */
  onChange?: (history: HistoryEntry[], currentIndex: number) => void;
}

/**
 * History stack manager
 */
export class HistoryStack {
  private stack: HistoryEntry[] = [];
  private _currentIndex: number = -1;
  private maxSize: number;
  private onChange?: (history: HistoryEntry[], currentIndex: number) => void;

  constructor(config: HistoryStackOptions = {}) {
    this.maxSize = config.maxSize ?? 50;
    this.onChange = config.onChange;
  }

  /**
   * Get all entries in the stack
   */
  get entries(): HistoryEntry[] {
    return [...this.stack];
  }

  /**
   * Get the current index
   */
  get currentIndex(): number {
    return this._currentIndex;
  }

  /**
   * Get the current history entry
   */
  get current(): HistoryEntry | null {
    return this.stack[this._currentIndex] ?? null;
  }

  /**
   * Get the current route
   */
  get currentRoute(): ParsedRoute | null {
    return this.current?.route ?? null;
  }

  /**
   * Get the full history stack (alias for entries)
   */
  get history(): HistoryEntry[] {
    return this.entries;
  }

  /**
   * Get the current index in the stack (alias for currentIndex)
   */
  get index(): number {
    return this._currentIndex;
  }

  /**
   * Check if we can go back
   */
  get canGoBack(): boolean {
    return this._currentIndex > 0;
  }

  /**
   * Check if we can go forward
   */
  get canGoForward(): boolean {
    return this._currentIndex < this.stack.length - 1;
  }

  /**
   * Push a new entry onto the stack
   */
  push<P extends RouteParams, S = unknown>(
    route: ParsedRoute<P>,
    state?: S
  ): HistoryEntry<P, S> {
    // Remove any forward history
    if (this._currentIndex < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this._currentIndex + 1);
    }

    const entry: HistoryEntry<P, S> = {
      id: generateId(),
      route,
      state: state
        ? {
            id: generateId(),
            data: state,
            timestamp: Date.now(),
          }
        : undefined,
      timestamp: Date.now(),
    };

    this.stack.push(entry as HistoryEntry);
    this._currentIndex = this.stack.length - 1;

    // Trim stack if it exceeds max size
    if (this.stack.length > this.maxSize) {
      const trimCount = this.stack.length - this.maxSize;
      this.stack = this.stack.slice(trimCount);
      this._currentIndex = Math.max(0, this._currentIndex - trimCount);
    }

    this.notifyChange();
    return entry;
  }

  /**
   * Replace the current entry
   */
  replace<P extends RouteParams, S = unknown>(
    route: ParsedRoute<P>,
    state?: S
  ): HistoryEntry<P, S> {
    const entry: HistoryEntry<P, S> = {
      id: generateId(),
      route,
      state: state
        ? {
            id: generateId(),
            data: state,
            timestamp: Date.now(),
          }
        : undefined,
      timestamp: Date.now(),
    };

    if (this._currentIndex >= 0) {
      this.stack[this._currentIndex] = entry as HistoryEntry;
    } else {
      this.stack.push(entry as HistoryEntry);
      this._currentIndex = 0;
    }

    this.notifyChange();
    return entry;
  }

  /**
   * Go back in history
   */
  goBack(): HistoryEntry | null {
    if (!this.canGoBack) {
      return null;
    }

    this._currentIndex--;
    this.notifyChange();
    return this.current;
  }

  /**
   * Go forward in history
   */
  goForward(): HistoryEntry | null {
    if (!this.canGoForward) {
      return null;
    }

    this._currentIndex++;
    this.notifyChange();
    return this.current;
  }

  /**
   * Go to a specific index
   */
  goTo(index: number): HistoryEntry | null {
    const clampedIndex = Math.max(0, Math.min(index, this.stack.length - 1));
    if (this.stack.length === 0) {
      return null;
    }

    this._currentIndex = clampedIndex;
    this.notifyChange();
    return this.current;
  }

  /**
   * Reset history to a single entry
   */
  reset<P extends RouteParams, S = unknown>(
    route: ParsedRoute<P>,
    state?: S
  ): HistoryEntry<P, S> {
    const entry: HistoryEntry<P, S> = {
      id: generateId(),
      route,
      state: state
        ? {
            id: generateId(),
            data: state,
            timestamp: Date.now(),
          }
        : undefined,
      timestamp: Date.now(),
    };

    this.stack = [entry as HistoryEntry];
    this._currentIndex = 0;

    this.notifyChange();
    return entry;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.stack = [];
    this._currentIndex = -1;
    this.notifyChange();
  }

  /**
   * Get state for current entry
   */
  getState<S = unknown>(): S | undefined {
    return this.current?.state?.data as S | undefined;
  }

  /**
   * Set state for current entry
   */
  setState<S = unknown>(state: S): void {
    if (this.current) {
      this.stack[this._currentIndex] = {
        ...this.current,
        state: {
          id: generateId(),
          data: state,
          timestamp: Date.now(),
        } as NavigationState,
      };
      this.notifyChange();
    }
  }

  /**
   * Serialize history for persistence
   */
  serialize(): string {
    return JSON.stringify({
      stack: this.stack,
      currentIndex: this._currentIndex,
    });
  }

  /**
   * Restore history from serialized data
   */
  restore(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.stack) && typeof parsed.currentIndex === 'number') {
        this.stack = parsed.stack;
        this._currentIndex = parsed.currentIndex;
        this.notifyChange();
        return true;
      }
    } catch {
      // Invalid data
    }
    return false;
  }

  /**
   * Notify listeners of changes
   */
  private notifyChange(): void {
    this.onChange?.(this.history, this._currentIndex);
  }
}
