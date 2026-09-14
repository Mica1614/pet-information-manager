<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="luxury-toolbar">
        <ion-title class="app-title">Pet-Info</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding custom-background">
      <!-- Add/Edit Pet Form Card -->
      <ion-card class="form-card" :class="{ 'edit-mode-card': editingId }">
        <ion-card-header>
          <ion-card-title class="card-title">
            {{ editingId ? 'Edit Pet Record' : 'Register New Pet' }}
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <!-- Pet Name -->
          <ion-item class="custom-item" lines="none">
            <ion-input v-model="newPet.name" label="Pet Name" label-placement="stacked" placeholder="Enter pet name"></ion-input>
          </ion-item>

          <!-- Direct Image File Upload -->
          <ion-item class="custom-item file-upload-item" lines="none">
            <div class="file-upload-wrapper">
              <label class="file-label">Pet Profile Picture</label>
              <input type="file" accept="image/*" @change="handleFileUpload" class="file-input" />
            </div>
          </ion-item>

          <!-- Photo Preview in Form -->
          <div v-if="newPet.photoUrl" class="form-photo-preview-container">
            <img :src="newPet.photoUrl" alt="Preview" class="form-photo-preview" />
            <ion-button size="small" color="danger" fill="clear" @click="newPet.photoUrl = ''">Remove Photo</ion-button>
          </div>

          <!-- Animal Type Select -->
          <ion-item class="custom-item" lines="none">
            <ion-select v-model="newPet.type" label="Animal Type" label-placement="stacked" placeholder="Select animal type" @ionChange="onTypeChange">
              <ion-select-option value="Dog">🐶 Dog</ion-select-option>
              <ion-select-option value="Cat">🐱 Cat</ion-select-option>
              <ion-select-option value="Bird">🐦 Bird</ion-select-option>
              <ion-select-option value="Rabbit">🐰 Rabbit</ion-select-option>
              <ion-select-option value="Hamster">🐹 Hamster</ion-select-option>
              <ion-select-option value="Other"> Other Animal</ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Custom Animal Type Input -->
          <ion-item v-if="newPet.type === 'Other'" class="custom-item custom-fade-in" lines="none">
            <ion-input v-model="newPet.customType" label="Specify Animal Type" label-placement="stacked" placeholder="Enter custom animal type"></ion-input>
          </ion-item>

          <!-- Breed Select -->
          <ion-item class="custom-item" lines="none">
            <ion-select v-model="newPet.breed" label="Breed" label-placement="stacked" placeholder="Select breed" @ionChange="onBreedChange">
              <ion-select-option v-for="breed in availableBreeds" :key="breed" :value="breed">
                {{ breed }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Custom Breed Input -->
          <ion-item v-if="newPet.breed === 'Other'" class="custom-item custom-fade-in" lines="none">
            <ion-input v-model="newPet.customBreed" label="Specify Breed" label-placement="stacked" placeholder="Enter custom breed"></ion-input>
          </ion-item>

          <!-- Birthday (Interactive Calendar Picker) -->
          <ion-item class="custom-item calendar-item" lines="none">
            <ion-input type="date" v-model="newPet.birthday" label="Pet Birthday (Click to open calendar)" label-placement="stacked" class="calendar-input"></ion-input>
          </ion-item>

          <!-- Age (Years and Months) -->
          <div class="age-container">
            <ion-item class="custom-item half-width" lines="none">
              <ion-input type="number" v-model="newPet.ageYears" label="Age (Years)" label-placement="stacked" placeholder="Years"></ion-input>
            </ion-item>
            <ion-item class="custom-item half-width" lines="none">
              <ion-input type="number" v-model="newPet.ageMonths" label="Age (Months)" label-placement="stacked" placeholder="Months"></ion-input>
            </ion-item>
          </div>

          <!-- Weight & Unit -->
          <div class="age-container">
            <ion-item class="custom-item weight-input" lines="none">
              <ion-input type="number" step="0.1" v-model="newPet.weight" label="Weight" label-placement="stacked" placeholder="e.g. 5.2"></ion-input>
            </ion-item>
            <ion-item class="custom-item weight-unit" lines="none">
              <ion-select v-model="newPet.weightUnit" label="Unit" label-placement="stacked">
                <ion-select-option value="kg">kg</ion-select-option>
                <ion-select-option value="lbs">lbs</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <!-- Owner Name -->
          <ion-item class="custom-item" lines="none">
            <ion-input v-model="newPet.owner" label="Owner Name" label-placement="stacked" placeholder="Enter owner's full name"></ion-input>
          </ion-item>

          <!-- Notes -->
          <ion-item class="custom-item" lines="none">
            <ion-textarea v-model="newPet.notes" label="Medical Notes / Temperament" label-placement="stacked" placeholder="Enter medical history, vaccination, etc."></ion-textarea>
          </ion-item>

          <!-- Save / Update Buttons -->
          <ion-button expand="block" class="ion-margin-top save-btn" @click="addOrUpdatePet">
            {{ editingId ? 'Update Pet Record' : 'Save Pet Record' }}
          </ion-button>
          
          <ion-button v-if="editingId" expand="block" fill="outline" class="ion-margin-top cancel-btn" @click="cancelEdit">
            Cancel Edit
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Pet List Section -->
      <div class="list-section">
        <div class="list-header-row">
          <h2 class="section-heading">📋 Directory</h2>
          <span class="count-badge">{{ filteredPets.length }} Pets</span>
        </div>

        <!-- Search Bar -->
        <ion-searchbar 
          v-model="searchQuery" 
          placeholder="Search by name, breed, or owner..." 
          class="custom-searchbar"
          animated="true">
        </ion-searchbar>
        
        <div v-if="filteredPets.length === 0" class="empty-state">
          <p>No matching pets found.</p>
        </div>

        <ion-list lines="none" class="pet-list">
          <ion-card v-for="pet in filteredPets" :key="pet.id" class="pet-item-card">
            <ion-card-content class="pet-card-content">
              <!-- Pet Profile Avatar -->
              <div class="pet-avatar-container">
                <img 
                  :src="pet.photoUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150'" 
                  alt="Pet Avatar" 
                  class="pet-avatar"
                  @error="$event.target.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150'"
                />
              </div>

              <div class="pet-info">
                <div class="pet-header-row">
                  <h3 class="pet-name">{{ pet.name }}</h3>
                  <span class="pet-badge">{{ pet.type === 'Other' ? pet.customType : pet.type }}</span>
                </div>
                <p><strong>Breed:</strong> {{ pet.breed === 'Other' ? pet.customBreed : (pet.breed || 'N/A') }}</p>
                <p v-if="pet.birthday"><strong>Birthday:</strong> 📅 {{ pet.birthday }}</p>
                <p><strong>Age:</strong> {{ pet.ageYears || 0 }} year(s) {{ pet.ageMonths || 0 }} month(s)</p>
                <p v-if="pet.weight"><strong>Weight:</strong> ⚖️ {{ pet.weight }} {{ pet.weightUnit || 'kg' }}</p>
                <p><strong>Owner:</strong> {{ pet.owner }}</p>
                <p class="pet-notes" v-if="pet.notes"><strong>Notes:</strong> {{ pet.notes }}</p>
              </div>

              <div class="action-buttons">
                <ion-button fill="clear" size="small" class="edit-btn" @click="editPet(pet)">
                  Edit
                </ion-button>
                <ion-button fill="clear" size="small" class="delete-btn" @click="deletePet(pet.id)">
                  Delete
                </ion-button>
              </div>
            </ion-card-content>
          </ion-card>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
  IonItem, IonInput, IonTextarea, IonButton, IonList, 
  IonSelect, IonSelectOption, IonSearchbar 
} from '@ionic/vue';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const pets = ref([]);
const searchQuery = ref('');
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

