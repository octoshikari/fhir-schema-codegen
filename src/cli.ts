#!/usr/bin/env node

import { Command } from 'commander';
import { TypeScriptGenerator } from './generators/typescript';
import path from 'path';
import fs from 'fs';


const generators = {
  typescript: TypeScriptGenerator
}

const program = new Command();

program
  .name('fhirschema-codegen')
  .description('Generate code from FHIR Schema')
  .version('0.1.0');

program.command('help')
  .description('Display help information')
  .action(() => {
    program.help();
  });

program.command('generate')
  .description('Generate code from FHIR Schema')
  .requiredOption('--generator <type>', 'Generator type (typescript)')
  .requiredOption('--output <dir>', 'Output directory')
  .requiredOption('--package <package>', 'FHIR package name')
  .option('--generateClasses', 'Generate classes instead of interfaces (typescript only)')
  .action(async (options) => {
    const outputDir = path.resolve(process.cwd(), options.output);
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    switch (options.generator) {
      case 'typescript':
            const generator = new generators.typescript({
          outputDir,
          generateClasses: options.generateClasses
        });
        await generator.generate();
        break;
      default:
        console.error(`Unknown generator: ${options.generator}`);
        process.exit(1);
    }
  });

program.parse();