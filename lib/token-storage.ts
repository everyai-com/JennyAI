// Simple in-memory storage for development
let tokenStorage: any = {};

export const storage = {
  async get(key: string) {
    return tokenStorage[key] || null;
  },

  async set(key: string, value: any) {
    tokenStorage[key] = value;
    return true;
  },

  async delete(key: string) {
    delete tokenStorage[key];
    return true;
  },
};
