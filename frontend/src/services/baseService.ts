
export class BaseHybridService {
  private useBackend: boolean = true; // Start with backend mode
  private backendUrl: string = 'https://your-backend-api.com/api'; // Production URL
  private backendChecked: boolean = false;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 30000; // 30 seconds

  constructor() {
    // Force backend mode in production
    const config = this.getConfig();
    this.useBackend = config.forceMode === 'backend' || !config.enableMockFallback;
    this.backendUrl = config.apiBaseUrl;
    
    // Only check backend health once per service instance
    if (!this.backendChecked && this.useBackend) {
      this.checkBackendHealth().catch(() => {
        // Log error but don't fallback to mock in production
        console.error('Backend health check failed in production mode');
      });
    }
  }

  private getConfig() {
    return {
      apiBaseUrl: 'https://your-backend-api.com/api',
      enableMockFallback: false,
      forceMode: 'backend' as const
    };
  }

  private async checkBackendHealth(): Promise<void> {
    const now = Date.now();
    
    // Avoid excessive health checks
    if (this.backendChecked && (now - this.lastHealthCheck) < this.healthCheckInterval) {
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // Reduced timeout
      
      const response = await fetch(`${this.backendUrl}/actuator/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      this.useBackend = response.ok;
      this.backendChecked = true;
      this.lastHealthCheck = now;
      
      if (!this.useBackend) {
        console.log('Backend not available, using mock data');
      }
    } catch (error) {
      console.log('Backend not available, using mock data');
      this.useBackend = false;
      this.backendChecked = true;
      this.lastHealthCheck = now;
    }
  }

  protected async apiRequest<T>(
    endpoint: string,
    options?: RequestInit,
    mockFallback?: () => Promise<T>
  ): Promise<T> {
    const config = this.getConfig();
    
    if (this.useBackend || config.forceMode === 'backend') {
      try {
        const response = await fetch(`${this.backendUrl}${endpoint}`, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            ...options?.headers,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return await response.json();
      } catch (error) {
        // In production mode, don't fallback to mock
        if (config.forceMode === 'backend' || !config.enableMockFallback) {
          console.error(`Backend request failed for ${endpoint}:`, error);
          throw error;
        }
        
        // Development mode - fallback to mock
        if (this.useBackend) {
          console.warn(`Backend request failed for ${endpoint}, falling back to mock`);
          this.useBackend = false;
        }
        
        if (mockFallback) {
          return await mockFallback();
        }
        throw error;
      }
    } else if (mockFallback) {
      return await mockFallback();
    } else {
      throw new Error('No backend connection and no mock fallback available');
    }
  }

  protected getMockDelay(): number {
    return 300 + Math.random() * 700; // 300-1000ms
  }

  isUsingBackend(): boolean {
    return this.useBackend;
  }

  forceBackendMode(): void {
    this.useBackend = true;
  }

  forceMockMode(): void {
    this.useBackend = false;
  }
}
