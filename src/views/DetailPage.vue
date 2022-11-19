<script setup lang="ts">
import { IGames, IGameResponse } from "@/models/gameModels";
import { directus } from "@/services/directus.service";
import { IonImg, IonButton, toastController, IonCardTitle, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonContent, IonItem, IonLabel, IonModal, IonPage, IonTextarea, IonTitle, onIonViewDidEnter } from "@ionic/vue";
import { ref } from 'vue';
import { useRoute } from 'vue-router';

/* Using the route object, we can get data for the user's current route */
const route = useRoute();

/* Retrieve the id parameter from the current route's query string (/detail/:id) */
const { id } = route.params;

/* State */
const isModalOpen = ref(false);
const isLoadingGameAd = ref(true);

/* "Dummy data" for displaying in the UI until we connect the app to an API */
const gameAd= ref<IGames | null>(null);

onIonViewDidEnter(() => {
  fetchRetroGames();
})

/* Fetch data for the specified camping spot from Directus by ID. Cancel the loading spinner when the data has been fetched successfully. */
const fetchRetroGames= async () => {
  const response = await directus.graphql.items<IGameResponse>(`
    query {
        retro_games_by_id(id: ${id}) {
          id,
          title,
          description,
          platform, 
          price,
          condition,
          address,
          city,
          zipCode,
          image {
            id
          },
          user_created {
          first_name,
          email
        }
       }
      }
  `);

  if (response.status === 200 && response.data) {
    gameAd.value= response.data.retro_games_by_id;
    isLoadingGameAd.value = false;
  }
}

const filePath = "https://28nn06ju.directus.app/assets/"

const msgSent = async () => {
  const successToast = toastController.create({
                message: 'Melding sendt.',
                duration: 1500,
                position: 'bottom',
                color: 'success'
            });
        (await successToast).present();
}

</script>

<template>
  <ion-page>
    <ion-page>
        <ion-title v-if="isLoadingGameAd">
          Laster...
        </ion-title>
  </ion-page>
   <ion-content :fullscreen="true" v-if="gameAd && !isLoadingGameAd">
      <ion-card>
         <ion-card-header>
            <ion-img :src="filePath + gameAd.image.id" />
            <ion-card-title>{{gameAd.title}}</ion-card-title>
            <ion-card-subtitle>Platform: {{gameAd.platform}}</ion-card-subtitle>
            <ion-card-subtitle>Tilstand: {{gameAd.condition}}</ion-card-subtitle>
            <ion-card-subtitle>Adresse: {{gameAd.address}}</ion-card-subtitle>
            <ion-card-subtitle>By: {{gameAd.city}} {{gameAd.zipCode}}</ion-card-subtitle>
         </ion-card-header>
         <ion-card-content>
            {{gameAd.description}}
            <ion-card-subtitle>Selges av: {{gameAd.user_created.first_name}}</ion-card-subtitle>
            <ion-card-subtitle>Epost: {{gameAd.user_created.email}}</ion-card-subtitle>
            <ion-button @click="isModalOpen = true">Kontakt {{gameAd.user_created.first_name}}</ion-button>
            <ion-button :router-link="'/home'">Tilbake</ion-button>            
         </ion-card-content>
        
        
      </ion-card>
      
      <ion-modal 
         :is-open="isModalOpen" 
         :initial-breakpoint="0.25"
         :breakpoints="[0, 0.25, 0.5, 0.75]"
         @did-dismiss="isModalOpen = false">
         <ion-content>
            <ion-item lines="none">
               <ion-label position="floating">Skriv din melding til {{gameAd.user_created.first_name}} under.</ion-label>
               <ion-textarea></ion-textarea>
               <ion-button @click="msgSent">Send Melding</ion-button>
            </ion-item>
         </ion-content>
      </ion-modal>
   </ion-content>
</ion-page>
</template>

<style scoped>

ion-card{
  background-color: rgba(255, 255, 255, 0.644);
  height: auto;
  border: 1px solid black;
  max-height: fit-content;
  border: 2px solid rgb(38, 230, 0)
}
ion-card-subtitle{
  color: black;
  font-size: 17px;
  font-weight: 20;
  font-family:Arial, Helvetica, sans-serif
}
ion-card-title{
  text-align: center;
  color: rgb(0, 0, 0);
  text-shadow: 1px 1px #d2d2d2;
  font-weight: bold;
}

ion-img{
  border: 1px solid rgb(255, 251, 0)
}
ion-card-content{
  color: black;
  font-size: 17px;
}
ion-icon{
  font-size: 20px;
}
ion-button{
  --background: rgb(72, 14, 139);
  font-size: 15px;
  font-weight: bold;
  margin-right: 40px;
}

ion-title{
  color: white;
  font-size: 30px;
}

</style>