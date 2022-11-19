<script setup lang="ts">
import { IonButton, IonContent,IonToolbar, IonTitle, IonHeader, IonCard,IonTextarea ,IonCardTitle, IonCardSubtitle, IonImg, IonPage, onIonViewDidEnter } from '@ionic/vue';
import { ref } from 'vue';
import {IuserData} from "@/models/UserModel";
import { authService, directus } from '@/services/directus.service';

/*
Sier at profilInfo skal ha datatypene som IUserData har.
*/

 const profileInfo = ref<IuserData>();


 const newProfileInfo = ref <INewData> ({
   first_name: ""
});

  interface INewData {
    first_name: string
  }

 /*
Sier at når siden åpnes skal den hente ut data om brukeren.
*/

 onIonViewDidEnter (() => {
  fetchUserData();
});

/*
Bruker Directus sin metode for å hente ut data om brukeren som er logget inn, slik at det kan vises på profilsiden. 
*/

  const  fetchUserData = async () => {
    const userData= await directus.users.me.read({
      fields: [ "first_name", "email", "avatar", "description"]
    }) 
     profileInfo.value = userData
   }
</script>
<template>
    <ion-page>
   <ion-header :translucent="true">
      <ion-toolbar>
      </ion-toolbar>
   </ion-header>
   <ion-content v-if="profileInfo">
    <ion-card  id="background-card">
      <ion-card class="profile-card">
         <ion-img v-if="profileInfo?.avatar" class="profile-img"  :src="`https://28nn06ju.directus.app/assets/${profileInfo?.avatar}`"/>
         <ion-card-title class="profile-text">Fornavn: {{profileInfo?.first_name}}</ion-card-title>
       

     

         <ion-card-subtitle class="profile-text">Epost: {{profileInfo?.email}}</ion-card-subtitle>
         <ion-textarea v-if="profileInfo.description" class="profile-text" >Bio: {{profileInfo?.description}}</ion-textarea>
         <ion-button @click="authService.logout" class="button-auth" fill="solid" size="default">Logg Ut</ion-button>
         <ion-button @click="updateUserData()">Oppdater</ion-button>   

         <ion-button :router-link="'/home'">Tilbake</ion-button>    
      </ion-card>
    </ion-card>
   </ion-content>
   <ion-content v-if="!profileInfo"  >
      <ion-title>Du har ingen profil info...</ion-title>
   </ion-content>
   <ion-button v-if="!profileInfo"  id="auth-btn" :router-link="'/authentication/'" fill="solid" size="default">
      Logg inn eller registrer deg.
   </ion-button>
</ion-page>
</template> 

<style scoped>
  ion-label{
    background-color: rgb(255, 255, 255);
    color: black;
  }

  #auth-btn{
    height: 10%;
    font-size: 20px;
  }

ion-button{
  --background: rgb(72, 14, 139);
  font-size: 15px;
  font-weight: bold;
  margin-top: 10%;;

}

ion-card{   
  background-color: rgba(255, 255, 255, 0.644);
  height: auto;
  border: 1px solid black;
  max-height: fit-content;
   
}

.profile-text{
  color: black;
  font-size: 20px;
}

.profile-img {
  border: 1px solid black; 
 display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden
}

@keyframes backGroundCardColorChange{
  0%   {background-color: rgb(113, 158, 243);}
  10%   {background-color: rgb(238, 255, 0);}
  25%  {background-color: rgb(82, 0, 95);}
  40%   {background-color: rgb(0, 255, 174);}
  50%  {background-color: rgb(12, 12, 115);}
  55%  {background-color: rgb(255, 0, 225);}
  65%   {background-color: rgb(0, 255, 174);}
  75%  {background-color: rgb(12, 12, 115);}
  80%   {background-color: rgb(132, 255, 0);}
  100% {background-color: rgb(128, 0, 62);}
}
#background-card {
  animation: backGroundCardColorChange 40s infinite;
}
  
</style>







