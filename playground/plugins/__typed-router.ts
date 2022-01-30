import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const routesList = {
    activate: 'activate',
    index: 'index',
    childOne: {
      childOneChildOneSubOne: 'parent-child-one-child-one-sub-one',
      user: { index: 'parent-child-one-child-one-sub-one-user' },
      childOneChildOneSubTwo: 'parent-child-one-child-one-sub-two',
      index: 'parent-child-one',
    },
    childTwo: {
      childTwoId: 'parent-child-two-id',
      childTwoChildOneSubOne: 'parent-child-two-child-one-sub-one',
      index: 'parent-child-two',
      profile: {
        id: {
          slug: { index: 'parent-child-two-profile-id-slug' },
          index: 'parent-child-two-profile-id',
        },
        index: 'parent-child-two-profile',
      },
    },
    rootPage: 'rootPage',
  };

  return {
    provide: {
      typedRouter: nuxtApp.$router,
      routesList,
    },
  };
});
