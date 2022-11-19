<template>
  <ion-app id="app">
   <ion-menu content-id="main-content">
      <ion-header>
         <ion-toolbar>
            <ion-title>🕹</ion-title>
         </ion-toolbar>
      </ion-header>
      <ion-content>
         <ion-list>
          <ion-menu-toggle>
            <ion-item class="menu-item">
               <ion-button class="menu-buttons" router-link="/">Hjem</ion-button>
            </ion-item>
            <ion-item class="menu-item">
               <ion-button  class="menu-buttons" router-link="/newGame">Legg ut</ion-button>
            </ion-item>
            <ion-item class="menu-item">
               <ion-button   class="menu-buttons" router-link="/profile">Profil</ion-button>
            </ion-item>
          </ion-menu-toggle>
         </ion-list>
      </ion-content>
   </ion-menu>
   <ion-page id="main-content">
      <ion-header>
         <ion-toolbar>
            <ion-buttons slot="start">
               <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>RETRO !</ion-title>
         </ion-toolbar>
      </ion-header>
      <ion-router-outlet />
   </ion-page>
</ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet,  IonButtons,
    IonContent,
    IonHeader,
    IonMenu,
    IonMenuButton,
    IonMenuToggle,
    IonPage,
    IonButton,
    IonTitle,
    IonItem,
    IonList,
    IonToolbar, 
} from '@ionic/vue';
import { defineComponent} from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
    IonPage,
    IonButtons,
    IonButton,
    IonContent,
    IonHeader,
    IonMenuToggle,
    IonMenu,
    IonList,
    IonItem,
    IonMenuButton,
    IonTitle,
    IonToolbar
  }
});
</script>

<style scoped>
@import url('https://fonts.cdnfonts.com/css/common-pixel');

ion-page{
  background-color: rgb(0, 0, 0);

}
.menu-buttons{
  --background: rgb(0, 0, 0);
  width: 100%;
  height: 100%
}




ion-toolbar{
--background:  rgb(0, 0, 0);
height: fit-content;
}




ion-title{
  color: purple;
  font-size: 35px;
  font-family: 'Common Pixel', sans-serif;
}

ion-content {
  --background: rgb(0, 0, 0);
}
ion-menu{
  --height: 100%;
  --width: 60%
}
.menu-item{
  width: 100%;
}


</style>





