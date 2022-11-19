import router from "@/router";
import { Directus } from "@directus/sdk";

/*
Constant for å deklarere Directus instansen.
*/

export const directus = new Directus("https://28nn06ju.directus.app/", {
  auth: {
    mode: "json",
  },
});

/*
AuthService er der for å logge inn, logge ut, opprette bruker og hente ut bruker data. 
*/

export const authService = {
  async login(email: string, password: string) {
    return await directus.auth.login({ email, password });
  },
  async register(firstName: string, email: string, description: string, avatar: string, password: string): Promise<boolean> {
    const createUserResult = await directus.users.createOne({
      first_name: firstName,
      email,
      description,
      password,
      avatar,
      role: "26e897c4-0855-41c5-91e9-a0fb788f6a07"
    });

    return !!createUserResult?.email;
  },
  async logout() {
    router.replace('/home');
    return await directus.auth.logout();

  },
  async currentUser() {
    return await directus.users.me.read({
      fields: ["email", "first_name"],
    });
  },
};
