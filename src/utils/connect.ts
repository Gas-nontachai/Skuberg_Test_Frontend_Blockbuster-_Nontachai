export const dbName = 'BlockbusterDB';
export const storeName = 'blockbuster';
export const apiKey = '53b0df7e18bb1ae26f4e02b8050fb06c';
let db: IDBDatabase | null = null;

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };

        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBRequest).result;

            if (!db.objectStoreNames.contains('tb_movie')) {
                db.createObjectStore('tb_movie', { keyPath: 'movie_id' });
            }

            if (!db.objectStoreNames.contains('tb_cart')) {
                db.createObjectStore('tb_cart', { keyPath: 'cart_id' });
            }
        };
    });
};

export const getStore = (name: string): IDBObjectStore => {
    if (!db) throw new Error('Database not opened');
    return db.transaction(name, 'readwrite').objectStore(name);
};

export const getDBStore = async (name: string): Promise<IDBObjectStore> => {
    await openDB();
    return getStore(name);
};
