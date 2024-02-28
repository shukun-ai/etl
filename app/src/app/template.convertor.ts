import { MetadataElectron, MetadataSchema } from '@shukun/schema';
import { StreamSchema, TemplateSchema } from './template.schema';

export const metadatasToTemplate = (
  metadatas: MetadataSchema[],
  context: { sourceName: string }
): TemplateSchema => {
  return {
    spec: {
      connection_specification: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object',
        required: ['convertor_url'],
        properties: {
          convertor_url: {
            title: 'convertor_url',
            description:
              'http://localhost:3000/api, http://host.docker.internal:3000/api',
            type: 'string',
            order: 0,
          },
        },
        additionalProperties: true,
      },
      type: 'Spec',
    },
    type: 'DeclarativeSource',
    check: {
      type: 'CheckStream',
      stream_names: metadatas.map((metadata) => metadata.name),
    },
    streams: metadatas.map((metadata) => metadataToStream(metadata, context)),
    version: '0.61.2',
    metadata: {
      autoImportSchema: {
        receive: false,
      },
    },
  };
};

export const metadataToStream = (
  metadata: MetadataSchema,
  context: { sourceName: string }
): StreamSchema => {
  return {
    name: metadata.name,
    type: 'DeclarativeStream',
    retriever: {
      type: 'SimpleRetriever',
      paginator: {
        type: 'DefaultPaginator',
        page_size_option: {
          type: 'RequestOption',
          field_name: 'limit',
          inject_into: 'request_parameter',
        },
        page_token_option: {
          type: 'RequestOption',
          field_name: 'offset',
          inject_into: 'request_parameter',
        },
        pagination_strategy: {
          type: 'OffsetIncrement',
          page_size: 1000,
          inject_on_first_request: true,
        },
      },
      requester: {
        path: `/query/${context.sourceName}/${metadata.name}`,
        type: 'HttpRequester',
        url_base: "{{ config['convertor_url'] }}",
        http_method: 'GET',
        authenticator: {
          type: 'NoAuth',
        },
        request_headers: {},
        request_body_json: {},
        request_parameters: {},
      },
      record_selector: {
        type: 'RecordSelector',
        extractor: {
          type: 'DpathExtractor',
          field_path: [],
        },
      },
      partition_router: [],
    },
    primary_key: ['id'],
    schema_loader: {
      type: 'InlineSchemaLoader',
      schema: {
        type: 'object',
        $schema: 'http://json-schema.org/schema#',
        properties: electronsToFields(metadata.electrons),
      },
    },
  };
};

const electronsToFields = (
  electrons: MetadataElectron[]
): Record<string, unknown> => {
  const fields: Record<string, unknown> = {
    id: { type: 'string' },
    createdAt: { type: ['string', 'null'], format: 'date-time' },
    updatedAt: { type: ['string', 'null'], format: 'date-time' },
    owner: { type: ['string', 'null'] },
  };

  electrons.forEach((electron) => {
    const field = electronToField(electron);

    if (!electron.isRequired) {
      field.type.push('null');
    }

    fields[electron.name] = field;
  });

  return fields;
};

const electronToField = (
  electron: MetadataElectron
): { type: string[]; format?: string } => {
  switch (electron.fieldType) {
    case 'Attachment':
    case 'Mixed':
      return { type: ['object'] };
    case 'Boolean':
      return { type: ['boolean'] };
    case 'Currency':
    case 'Float':
      return { type: ['number'] };
    case 'DateTime':
      return { type: ['string'], format: 'date-time' };
    case 'Integer':
      return { type: ['integer'] };
    case 'ManyToMany':
    case 'MultiSelect':
    case 'Role':
      return { type: ['array'] };
    case 'SingleSelect':
    case 'LargeText':
    case 'ManyToOne':
    case 'NameText':
    case 'Owner':
    case 'Password':
    case 'Text':
      return { type: ['string'] };
  }
};
