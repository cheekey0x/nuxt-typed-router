// @ts-nocheck
// eslint-disable
/**
 * ---------------------------------------------------
 * 🚗🚦 Generated by nuxt-typed-router. Do not modify !
 * ---------------------------------------------------
 * */

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const route = useRoute();
  const routesNames = {
    activate: 'activate',
    index: 'index',
    parentFooBar: 'parent-foo-bar',
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
          slug: {
            idSlugArticles: 'parent-child-two-profile-id-slug-articles',
            index: 'parent-child-two-profile-id-slug',
          },
          index: 'parent-child-two-profile-id',
        },
        index: 'parent-child-two-profile',
      },
    },
    parentTestOptional: 'parent-test-optional',
    rootPage: 'rootPage',
  };

  return {
    provide: {
      typedRouter: router as TypedRouter,
      typedRoute: route as TypedRoute,
      routesNames,
    },
  };
});
