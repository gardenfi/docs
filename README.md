# Garden Docs

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint) to preview the documentation changes locally. To install, use the following command

```
npm i -g mint
```

Run the following command at the root of your documentation (where docs.json is)

```
mint dev
```

Alternatively, you can run the development server without installing the CLI globally:

```
npx mintlify dev
```

#### Troubleshooting

- If the dev environment isn't running - Run `mint update` to ensure you have the most recent version of the CLI.
- Page loads as a 404 - Make sure you are running in a folder with `docs.json`
