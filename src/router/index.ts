import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import NewGamePage from "@/views/NewGamePage.vue";
import { authService } from '@/services/directus.service';
import { toastController } from '@ionic/core';
import DetailPage from "@/views/DetailPage.vue"
import ProfilePage from "@/views/ProfilePage.vue"

/*
Lager en constant for å hente ut auth_token fra localstorage, slik at jeg slipper å deklarere den senere. 
*/

const userAccessToken = localStorage.getItem("auth_token");

/*
En router guard som sjekker om du er logget inn. 
*/
export const authReqRouteGuard = async () => {

  if(!userAccessToken){
    return {name: "Login"}
  }

  const userAccessTokenTimeout = localStorage.getItem("auth_expires_at") as unknown as number;

  if(userAccessTokenTimeout < new Date().getTime()){
    const errorToast = await toastController.create({
      message: "Du ble logget ut, logg inn igjen",
      duration: 2000,
      color: "tertiary"
    });

    await errorToast.present();
    await authService.logout();
     return {name: "Login"}
  }
}

/*
Routing innad i appen.
*/

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    
  },
  {
    path: "/authentication",
    name: "Login",
    component: AuthenticationPage,
  },
  {
    path:"/newGame",
    name: "AddGame",
    component: NewGamePage,
    beforeEnter: authReqRouteGuard
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
    
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;


