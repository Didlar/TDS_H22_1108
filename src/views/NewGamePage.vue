<script setup lang="ts">
import { IonBackButton, IonButton,IonButtons, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTextarea, toastController } from '@ionic/vue';
import { ref } from 'vue';
import {Camera, CameraResultType} from "@capacitor/camera"
import { directus } from '@/services/directus.service';
import { INewGame } from '@/models/gameModels';
import router from '@/router';

/*
Sier at newGame skal ha tomme verdier som default, feltene skal også ha datatypene som er gitt i INewGame interfacet.
*/

const newGame = ref <INewGame> ({
    title: "",
    description: "",
    platform: "",
    price: NaN,
    condition: "",
    address: "",
    city: "",
    zipCode: NaN,
    image: ""
})
;
/*
Funskjon for å legge ut et nytt spill og lagre det i databasen. Du får ikke lov å laste opp uten å legge til et bilde. 
*/

const postNewGame = async () => {
    console.log(newGame.value)

    if (!newGame.value.image) {
        alert("Du må laste opp bilde");
        return;
    }
    try {
        const response = await fetch(newGame.value.image)
        const imageBlob = await response.blob();

        const formData = new FormData();
        formData.append('file', imageBlob)
        const fileUpload = await directus.files.createOne(formData)

        if (fileUpload) {
            await directus.items('retro_games').createOne({
                title: newGame.value.title,
                description: newGame.value.description,
                platform: newGame.value.platform,
                price: newGame.value.price,
                condition: newGame.value.condition,
                address: newGame.value.address,
                city: newGame.value.city,
                zipCode: newGame.value.zipCode,
                image: fileUpload.id
            })
            const successToast = await toastController.create({
                message: 'Annonsen ble lastet opp',
                duration: 1500,
                position: 'bottom',
                color: 'success'
            });
            await successToast.present();
            router.replace('/home');
        }
    } catch (error) {
        console.log(error)
    }
}

/*
Funskjon for å aktivere kamera og bildegalleriet/fillagring på enheten din.
*/

const triggerCamera = async () => {
    const photo = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.Uri
    });

    if (photo.webPath) {
        newGame.value.image = photo.webPath
    }
}
</script>

<template>
<ion-page>
   <ion-header :translucent="true">
      <ion-buttons slot="end">
         <ion-back-button default-href="/"></ion-back-button>
      </ion-buttons>
   </ion-header>
   <ion-list>
      <img v-if="newGame.image" :src="newGame.image"/>
      <section>
         <ion-button  fill="default" class="remove-image-preview">
            <ion-icon slot="icon-only" color="danger"></ion-icon>
         </ion-button>
      </section>
      <ion-button @click="triggerCamera" color="light" class="image-picker" >
         Last opp eller ta bilde.
      </ion-button>
      <ion-item>
         <ion-label class="label-mild" position="floating">Tittel: </ion-label>
         <ion-input type="text" v-model="newGame.title"></ion-input>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">Beskrivelse: </ion-label>
         <ion-textarea type="text" v-model="newGame.description"></ion-textarea>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">Platform: </ion-label>
         <ion-input type="text" v-model="newGame.platform"></ion-input>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">Pris: </ion-label>
         <ion-input type="number" v-model="newGame.price"></ion-input>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">Tilstand: </ion-label>
         <ion-input type="text" v-model="newGame.condition"></ion-input>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">Adresse: </ion-label>
         <ion-textarea type="text" v-model="newGame.address"></ion-textarea>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">By: </ion-label>
         <ion-textarea type="text" v-model="newGame.city"></ion-textarea>
      </ion-item>
      <ion-item>
         <ion-label class="label-mild" position="floating">Post kode: </ion-label>
         <ion-input type="number" v-model="newGame.zipCode"></ion-input>
      </ion-item>
      <ion-button @click="postNewGame"  class="buttons">Send inn</ion-button>
   </ion-list>
</ion-page>
</template>

<style scoped>
.buttons{
  --background: rgb(72, 14, 139);
  font-size: 15px;
  font-weight: bold;
}
.image-picker {
 margin-left: 25%;
}

ion-item{
  --background: rgb(255, 255, 255);
  color:black;
  font-size: 15px;
  font-weight: bold;
}


</style>
