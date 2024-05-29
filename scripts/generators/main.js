// @ts-check
const fs = require('fs');
const hbs = require('handlebars');
const { cwd } = require('process');
const pluralize = require('pluralize');
const { startCase } = require('lodash');

const DEST_PATH = (mod) => cwd() + '/src/app/' + mod;
const ORIGIN_PATH = cwd() + '/scripts/generators/resources';
const FOLDERS = [
  'controllers',
  'dtos',
  'entities',
  'repositories',
  'services',
  'types',
];

const toTitleCase = (str) =>
  str.replace(
    /(^\w|\s\w)(\S*)/g,
    (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase(),
  );

const slugify = (string) => {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const toCamelCase = (/** @type {string} */ str) => {
  // Lower cases the string
  return (
    str
      .toLowerCase()
      // Replaces any - or _ characters with a space
      .replace(/[-_]+/g, ' ')
      // Removes any non alphanumeric characters
      .replace(/[^\w\s]/g, '')
      // Uppercases the first character in each group immediately following a space
      // (delimited by spaces)
      .replace(/ (.)/g, function ($1) {
        return $1.toUpperCase();
      })
      // Removes spaces
      .replace(/ /g, '')
  );
};

const compile = (
  /** @type {string} */ content,
  { className, variableName, fileName, modelName },
) => {
  const template = hbs.compile(content)({
    className: className,
    variableName: variableName,
    fileName: fileName,
    modelName,
  });
  return template;
};

async function main() {
  const term = (await import('inquirer')).default;

  const questions = [
    {
      type: 'input',
      name: 'name',
      message: "What's your feature name?",
    },
    {
      type: 'input',
      name: 'model',
      message: "What's your model name?",
    },
  ];
  term.prompt(questions).then((answers) => {
    const pluralizeText = pluralize(answers.name);
    const modelName = answers.model;
    const className = startCase(pluralizeText).replace(/ /g, '');
    const variableName = modelName.toLowerCase();

    const fileName = slugify(pluralizeText);

    const dest = DEST_PATH(fileName);

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    FOLDERS.forEach((folder) => {
      if (!fs.existsSync(`${dest}/${folder}`)) {
        fs.mkdirSync(`${dest}/${folder}`, { recursive: true });
      }
    });

    const files = [
      {
        path: `${dest}/index.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/index.hbs`, 'utf8'),
      },
      {
        path: `${dest}/${fileName}.module.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/module.hbs`, 'utf8'),
      },
      {
        path: `${dest}/controllers/index.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/controllers/index.hbs`,
          'utf8',
        ),
      },
      {
        path: `${dest}/controllers/${fileName}.controller.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/controllers/controller.hbs`,
          'utf8',
        ),
      },
      {
        path: `${dest}/services/index.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/services/index.hbs`, 'utf8'),
      },
      {
        path: `${dest}/services/${fileName}.service.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/services/service.hbs`, 'utf8'),
      },
      {
        path: `${dest}/dtos/index.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/dtos/index.hbs`, 'utf8'),
      },
      {
        path: `${dest}/dtos/create-${fileName}.dto.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/dtos/create.hbs`, 'utf8'),
      },
      {
        path: `${dest}/dtos/update-${fileName}.dto.ts`,
        content: fs.readFileSync(`${ORIGIN_PATH}/dtos/update.hbs`, 'utf8'),
      },
      {
        path: `${dest}/repositories/index.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/repositories/index.hbs`,
          'utf8',
        ),
      },
      {
        path: `${dest}/repositories/${fileName}.repository.ts`,
        content: fs.readFileSync(
          `${ORIGIN_PATH}/repositories/repository.hbs`,
          'utf8',
        ),
      },
    ];

    files.forEach((file) => {
      const out = compile(file.content, {
        className,
        variableName,
        fileName,
        modelName,
      });

      fs.writeFileSync(file.path, out);
    });
  });
}

main();
