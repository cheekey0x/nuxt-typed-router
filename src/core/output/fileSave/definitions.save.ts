import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { GeneratorOutput } from '../../../types';
import { moduleOptionStore } from '../../config';
import { processPathAndWriteFile } from '../../fs';
import {
  createIndexFile,
  createNavigateToFile,
  createTypedRouterFile,
  createRoutesTypesFile,
  createUseTypedRouterFile,
  createTypeUtilsRuntimeFile,
  createUseTypedRouteFile,
  createTypedRouterDefinitionFile,
  createi18nRouterFile,
  createPathsFiles,
  createDefinePageMetaFile,
  createHelpersFile,
} from '../generators/files';

import { watermarkTemplate } from '../static';

let previousGeneratedRoutes = '';
let firstRun = false;

type SaveGeneratedFiles = {
  outputData: GeneratorOutput;
};

export async function saveGeneratedFiles({ outputData }: SaveGeneratedFiles): Promise<void> {
  const { i18n } = moduleOptionStore;
  const filesMap: Array<{ fileName: string; content: string }> = [
    {
      fileName: '__useTypedRouter.ts',
      content: createUseTypedRouterFile(),
    },
    {
      fileName: '__useTypedRoute.ts',
      content: createUseTypedRouteFile(),
    },
    {
      fileName: '__paths.d.ts',
      content: createPathsFiles(outputData),
    },
    {
      fileName: `__routes.ts`,
      content: createRoutesTypesFile(outputData),
    },
    {
      fileName: `__helpers.ts`,
      content: createHelpersFile(),
    },
    {
      fileName: '__navigateTo.ts',
      content: createNavigateToFile(),
    },
    {
      fileName: '__definePageMeta.ts',
      content: createDefinePageMetaFile(),
    },
    {
      fileName: `__router.d.ts`,
      content: createTypedRouterFile(),
    },
    {
      fileName: `__types_utils.d.ts`,
      content: createTypeUtilsRuntimeFile(),
    },
    {
      fileName: `typed-router.d.ts`,
      content: createTypedRouterDefinitionFile(),
    },
    {
      fileName: 'index.ts',
      content: createIndexFile(),
    },
  ];

  if (i18n) {
    filesMap.push({
      fileName: '__i18n-router.ts',
      content: createi18nRouterFile(),
    });
  }

  await Promise.all(
    filesMap.map(({ content, fileName }) => {
      const waterMakeredContent = `
        ${watermarkTemplate}

        ${content}
      `;
      return processPathAndWriteFile({ content: waterMakeredContent, fileName });
    })
  );
  if (previousGeneratedRoutes !== outputData.routesList.join(',')) {
    previousGeneratedRoutes = outputData.routesList.join(',');
    console.log(logSymbols.success, `Router autocompletions generated 🚦`);
    if (!firstRun) {
      firstRun = true;
      console.log(
        logSymbols.warning,
        chalk.yellow(
          `Route path autocomplete is still experimental. You can disable it with the "nuxtTypedRouter.experimentalPathCheck: false" option`
        )
      );
    }
  }
}
