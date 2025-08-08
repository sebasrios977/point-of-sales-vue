import { computed } from "vue";
import { defineStore } from "pinia";
import { useFirestore } from "vuefire";
import { collection, addDoc } from "firebase/firestore";

export const useProductsStore = defineStore('products', () => {
    
    const db = useFirestore();

    const categories = [
        { id: '', name: 'Seleccione', attrs: { disabled: true } },
        { id: 1, name: 'Sudaderas' },
        { id: 2, name: 'Tenis' },
        { id: 3, name: 'Lentes' },
    ];

    const createProuct = async (product) => {
        await addDoc( collection(db, 'products'), product );
    }

    const categoryOptions = computed(() => {
        return categories.map(({ name, id, ...rest }) => ({ label: name, value: id, ...rest }));
    });

    return {
        createProuct,
        categoryOptions,
    }
});