<template>
  <ion-card class="form-card" :class="{ 'edit-mode-card': editingId }">
    <ion-card-header>
      <ion-card-title class="card-title">
        {{ editingId ? 'Edit Pet Record' : 'Register New Pet' }}
      </ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <!-- Pet Name -->
      <ion-item class="custom-item" lines="none">
        <ion-input v-model="localPet.name" label="Pet Name" label-placement="stacked" placeholder="Enter pet name"></ion-input>
      </ion-item>

      <!-- Direct Image File Upload -->
      <ion-item class="custom-item file-upload-item" lines="none">
        <div class="file-upload-wrapper">
          <label class="file-label">Pet Profile Picture</label>
          <input type="file" accept="image/*" @change="handleFileUpload" class="file-input" />
        </div>
      </ion-item>

      <!-- Photo Preview in Form -->
      <div v-if="localPet.photoUrl" class="form-photo-preview-container">
        <img :src="localPet.photoUrl" alt="Preview" class="form-photo-preview" />
        <ion-button size="small" color="danger" fill="clear" @click="localPet.photoUrl = ''">Remove Photo</ion-button>
      </div>

      <!-- Animal Type Select -->
      <ion-item class="custom-item" lines="none">
        <ion-select v-model="localPet.type" label="Animal Type" label-placement="stacked" placeholder="Select animal type" @ionChange="onTypeChange">
          <ion-select-option value="Dog">🐶 Dog</ion-select-option>
          <ion-select-option value="Cat">🐱 Cat</ion-select-option>
          <ion-select-option value="Bird">🐦 Bird</ion-select-option>
          <ion-select-option value="Rabbit">🐰 Rabbit</ion-select-option>
          <ion-select-option value="Hamster">🐹 Hamster</ion-select-option>
          <ion-select-option value="Other"> Other Animal</ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Custom Animal Type Input -->
      <ion-item v-if="localPet.type === 'Other'" class="custom-item custom-fade-in" lines="none">
        <ion-input v-model="localPet.customType" label="Specify Animal Type" label-placement="stacked" placeholder="Enter custom animal type"></ion-input>
      </ion-item>

      <!-- Breed Select -->
      <ion-item class="custom-item" lines="none">
        <ion-select v-model="localPet.breed" label="Breed" label-placement="stacked" placeholder="Select breed" @ionChange="onBreedChange">
          <ion-select-option v-for="breed in availableBreeds" :key="breed" :value="breed">
            {{ breed }}
          </ion-select-option>
        </ion-select>
      </ion-item>

      <!-- Custom Breed Input -->
      <ion-item v-if="localPet.breed === 'Other'" class="custom-item custom-fade-in" lines="none">
        <ion-input v-model="localPet.customBreed" label="Specify Breed" label-placement="stacked" placeholder="Enter custom breed"></ion-input>
      </ion-item>

      <!-- Birthday -->
      <ion-item class="custom-item calendar-item" lines="none">
        <ion-input type="date" v-model="localPet.birthday" label="Pet Birthday (Click to open calendar)" label-placement="stacked" class="calendar-input"></ion-input>
      </ion-item>

      <!-- Age -->
      <div class="age-container">
        <ion-item class="custom-item half-width" lines="none">
          <ion-input type="number" v-model="localPet.ageYears" label="Age (Years)" label-placement="stacked" placeholder="Years"></ion-input>
        </ion-item>
        <ion-item class="custom-item half-width" lines="none">
          <ion-input type="number" v-model="localPet.ageMonths" label="Age (Months)" label-placement="stacked" placeholder="Months"></ion-input>
        </ion-item>
      </div>

      <!-- Weight -->
      <div class="age-container">
        <ion-item class="custom-item weight-input" lines="none">
          <ion-input type="number" step="0.1" v-model="localPet.weight" label="Weight" label-placement="stacked" placeholder="e.g. 5.2"></ion-input>
        </ion-item>
        <ion-item class="custom-item weight-unit" lines="none">
          <ion-select v-model="localPet.weightUnit" label="Unit" label-placement="stacked">
            <ion-select-option value="kg">kg</ion-select-option>
            <ion-select-option value="lbs">lbs</ion-select-option>
          </ion-select>
        </ion-item>
      </div>

      <!-- Owner Name -->
      <ion-item class="custom-item" lines="none">
        <ion-input v-model="localPet.owner" label="Owner Name" label-placement="stacked" placeholder="Enter owner's full name"></ion-input>
      </ion-item>

      <!-- Notes -->
      <ion-item class="custom-item" lines="none">
        <ion-textarea v-model="localPet.notes" label="Medical Notes / Temperament" label-placement="stacked" placeholder="Enter medical history, vaccination, etc."></ion-textarea>
      </ion-item>

      <!-- Buttons -->
      <ion-button expand="block" class="ion-margin-top save-btn" @click="$emit('save')">
        {{ editingId ? 'Update Pet Record' : 'Save Pet Record' }}
      </ion-button>
      <ion-button v-if="editingId" expand="block" fill="outline" class="ion-margin-top cancel-btn" @click="$emit('cancel')">
        Cancel Edit
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup>
import { computed } from 'vue';
import {
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonInput, IonTextarea, IonButton, IonSelect, IonSelectOption
} from '@ionic/vue';

const props = defineProps({
  modelValue: Object,
  editingId: [String, null]
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const localPet = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const breedOptions = {
  Dog: ['Aspin', 'Shih Tzu', 'Golden Retriever', 'Siberian Husky', 'Poodle', 'German Shepherd', 'Pomeranian', 'Bulldog', 'Other'],
  Cat: ['Puspin', 'Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Scottish Fold', 'Ragdoll', 'Other'],
  Bird: ['Lovebird', 'Parakeet', 'Cockatiel', 'Budgerigar', 'Finch', 'Canary', 'Other'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Angora', 'Other'],
  Hamster: ['Syrian', 'Campbell\'s Dwarf', 'Winter White', 'Roborovski', 'Chinese', 'Other'],
  Other: ['Other']
};

const availableBreeds = computed(() => {
  if (localPet.value.type === 'Other') return ['Other'];
  return breedOptions[localPet.value.type] || ['Other'];
});

const onTypeChange = () => {
  if (!props.editingId) {
    localPet.value.breed = '';
    localPet.value.customBreed = '';
  }
  if (localPet.value.type !== 'Other') {
    localPet.value.customType = '';
  }
};

const onBreedChange = () => {
  if (localPet.value.breed !== 'Other') {
    localPet.value.customBreed = '';
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      localPet.value.photoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>