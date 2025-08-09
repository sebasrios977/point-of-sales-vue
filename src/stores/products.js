import { computed } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { update } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";

export const useProductsStore = defineStore('products', () => {
    
    const db = useFirestore();
    const storage = useFirebaseStorage();

    const categories = [
        { id: '', name: 'Seleccione', attrs: { disabled: true } },
        { id: 1, name: 'Sudaderas' },
        { id: 2, name: 'Tenis' },
        { id: 3, name: 'Lentes' },
    ];

    const q = query(
        collection(db, 'products'),
        orderBy('availability', 'asc'),
    );
    const productsCollection = useCollection(q);
    

    const createProuct = async (product) => {
        await addDoc( collection(db, 'products'), product );
    }

    const updateProduct = async (docRef, product) => {
        const { image, url, ...values } = product;

        if (image.length) {
            await updateDoc(docRef, {
                ...values,
                image: url.value,
            });
        } else {
            await updateDoc(docRef, values);
        }
    }

    const deleteProducts = async id => {
        if (confirm('¿Eliminar producto?')) {
            const docRef = doc(db, 'products', id);
            const docSnap = await getDoc(docRef);
            const { image } = docSnap.data();
            const imageRef = storageRef(storage, image);

            await Promise.all([
                deleteDoc(docRef),
                deleteObject(imageRef),
            ]);

        }
    }

    const categoryOptions = computed(() => {
        return categories.map(({ name, id, ...rest }) => ({ label: name, value: id, ...rest }));
    });

    const noResults = computed(() => productsCollection.value.length === 0);

    return {
        createProuct,
        updateProduct,
        deleteProducts,
        productsCollection,
        categoryOptions,
        noResults,
    }
});