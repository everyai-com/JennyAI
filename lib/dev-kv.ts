let store: { [key: string]: string } = {};

export const devKV = {
  get: async (key: string) => store[key] || null,
  put: async (key: string, value: string) => {
    store[key] = value;
    return Promise.resolve();
  },
  delete: async (key: string) => {
    delete store[key];
    return Promise.resolve();
  },
  list: async () => ({
    keys: Object.keys(store).map((name) => ({ name })),
    list_complete: true,
  }),
};
