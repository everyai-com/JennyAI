interface KVNamespace {
  get(key: string, options?: Partial<KVNamespaceGetOptions<any>>): Promise<string | null>;
  put(
    key: string,
    value: string | ReadableStream | ArrayBuffer,
    options?: KVNamespacePutOptions
  ): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<unknown>>;
}

interface KVNamespaceGetOptions<T> {
  type: 'text' | 'json' | 'arrayBuffer' | 'stream';
  cacheTtl?: number;
}

interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: any;
}

interface KVNamespaceListOptions {
  prefix?: string;
  limit?: number;
  cursor?: string;
}

interface KVNamespaceListResult<T> {
  keys: KVNamespaceListKey<T>[];
  list_complete: boolean;
  cursor?: string;
}

interface KVNamespaceListKey<T> {
  name: string;
  expiration?: number;
  metadata?: T;
} 