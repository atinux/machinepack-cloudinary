module.exports = {
  friendlyName: 'Upload Image',
  description: 'Upload image on Cloudinary.',
  "inputs": {
    "cloudName": {
      "id": "f146b91d-fa3a-4a34-8dbf-62a344758c77",
      "friendlyName": "Cloud Name",
      "description": "Your Cloudinary cloud name key.",
      "example": "abc",
      "required": true,
      "addedManually": true
    },
    "apiKey": {
      "id": "f8f2de9c-3f1e-4976-a83a-02654eeb549a",
      "friendlyName": "API Key",
      "description": "Your Cloudinary API key.",
      "example": "abcd",
      "required": true,
      "addedManually": true
    },
    "apiSecret": {
      "id": "bf270f37-f916-4400-a1d6-0d5fb9debd83",
      "friendlyName": "API Secret",
      "description": "Your Cloudinary secret API key.",
      "example": "abcd",
      "required": true,
      "addedManually": true
    },
    "path": {
      "friendlyName": "File path",
      "description": "Path of the local file to be uploaded to Cloudinary",
      "example": "/users/app/.upload/image.png",
      "required": true,
      "addedManually": true
    },
    "deleteFileAfterUpload": {
      "friendlyName": "Delete local file after upload",
      "description": "Delete the local file after uploading it on Cloudinary.\nDefault: false",
      "example": "",
      "required": false,
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
      "description": "Details on the file uploaded on Cloudinary.",
      "example": {
        "id": "cloudinary_image_id",
        "http": "cloudinary_http_url",
        "https": "cloudinary_https_url"
      }
    },
    "invalid": {
      "friendlyName": "Invalid type",
      "description": "If file given is not a valid image.",
      "example": "Invalid type"
    }
  },
  "defaultExit": "success",
  "fn": function(inputs, exits, env) {
    var cloudinary = require('cloudinary');
    var fs = require('fs');

    cloudinary.config({
      cloud_name: inputs.cloudName,
      api_key: inputs.apiKey,
      api_secret: inputs.apiSecret
    });
    cloudinary.uploader.upload(inputs.path, function(result) {
      // Delete file
      if (inputs.deleteFileAfterUpload) {
        fs.unlink(inputs.path, function(err) {});
      }
      // Error
      if (result.error) {
        if (result.error.http_code === 400)
          return exits.invalid(result.error.message);
        return exits.error(result.error);
      }
      // Return file id
      exits.success({
        id: result.public_id,
        http: cloudinary.url(result.public_id),
        https: cloudinary.url(result.public_id, {
          secure: true
        }),
      });
    });
  },
  "identity": "upload-image"
};
