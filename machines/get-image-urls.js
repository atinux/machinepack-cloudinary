module.exports = {
  friendlyName: 'Get Image URLS',
  description: 'Get Image URLS from Cloudinary based on Image ID.',
  inputs: {
    cloudName: {
      friendlyName: "Cloud name",
      description: "Your Cloudinary cloud name key.",
      example: "abc",
      required: true,
    },
    apiKey: {
      friendlyName: "API Key",
      description: "Your Cloudinary API key.",
      example: "abcd",
      required: true,
    },
    apiSecret: {
      friendlyName: "API Secret",
      description: "Your Cloudinary secret API key.",
      example: "abcd",
      required: true,
    },
    imageId: {
      friendlyName: "Image ID",
      description: "Image ID on Cloudinary.",
      example: "abc",
      required: true,
    },
    options: {
      id: "fb853ccc-7c4f-4492-9961-a5a3f890c8e4",
      friendlyName: "Image options",
      description: "Image options : http://cloudinary.com/documentation/node_image_manipulation",
      example: {},
      required: false,
      defaultsTo: {}
    }
  },
  exits: {
    error: {},
    success: {
      id: "success",
      friendlyName: "then",
      description: "HTTP and HTTPS links to image.",
      example: {
        http: "url",
        https: "url"
      }
    }
  },
  defaultExit: "success",
  fn: function(inputs, exits, env) {
    var cloudinary = require('cloudinary');

    cloudinary.config({
      cloud_name: inputs.cloudName,
      api_key: inputs.apiKey,
      api_secret: inputs.apiSecret
    });
    inputs.options.secure = false;
    var http = cloudinary.url(inputs.imageId, inputs.options);
    inputs.options.secure = true;
    var https = cloudinary.url(inputs.imageId, inputs.options);
    exits.success({
      http: http,
      https: https
    });
  },
  identity: "get-image-urls"
};
