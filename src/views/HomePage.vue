<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>🐾 Pet Information Manager</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Add Pet Form Card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Add New Pet</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item>
            <ion-input v-model="newPet.name" label="Pet Name" label-placement="stacked" placeholder="Enter pet name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="newPet.type" label="Animal Type" label-placement="stacked" placeholder="Dog, Cat, etc."></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="newPet.breed" label="Breed" label-placement="stacked" placeholder="Enter breed"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="newPet.age" label="Age" label-placement="stacked" placeholder="Enter age"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="newPet.owner" label="Owner Name" label-placement="stacked" placeholder="Enter owner name"></ion-input>
          </ion-item>
          <ion-item>
            <ion-textarea v-model="newPet.notes" label="Notes" label-placement="stacked" placeholder="Medical history, temperament, etc."></ion-textarea>
          </ion-item>

          <ion-button expand="block" class="ion-margin-top" @click="addPet">Save Pet</ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Pet List -->
      <h2>Registered Pets</h2>
      <ion-list>
        <ion-item v-for="pet in pets" :key="pet.id">
          <ion-label>
            <h2><strong>{{ pet.name }}</strong> ({{ pet.type }})</h2>
            <p><strong>Breed:</strong> {{ pet.breed }} | <strong>Age:</strong> {{ pet.age }}</p>
            <p><strong>Owner:</strong> {{ pet.owner }}</p>
            <p><strong>Notes:</strong> {{ pet.notes }}</p>
          </ion-label>
          <ion-button color="danger" slot="end" @click="deletePet(pet.id)">Delete</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonInput, IonTextarea, IonButton, IonList, IonLabel 
} from '@ionic/vue';
import { db } from '@/firebase'; // Siguraduhing naka-setup ang firebase config mo
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const pets = ref([]);
const newPet = ref({
  name: '',
  type: '',
  breed: '',
  age: '',
  owner: '',
  notes: ''
});

// Fetch pets from Firestore
const fetchPets = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pets'));
    pets.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching pets: ", error);
  }
};

// Add pet to Firestore
const addPet = async () => {
  if (!newPet.value.name || !newPet.value.owner) {
    alert("Please fill in at least the Pet Name and Owner Name.");
    return;
  }

  try {
    await addDoc(collection(db, 'pets'), { ...newPet.value });
    // Reset form
    newPet.value = { name: '', type: '', breed: '', age: '', owner: '', notes: '' };
    fetchPets();
  } catch (error) {
    console.error("Error adding pet: ", error);
  }
};

// Delete pet from Firestore
const deletePet = async (id) => {
  try {
    await deleteDoc(doc(db, 'pets', id));
    fetchPets();
  } catch (error) {
    console.error("Error deleting pet: ", error);
  }
};

onMounted(() => {
  fetchPets();
});
</script>