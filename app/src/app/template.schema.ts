import { z } from 'zod';

export const streamSchema = z.object({
  name: z.string(),
  type: z.string(),
  retriever: z.object({
    type: z.string(),
    paginator: z.object({
      type: z.string(),
      page_size_option: z.object({
        type: z.string(),
        field_name: z.string(),
        inject_into: z.string(),
      }),
      page_token_option: z.object({
        type: z.string(),
        field_name: z.string(),
        inject_into: z.string(),
      }),
      pagination_strategy: z.object({
        type: z.string(),
        page_size: z.number(),
        inject_on_first_request: z.boolean(),
      }),
    }),
    requester: z.object({
      path: z.string(),
      type: z.string(),
      url_base: z.string(),
      http_method: z.string(),
      authenticator: z.object({ type: z.string() }),
      request_headers: z.object({}),
      request_body_json: z.object({}),
      request_parameters: z.object({}),
    }),
    record_selector: z.object({
      type: z.string(),
      extractor: z.object({
        type: z.string(),
        field_path: z.array(z.unknown()),
      }),
    }),
    partition_router: z.array(z.unknown()),
  }),
  primary_key: z.array(z.string()),
  schema_loader: z.object({
    type: z.string(),
    schema: z.object({
      type: z.string(),
      $schema: z.string(),
      properties: z.record(z.string(), z.unknown()), 
    }),
  }),
});

export type StreamSchema = z.infer<typeof streamSchema>;

export const templateSchema = z.object({
  spec: z.object({
    type: z.string(),
    connection_specification: z.object({
      type: z.string(),
      $schema: z.string(),
      required: z.array(z.unknown()),
      properties: z.object({}),
      additionalProperties: z.boolean(),
    }),
  }),
  type: z.string(),
  check: z.object({ type: z.string(), stream_names: z.array(z.string()) }),
  streams: z.array(streamSchema),
  version: z.string(),
  metadata: z.object({ autoImportSchema: z.object({ receive: z.boolean() }) }),
});

export type TemplateSchema = z.infer<typeof templateSchema>;
