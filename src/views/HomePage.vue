<script setup lang="ts">
import { directus } from '@/services/directus.service'; 
import { IonContent,IonList,IonSearchbar, IonHeader,IonImg, IonPage, IonTitle, IonToolbar, IonCard, IonCardSubtitle, IonIcon, IonCardTitle, IonCardHeader, IonCardContent, onIonViewDidEnter } from '@ionic/vue';
import { ref } from 'vue';
import {IGames} from "@/models/gameModels";
import { gameControllerOutline, pricetagOutline,businessOutline  } from 'ionicons/icons';

/*
Setter at Games skal ha samme datatyper som IGames interfacet.
*/

const games = ref < IGames[] > ([]);
const filePath = "https://28nn06ju.directus.app/assets/"


interface IGamesResponse {
    retro_games: IGames[];
}

/*
Sier at når vinduet åpnes skal den hente ut alle spill fra databasen. 
*/

onIonViewDidEnter(() => {
    fetchRetroGames();
})

/*
Funskjon for å hente ut spill fra Directus, en spørring er satt opp får å passe datafeltene i datamodellen satt opp. 
*/

const fetchRetroGames = (async () => {
    const response = await directus.graphql.items < IGamesResponse > (`
    query {
        retro_games {
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
        games.value = [...response.data.retro_games];
    }
});

/*
Funskjon for å håndtere søk, slik at man kan søke etter annonser med tittel. 
 */

function handleSearch(event: Event){

    const query = event.target?.value.toLowerCase();
    const gameSearch= games.value.filter(game => {
        if (query === "") {
            fetchRetroGames();
        }
        return game.title.toLocaleLowerCase().includes(query) 
    })
    games.value = gameSearch
    
}



</script>

<template>
  <ion-page>
     <ion-header>
        <ion-toolbar>
           <ion-title></ion-title>
        </ion-toolbar>
        <ion-toolbar>
           <ion-searchbar @ion-change="handleSearch($event)"></ion-searchbar>
        </ion-toolbar>
     </ion-header>
     <ion-list v-for="game in games" :key="game.id"></ion-list>
     <ion-content :fullscreen="true">
        <ion-card  id="background-card">
          <ion-card id="home-card" v-for="game in games" :key="game.id"  :router-link="'/detail/' + game.id">
              <ion-card-header>
                 <ion-card-title id="card-title">{{game.title}}</ion-card-title>
                 <ion-card-subtitle>
                    <ion-icon :icon="pricetagOutline"></ion-icon>
                    Kr: {{game.price}},-
                 </ion-card-subtitle>
                 <ion-card-subtitle>
                    <ion-icon :icon="gameControllerOutline"></ion-icon>
                    Platform: {{game.platform}}
                 </ion-card-subtitle>
                 <ion-card-subtitle>
                    <ion-icon :icon="businessOutline"></ion-icon>
                    By: {{game.city}}
                 </ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
                 <div class="img-container">
                    <ion-img :src="filePath + game.image.id" id="game-img" alt="Spill annonse" />
                 </div>
                 {{game.description}}
              </ion-card-content>
           </ion-card>
      
        </ion-card>
     </ion-content>
  </ion-page>
</template>

<style scoped>

#home-card{
  background-color: rgba(255, 255, 255, 0.644);
  height: auto;
  border: 1px solid black;
  max-height: fit-content;
  animation-name: cardColorChange;
  animation-duration: 2s; 
}

#background-card {
  animation: backGroundCardColorChange 40s infinite;
}

ion-page{
  --background: black;
}

ion-card-subtitle{
  color: black;
  font-size: 17px;
  font-weight: normal;
}

ion-card-content{
  color: black;
  font-size: 17px;
}


#card-title{
  text-align: center;
  color: rgb(0, 0, 0);
  text-shadow: 1px 1px #d2d2d2;
  font-weight: bold;
  margin-bottom: 5%;
}
ion-icon{
  font-size: 20px;
}


ion-searchbar {
  color: rgb(255, 255, 255);
  text-align: center;
  font-size: 10px;
}

ion-searchbar :placeholder-shown {
  color: rgb(255, 255, 255);
  font-weight: bold;
  text-align: center;
}

ion-content{
--ion-background-color:#000000;
}

/*
Har ikke kopiert dette, selvom man sikkert finner lignende kode på nettet. Lærte dette i 1 klasse. 
*/

@keyframes cardColorChange {
  0%   {background-color: rgb(113, 158, 243);}
  10%   {background-color: rgb(251, 0, 134);}
  25%  {background-color: rgb(66, 66, 5);}
  40%   {background-color: rgb(0, 255, 174);}
  50%  {background-color: rgb(12, 12, 115);}
  75%   {background-color: rgb(132, 255, 0);}
  100% {background-color: rgb(128, 0, 62);}
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

.img-container{
 border: 1px solid black; 
 display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}


.img-container img{
  flex-shrink: 0;
    min-width: 100%;
    min-height: 100%
}

</style>

