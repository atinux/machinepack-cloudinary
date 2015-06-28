module.exports = {
  friendlyName: 'Delete Image',
  description: 'Delete an image on Cloudinary.',
  "inputs": {
    "cloudName": {
      "id": "1984556d-362b-40f7-9cdc-487e22496515",
      "friendlyName": "Cloud Name",
      "description": "Your Cloudinary cloud name key.",
      "example": "abc",
      "required": true,
      "addedManually": true
    },
    "apiKey": {
      "friendlyName": "API Key",
      "description": "Your Cloudinary API key.",
      "example": "abcd",
      "required": true,
      "addedManually": true
    },
    "apiSecret": {
      "friendlyName": "API Secret",
      "description": "Your Cloudinary secret API key.",
      "example": "abcd",
      "required": true,
      "addedManually": true
    },
    "imageId": {
      "friendlyName": "Image ID",
      "description": "Image ID on Cloudinary.",
      "example": "abc",
      "required": true,
      "addedManually": true
    }
  },
  "exits": {
    "error": {
      "example": undefined
    },
    "success": {
      "id": "success",
      "friendlyName": "then",
      "description": "Image deleted.",
      "void": true
    }
  },
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var cloudinary = require('cloudinary');

    cloudinary.config({
      cloud_name: inputs.cloudName,
      api_key: inputs.apiKey,
      api_secret: inputs.apiSecret
    });
    cloudinary.api.delete_resources([inputs.imageId], function(result) {
      if (result.error)
        return exits.error(result.error);
      exits.success();
    });
  },
  "identity": "delete-image"
};
