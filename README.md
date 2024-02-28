# SHUKUN ETL

## Architecture

1. update data/configs to configure the SHUKUN Platform services.
2. open http://localhost:3666/api/generate/xxx to get the yaml.
3. copy or import yaml into the Airbyte to create custom connector.
4. then create source and connection in Airbyte and trigger data integration.

## Development

```
npm install
npm start
```
