class StorageSupervisorService {
  setItem(key: string, value: any, expiryInMinutes: number) {
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000,
    };

    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem(key: string): any | null {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item['value'];
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

// Export an instance of the service
export const supervisor = new StorageSupervisorService();