const breedOptions = {
  Dog: ['Aspin', 'Shih Tzu', 'Golden Retriever', 'Siberian Husky', 'Poodle', 'German Shepherd', 'Pomeranian', 'Bulldog', 'Other'],
  Cat: ['Puspin', 'Persian', 'Siamese', 'Maine Coon', 'British Shorthair', 'Scottish Fold', 'Ragdoll', 'Other'],
  Bird: ['Lovebird', 'Parakeet', 'Cockatiel', 'Budgerigar', 'Finch', 'Canary', 'Other'],
  Rabbit: ['Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Angora', 'Other'],
  Hamster: ['Syrian', 'Campbell\'s Dwarf', 'Winter White', 'Roborovski', 'Chinese', 'Other'],
  Other: ['Other']
};

const availableBreeds = computed(() => {
  if (newPet.value.type === 'Other') return ['Other'];
  return breedOptions[newPet.value.type] || ['Other'];
});

const onTypeChange = () => {
  if (!editingId.value) {
    newPet.value.breed = '';
    newPet.value.customBreed = '';
  }
  if (newPet.value.type !== 'Other') {
    newPet.value.customType = '';
  }
};

const onBreedChange = () => {
  if (newPet.value.breed !== 'Other') {
    newPet.value.customBreed = '';
  }
};

