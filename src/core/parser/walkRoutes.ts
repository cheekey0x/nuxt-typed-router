import { NuxtPage } from '@nuxt/schema';
import { camelCase } from 'lodash-es';
import { GeneratorOutput, ParamDecl } from '../../types';
import { isItemLast } from '../../utils';
import { moduleOptionStore } from '../config';
import { extractUnMatchingSiblings } from './extractChunks';
import { extractRouteParamsFromPath, replaceParamsFromPathDecl } from './params';

type WalkThoughRoutesParams = {
  route: NuxtPage;
  level: number;
  siblings?: NuxtPage[];
  parent?: NuxtPage;
  previousParams?: ParamDecl[];
  output: GeneratorOutput;
  isLast: boolean;
};

function createKeyedName(route: NuxtPage, parent?: NuxtPage): string {
  const splittedPaths = route.path.split('/');
  const parentPath = splittedPaths[splittedPaths.length - 1];
  if (parent) {
    return camelCase(parentPath || 'index');
  } else {
    return camelCase(route.path.split('/').join('-') || 'index');
  }
}

function createNameKeyFromFullName(route: NuxtPage, level: number, parentName?: string): string {
  let splitted: string[] = [];
  splitted = route.name?.split('-') ?? [];
  splitted = splitted.slice(level, splitted.length);
  if (splitted[0] === parentName) {
    splitted.splice(0, 1);
  }

  const keyName = route.path === '' ? 'index' : camelCase(splitted.join('-')) || 'index';

  return keyName;
}

/** Will check if the is a route generated by @nuxtjs/i18n */
function hasi18nSibling(
  source: Array<Record<string, any> & { name?: string; path: string }>,
  route: NuxtPage
) {
  const { i18n, i18nOptions } = moduleOptionStore;
  if (i18n) {
    const separator = i18nOptions?.routesNameSeparator ?? '___';
    return source.some((rt) => {
      return (
        route.name?.match(new RegExp(`^(${rt.name})${separator}[a-zA-Z]+`, 'g')) ||
        (rt.path !== '/' && route.path?.match(new RegExp(`/?[a-zA-Z]+${rt.path}`, 'g')))
      );
    });
  }
  return false;
}

function modifyRoutePrefixDefaultIfI18n(route: NuxtPage) {
  const { i18n, i18nOptions } = moduleOptionStore;
  if (i18n && route.name) {
    const separator = i18nOptions?.routesNameSeparator ?? '___';
    const routeDefaultRegXp = new RegExp(
      `([a-zA-Z-]+)${separator}[a-zA-Z]+${separator}default`,
      'g'
    );
    const match = routeDefaultRegXp.exec(route.name);
    if (match) {
      const [_, routeName] = match;
      route.name = routeName;
    }
  }
}

/** Mutates the output object with generated routes */
export function walkThoughRoutes({
  route,
  level,
  siblings,
  parent,
  previousParams,
  output,
  isLast,
}: WalkThoughRoutesParams) {
  modifyRoutePrefixDefaultIfI18n(route);

  // Filter routes added by i18n module
  if (!hasi18nSibling(output.routesPaths, route)) {
    const newPath = `${parent?.path ?? ''}${
      route.path.startsWith('/') ? route.path : `/${route.path}`
    }`;
    output.routesPaths.push({
      name: route.name,
      typePath: replaceParamsFromPathDecl(newPath),
      path: newPath,
    });

    if (route.children?.length) {
      // - Route with children

      let childrenChunks = route.children;
      let nameKey = createKeyedName(route, parent);
      const allRouteParams = extractRouteParamsFromPath(route.path, false, previousParams);

      const newRoute = { ...route, name: nameKey, path: newPath } satisfies NuxtPage;

      // Output
      output.routesObjectTemplate += `${nameKey}:{`;
      output.routesDeclTemplate += `"${nameKey}":{`;

      // Recursive walk though children
      childrenChunks?.map((routeConfig, index) =>
        walkThoughRoutes({
          route: routeConfig,
          level: level + 1,
          siblings: extractUnMatchingSiblings(route, siblings),
          parent: newRoute,
          previousParams: allRouteParams,
          output,
          isLast: isItemLast(childrenChunks, index),
        })
      );
      // Output
      output.routesObjectTemplate += '},';
      output.routesDeclTemplate += `}${isLast ? '' : ','}`;
    } else if (route.name) {
      // - Single route

      let keyName = createNameKeyFromFullName(route, level, parent?.name);

      output.routesObjectTemplate += `'${keyName}': '${route.name}' as const,`;
      output.routesDeclTemplate += `"${keyName}": "${route.name}"${isLast ? '' : ','}`;
      output.routesList.push(route.name);

      // Params
      const isIndexFileForRouting = route.path === '';
      const allRouteParams = extractRouteParamsFromPath(
        route.path,
        isIndexFileForRouting,
        previousParams
      );
      output.routesParams.push({
        name: route.name,
        params: allRouteParams,
      });
    }
  }
}
