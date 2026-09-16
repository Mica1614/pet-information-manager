<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="luxury-toolbar">
        <ion-title class="app-title">Pet-Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding custom-background">
      <!-- Pet Form Component -->
      <PetForm 
        v-model="newPet" 
        :editingId="editingId" 
        @save="addOrUpdatePet" 
        @cancel="cancelEdit" 
      />

      <!-- Pet List Component -->
      <PetList 
        :pets="pets" 
        @edit="editPet" 
        @delete="deletePet" 
      />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent
} from '@ionic/vue';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Import the components
import PetForm from '../components/PetForm.vue';
import PetList from '../components/PetList.vue';

const pets = ref([]);
const editingId = ref(null);

const newPet = ref({
  name: '',
  photoUrl: '',
  type: '',
  customType: '',
  breed: '',
  customBreed: '',
  birthday: '',
  ageYears: '',
  ageMonths: '',
  weight: '',
  weightUnit: 'kg',
  owner: '',
  notes: ''
});

const fetchPets = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pets'));
    pets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching pets: ", error);
  }
};

const addOrUpdatePet = async () => {
  if (!newPet.value.name || !newPet.value.type || !newPet.value.owner) {
    alert("Please fill in at least the Pet Name, Animal Type, and Owner Name.");
    return;
  }

  if (newPet.value.type === 'Other' && !newPet.value.customType) {
    alert("Please specify the custom animal type.");
    return;
  }

  try {
    if (editingId.value) {
      await updateDoc(doc(db, 'pets', editingId.value), { ...newPet.value });
      alert("Pet record updated successfully!");
      editingId.value = null;
    } else {
      await addDoc(collection(db, 'pets'), { ...newPet.value });
    }

    resetForm();
    fetchPets();
  } catch (error) {
    console.error("Error saving pet: ", error);
  }
};

const editPet = (pet) => {
  editingId.value = pet.id;
  newPet.value = { ...pet };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEdit = () => {
  editingId.value = null;
  resetForm();
};

const resetForm = () => {
  newPet.value = {
    name: '', photoUrl: '', type: '', customType: '', breed: '', customBreed: '',
    birthday: '', ageYears: '', ageMonths: '', weight: '', weightUnit: 'kg', owner: '', notes: ''
  };
};

const deletePet = async (id) => {
  if (confirm("Are you sure you want to delete this pet record?")) {
    try {
      await deleteDoc(doc(db, 'pets', id));
      if (editingId.value === id) {
        cancelEdit();
      }
      fetchPets();
    } catch (error) {
      console.error("Error deleting pet: ", error);
    }
  }
};

onMounted(() => {
  fetchPets();
});
</script>

<style scoped>
.custom-background {
  --background: #F8E2D4;
}
.luxury-toolbar {
  --background: linear-gradient(135deg, #4D067B, #7209B7);
  --color: #ffffff;
}
.app-title {
  font-weight: 900;
  letter-spacing: 0.5px;
}
</style>