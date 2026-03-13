import { fetchSpecials } from './api';
import { getCachedSpecials, setCachedSpecials } from './cache';
import { groupSpecials } from './group';
import type { GroupedSpecials, SpecialsApiResponse } from './types';

export interface SpecialsState {
  raw: SpecialsApiResponse | null;
  grouped: GroupedSpecials | null;
  loading: boolean;
  error: string | null;
  fromCache: boolean;
}

interface SpecialsClientOptions {
  pollIntervalMs?: number;
  revalidateOnVisibility?: boolean;
}

type Listener = (state: SpecialsState) => void;

const DEFAULT_OPTIONS: Required<SpecialsClientOptions> = {
  pollIntervalMs: 5 * 60 * 1000,
  revalidateOnVisibility: true,
};

export class SpecialsClient {
  private state: SpecialsState = {
    raw: null,
    grouped: null,
    loading: false,
    error: null,
    fromCache: false,
  };

  private listeners = new Set<Listener>();
  private pollTimer: number | null = null;
  private options: Required<SpecialsClientOptions>;
  private isFetching = false;
  private visibilityHandler: (() => void) | null = null;

  constructor(options: SpecialsClientOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): SpecialsState {
    return this.state;
  }

  async init(): Promise<void> {
    const cached = getCachedSpecials();

    if (cached) {
      this.setState({
        raw: cached,
        grouped: groupSpecials(cached),
        loading: false,
        error: null,
        fromCache: true,
      });

      void this.refresh({ silent: true });
      return;
    }

    this.setState({
      ...this.state,
      loading: true,
      error: null,
      fromCache: false,
    });

    await this.refresh({ silent: false });
  }

  startPolling(): void {
    if (this.pollTimer !== null || typeof window === 'undefined') {
      return;
    }

    this.pollTimer = window.setInterval(() => {
      void this.refresh({ silent: true });
    }, this.options.pollIntervalMs);

    if (this.options.revalidateOnVisibility) {
      this.visibilityHandler = () => {
        if (document.visibilityState === 'visible') {
          void this.refresh({ silent: true });
        }
      };

      document.addEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  stopPolling(): void {
    if (this.pollTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }
  }

  async refresh(
    options: { silent?: boolean; force?: boolean } = {},
  ): Promise<void> {
    const { silent = false, force = false } = options;

    if (this.isFetching) {
      return;
    }

    this.isFetching = true;

    if (!silent) {
      this.setState({
        ...this.state,
        loading: true,
        error: null,
      });
    }

    try {
      const data = await fetchSpecials();

      const hasChanged =
        !this.state.raw ||
        JSON.stringify(this.state.raw) !== JSON.stringify(data);

      if (hasChanged || force) {
        setCachedSpecials(data);

        this.setState({
          raw: data,
          grouped: groupSpecials(data),
          loading: false,
          error: null,
          fromCache: false,
        });
      } else {
        this.setState({
          ...this.state,
          loading: false,
          error: null,
          fromCache: false,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load specials';

      this.setState({
        ...this.state,
        loading: false,
        error: message,
      });
    } finally {
      this.isFetching = false;
    }
  }

  destroy(): void {
    this.stopPolling();
    this.listeners.clear();
  }

  private setState(nextState: SpecialsState): void {
    this.state = nextState;
    this.emit();
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
