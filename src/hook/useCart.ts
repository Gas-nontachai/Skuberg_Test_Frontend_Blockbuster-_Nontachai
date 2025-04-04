import { getDBStore } from '@/utils/connect';
import { Cart } from '@/misc/types';

const storeName = 'tb_cart';

const getCartBy = async (data: any = {}): Promise<{ docs: Cart[], totalDocs: number }> => {
    const store = await getDBStore(storeName);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const carts: Cart[] = request.result.filter((cart: Cart) => {
                return Object.keys(data).every(key => cart[key as keyof Cart] === data[key]);
            });
            resolve({ docs: carts, totalDocs: carts.length });
        };

        request.onerror = (event) => {
            reject(new Error(`Error fetching carts: ${(event.target as IDBRequest).error}`));
        };
    });
};

const getCartByID = async (data: { cart_id: string }): Promise<Cart> => {
    const store = await getDBStore(storeName);
    const request = store.get(data.cart_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result);
            } else {
                reject(new Error('Cart not found'));
            }
        };

        request.onerror = (event) => {
            reject(new Error(`Error fetching cart by ID: ${(event.target as IDBRequest).error}`));
        };
    });
};

const insertCart = async (data: Cart): Promise<Cart> => {
    const store = await getDBStore(storeName);
    const request = store.add(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error inserting cart: ${(event.target as IDBRequest).error}`));
        };
    });
};

const updateCartBy = async (data: Cart): Promise<Cart> => {
    const store = await getDBStore(storeName);
    const request = store.put(data);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(data);
        };

        request.onerror = (event) => {
            reject(new Error(`Error updating cart: ${(event.target as IDBRequest).error}`));
        };
    });
};

const deleteCartBy = async (data: { cart_id: string }): Promise<void> => {
    const store = await getDBStore(storeName);
    const request = store.delete(data.cart_id);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };

        request.onerror = (event) => {
            reject(new Error(`Error deleting cart: ${(event.target as IDBRequest).error}`));
        };
    });
};

export default function useCart() {
    return {
        getCartBy,
        getCartByID,
        insertCart,
        updateCartBy,
        deleteCartBy
    };
}
