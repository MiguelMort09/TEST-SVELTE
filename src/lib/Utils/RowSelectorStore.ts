import { writable } from "svelte/store";

const createRowSelector= ()=> {
    const store = writable<{[k: string]: boolean}>({},  () => {
        console.log('got a subscriber');
        return () => {console.log('no more subscribers'); store.set({})};
      });
    
    return {
        subscribe: store.subscribe,
        set: store.set,
        toggle(key: string) {
            store.update((current) => {
                current[key] = !current[key];
                return current;
            });
        }
    };
};

export const rowSelectorStore = createRowSelector();