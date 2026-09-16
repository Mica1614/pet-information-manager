<template>
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
            <ion-button fill="clear" size="small" class="edit-btn" @click="$emit('edit', pet)">
              Edit
            </ion-button>
            <ion-button fill="clear" size="small" class="delete-btn" @click="$emit('delete', pet.id)">
              Delete
            </ion-button>
          </div>
        </ion-card-content>
      </ion-card>
    </ion-list>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { IonSearchbar, IonList, IonCard, IonCardContent, IonButton } from '@ionic/vue';

const props = defineProps({
  pets: Array
});

defineEmits(['edit', 'delete']);

const searchQuery = ref('');

const filteredPets = computed(() => {
  if (!searchQuery.value) return props.pets;
  const query = searchQuery.value.toLowerCase();
  return props.pets.filter(pet => {
    const name = (pet.name || '').toLowerCase();
    const owner = (pet.owner || '').toLowerCase();
    const breed = (pet.breed === 'Other' ? pet.customBreed : pet.breed || '').toLowerCase();
    const type = (pet.type === 'Other' ? pet.customType : pet.type || '').toLowerCase();
    return name.includes(query) || owner.includes(query) || breed.includes(query) || type.includes(query);
  });
});
</script>