// Function to handle image file selection and conversion to Base64
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      newPet.value.photoUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const filteredPets = computed(() => {
  if (!searchQuery.value) return pets.value;
  const query = searchQuery.value.toLowerCase();
  return pets.value.filter(pet => {
    const name = (pet.name || '').toLowerCase();
    const owner = (pet.owner || '').toLowerCase();
    const breed = (pet.breed === 'Other' ? pet.customBreed : pet.breed || '').toLowerCase();
    const type = (pet.type === 'Other' ? pet.customType : pet.type || '').toLowerCase();
    return name.includes(query) || owner.includes(query) || breed.includes(query) || type.includes(query);
  });
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
  newPet.value = {
    name: pet.name || '',
    photoUrl: pet.photoUrl || '',
    type: pet.type || '',
    customType: pet.customType || '',
    breed: pet.breed || '',
    customBreed: pet.customBreed || '',
    birthday: pet.birthday || '',
    ageYears: pet.ageYears || '',
    ageMonths: pet.ageMonths || '',
    weight: pet.weight || '',
    weightUnit: pet.weightUnit || 'kg',
    owner: pet.owner || '',
    notes: pet.notes || ''
  };
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

.form-card {
  border-radius: 20px;
  box-shadow: 0 15px 35px -10px rgba(77, 6, 123, 0.2);
  margin-bottom: 24px;
  background: #ffffff;
  border: 2px solid #B984DB;
  padding: 8px;
  transition: all 0.3s ease;
}

.edit-mode-card {
  border-color: #E2BD6B;
  box-shadow: 0 15px 35px -10px rgba(226, 189, 107, 0.3);
}

.card-title {
  color: #4D067B;
  font-weight: 800;
  font-size: 1.35rem;
}

.custom-item {
  margin-bottom: 14px;
  --background: #FAF5FF;
  --border-radius: 12px;
  border-radius: 12px;
  border: 1.5px solid #E9D5FF;
  transition: all 0.3s ease;
  overflow: hidden;
}

.custom-item:focus-within {
  border-color: #7209B7;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(114, 9, 183, 0.15);
}

.file-upload-item {
  padding: 12px 16px;
  background: #FAF5FF;
}

.file-upload-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4D067B;
}

.file-input {
  font-size: 0.9rem;
  color: #4D067B;
}

.form-photo-preview-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  background: #F3E8FF;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px dashed #7209B7;
}

.form-photo-preview {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #7209B7;
}

.calendar-item {
  background: #F3E8FF;
  border-color: #B984DB;
}

.custom-fade-in {
  animation: fadeIn 0.3s ease-in-out;
  border-color: #B984DB;
  background: #F3E8FF;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.age-container {
  display: flex;
  gap: 12px;
}

.half-width {
  flex: 1;
}

.weight-input {
  flex: 2;
}

.weight-unit {
  flex: 1;
}

.save-btn {
  font-weight: 700;
  --border-radius: 12px;
  --background: linear-gradient(135deg, #7209B7, #4D067B);
  height: 48px;
  font-size: 1.05rem;
  box-shadow: 0 6px 15px rgba(114, 9, 183, 0.35);
}

.cancel-btn {
  font-weight: 600;
  --border-radius: 12px;
  --color: #4D067B;
  --border-color: #B984DB;
  height: 44px;
}

.list-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-heading {
  font-size: 1.25rem;
  font-weight: 900;
  color: #4D067B;
  margin: 0;
}

.count-badge {
  background: #7209B7;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}

.custom-searchbar {
  padding: 0;
  margin-bottom: 16px;
  --background: #ffffff;
  --border-radius: 14px;
  --box-shadow: 0 4px 12px rgba(77, 6, 123, 0.08);
  --color: #4D067B;
  --placeholder-color: #9ca3af;
  --icon-color: #7209B7;
}

.pet-item-card {
  border-radius: 16px;
  box-shadow: 0 8px 20px -4px rgba(77, 6, 123, 0.08);
  margin-bottom: 14px;
  background: #ffffff;
  border: 1px solid #E9D5FF;
  transition: all 0.25s ease;
}

.pet-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px -4px rgba(114, 9, 183, 0.15);
  border-color: #B984DB;
}

.pet-card-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 18px !important;
  gap: 14px;
}

.pet-avatar-container {
  flex-shrink: 0;
}

.pet-avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  object-fit: cover;
  border: 2.5px solid #7209B7;
  box-shadow: 0 4px 10px rgba(114, 9, 183, 0.2);
}

.pet-info {
  flex: 1;
}

.pet-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.pet-name {
  font-size: 1.2rem;
  color: #4D067B;
  font-weight: 900;
  margin: 0;
}

.pet-badge {
  background: #F3E8FF;
  color: #7209B7;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid #B984DB;
}

.pet-info p {
  margin: 4px 0;
  color: #6b7280;
  font-size: 0.92rem;
}

.pet-notes {
  margin-top: 8px !important;
  color: #4D067B !important;
  font-style: italic;
  background: #FAF5FF;
  padding: 6px 10px;
  border-radius: 8px;
  display: inline-block;
  border-left: 3px solid #7209B7;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.edit-btn {
  font-weight: 700;
  --color: #7209B7;
}

.delete-btn {
  font-weight: 700;
  --color: #ef4444;
}

.empty-state {
  text-align: center;
  color: #7209B7;
  padding: 30px;
  font-style: italic;
  background: #ffffff;
  border-radius: 16px;
  border: 2px dashed #B984DB;
}
</style>