<script setup lang="ts">
import { authService, directus } from '@/services/directus.service';
import { IonButton, IonContent, IonInput, IonItem, IonIcon, IonLabel, IonList, IonTextarea, IonPage, IonToggle, onIonViewDidLeave } from '@ionic/vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {Iuser} from "@/models/UserModel";
import { Camera, CameraResultType } from '@capacitor/camera';

/*
Router gjør det mulig å få tilgang til useRouter, som jeg bruker for å navigere rundt og sende brukere til og fra sider i appen.
*/

const router = useRouter();

/*
Setter registerMode til false som standard, fordi hvis den er true kommer det opp input felter jeg ikke ønsker å vise hvis man ikke skal registrere seg.
*/

const inRegisterMode = ref(false);

/*
Setter userDetails til tomme strenger, før de blir gitt verdier. 
*/

const userDetails = ref<Iuser>({
    firstName :"", 
    email : "",
    description: "",
    avatar:"",
    password : "",
})

/*
Funksjon for å logge inn, der brukeren skriver inn riktig email og passord. Blir så sendt til hjem siden. 
*/

const login = async () => {
    try {

        await authService.login(userDetails.value.email, userDetails.value.password);
        router.replace('/home');

    } catch (error) {
        console.error(error);
    }
}

/*
Funskjon for å opprette bruker. Med mulighet for å ha profilbilde og bio. Fornavn, epost og passord må man ha. 
*/

const register = async () => {
    const response = await fetch(userDetails.value.avatar)
    const imageBlob = await response.blob()

    const formData = new FormData();
    formData.append('file', imageBlob)
    const fileUpload = await directus.files.createOne(formData);

    if (fileUpload){
        userDetails.value.avatar = fileUpload?.id
    }

    console.log(fileUpload)
    
    try {

            await authService.register(
             userDetails.value.firstName,
             userDetails.value.email, 
             userDetails.value.description,
             userDetails.value.avatar,
             userDetails.value.password);   
            await login();
            
    }catch{
            console.log(Error);
    }
}

/*
Funskjon for å aktivere kamera.
*/

const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });

  if(photo.webPath){
      userDetails.value.avatar = photo.webPath
  }
}

/*
Sier at når siden blir gått ut av skal siden laste inn på nytt. 
Dette var for å fikse en feil ved at appen ikke skjønte at bruker var logget inn uten at jeg fysisk lastet inn vindet på nytt.
*/

onIonViewDidLeave (() => {
  window.location.reload();
})
</script>

<template>
 <ion-page>
   <ion-content>
      <ion-list>
         <ion-item  class="auth-list" lines="none">
            <ion-label class="label-mild">Opprett bruker</ion-label>
            <ion-toggle color="dark" @ion-change="inRegisterMode = !inRegisterMode"></ion-toggle>
         </ion-item>
         <img v-if="userDetails.avatar" :src="userDetails.avatar"/>
         <section v-if="inRegisterMode">
            <ion-button  fill="default" class="remove-image-preview">
               <ion-icon slot="icon-only" color="danger"></ion-icon>
            </ion-button>
         </section>
         <ion-button  v-if="inRegisterMode" @click="triggerCamera" class="image-picker" color="light">
            Velg fil eller ta bilde 📸
         </ion-button>
         <ion-item v-if="inRegisterMode">
            <ion-label class="label-mild" position="floating">Fornavn:</ion-label>
            <ion-input v-model="userDetails.firstName"></ion-input>
         </ion-item>
         <ion-item>
            <ion-label class="label-mild" position="floating">Email:</ion-label>
            <ion-input type="email" v-model="userDetails.email"></ion-input>
         </ion-item>
         <ion-item v-if="inRegisterMode">
            <ion-label class="label-mild" position="floating">Bio:</ion-label>
            <ion-textarea type="description" v-model="userDetails.description"></ion-textarea>
         </ion-item>
         <ion-item>
            <ion-label class="label-mild" position="floating">Passord:</ion-label>
            <ion-input type="password" v-model="userDetails.password"></ion-input>
         </ion-item>
         <ion-button v-if="inRegisterMode" @click="register" class="button-auth" fill="solid"  size="default">
            Opprett bruker
         </ion-button>
         <ion-button  v-if="!inRegisterMode"  @click="login" class="button-auth" fill="solid"  size="default">
            Logg inn!
         </ion-button>
      </ion-list>
   </ion-content>
</ion-page>
</template>

<style scoped>
    .auth-list{
        margin-top: 25%;
    }

   .button-auth {
    --background: rgb(72, 14, 139);
    font-size: 15px;
   font-weight: bold;
   }
</style>