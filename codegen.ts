import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // Use GraphQL endpoint for full schema introspection
  // Start backend with: cd ../pursuit-backend && python manage.py runserver
  schema: "http://localhost:8000/graphql/",
  documents: [
    "graphql/queries.ts",
    "graphql/fragments.ts",
  ],
  generates: {
    "./graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        fragmentMasking: false,
      },
      config: {
        scalars: {
          DateTime: 'string',
          Date: 'string',
          Time: 'string',
          Decimal: 'number',
          UUID: 'string',
        },
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
