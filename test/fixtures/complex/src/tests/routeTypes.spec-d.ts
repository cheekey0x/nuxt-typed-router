import { useRoute } from '@typed-router';
import { array, optional, required } from '../../../../utils/typecheck';

export const route = useRoute();

// @ts-expect-error
const params: Record<string, any> = route.params; // Params are unknown

if (route.name === 'index') {
  // @ts-expect-error
  required(route.params.id);
}

// ---- [id].vue

if (route.name === 'user-id') {
  // @ts-expect-error
  required(route.params.foo);

  required(route.params.id);
}

// ---- [foo]-[[bar]].vue

if (route.name === 'user-foo-bar') {
  // @ts-expect-error
  required(route.params.id);

  optional(route.params.bar);

  required(route.params.foo);
}

// ---- [...slug].vue

if (route.name === 'user-slug') {
  // @ts-expect-error
  required(route.params.id);

  // @ts-expect-error
  required(route.params.slug);

  array(route.params.slug);
}

// ---- [one]-foo-[two].vue

if (route.name === 'user-one-foo-two') {
  // @ts-expect-error
  required(route.params.id);

  required(route.params.one);

  required(route.params.two);
}
// ---- [id]/[slug].vue

if (route.name === 'user-id-slug') {
  // @ts-expect-error
  required(route.params.foo);

  required(route.params.id);

  required(route.params.slug);
}
