import Joi from '@nerd/bundles/model/joi'

export default Joi.object({
  packages: Joi.array().items(Joi.string()),
  nodeVersion: Joi.number(),
  target: Joi.string().valid('node', 'browser'),
  moduleType: Joi.string().valid('esm', 'cjs'),
  runtimeHelpers: Joi.boolean(),
  extraBabelPlugins: Joi.array().items(Joi.any()),
  extraBabelPresets: Joi.array().items(Joi.any()),
  extraPostCSSPlugins: Joi.array().items(Joi.any()),
  nodeFiles: Joi.array().items(Joi.string()),
  browserFiles: Joi.array().items(Joi.string()),
  entry: Joi.string(),
  output: Joi.string(),
  lessOptions: Joi.object(),
  esBuild: Joi.boolean(),
  disableTypes: Joi.boolean(),
  beforeReadWriteStream: Joi.func(),
  afterReadWriteStream: Joi.func(),
  mountedReadWriteStream: Joi.func(),
  react: Joi.boolean(),
  paths: Joi.object(),
  mapSources: Joi.func(),
  afterHook: Joi.func(),
  sourcemap: Joi.boolean()
})
