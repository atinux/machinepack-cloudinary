module.exports = {
  friendlyName: 'Upload Image',
  description: 'Upload image on Cloudinary (using streams).',
  inputs: {
    cloudName: {
      id: "f146b91d-fa3a-4a34-8dbf-62a344758c77",
      friendlyName: "Cloud Name",
      description: "Your Cloudinary cloud name key.",
      example: "abc",
      required: true,
    },
    apiKey: {
      id: "f8f2de9c-3f1e-4976-a83a-02654eeb549a",
      friendlyName: "API Key",
      description: "Your Cloudinary API key.",
      example: "abcd",
      required: true,

    },
    apiSecret: {
      id: "bf270f37-f916-4400-a1d6-0d5fb9debd83",
      friendlyName: "API Secret",
      description: "Your Cloudinary secret API key.",
      example: "abcd",
      required: true,
    },
    fieldName: {
      friendlyName: "Field Name",
      description: "Name of the field for uploading the file. Default: file",
      example: "/users/app/.upload/image.png",
      required: false,
      defaultsTo: "file",
    },
    imageOptions: {
      friendlyName: "Cloudinart Image Options",
      description: "Cloudinary options for converting the image before saving it to Cloudinary (ex: crop, width, height, etc.)",
      example: {},
      required: false,
      defaultsTo: {}
    }
  },
  exits: {
    error: {
      description: 'Error while uploading images on Cloudinary',
    },
    success: {
      id: "success",
      friendlyName: "then",
      description: "Cloudinary objects after upload.",
      example: [{
        public_id: 'cr4mxeqx5zb8rlakpfkg',
        version: 1372275963,
        signature: '63bfbca643baa9c86b7d2921d776628ac83a1b6e',
        width: 864,
        height: 576,
        format: 'jpg',
        resource_type: 'image',
        created_at: '2013-06-26T19:46:03Z',
        bytes: 120253,
        type: 'upload',
        url: 'http://res.cloudinary.com/demo/image/upload/v1372275963/cr4mxeqx5zb8rlakpfkg.jpg',
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1372275963/cr4mxeqx5zb8rlakpfkg.jpg'
      }]
    },
  },
  defaultExit: "success",
  fn: function(inputs, exits, env) {
    var cloudinary = require('cloudinary');
    cloudinary.config({
      cloud_name: inputs.cloudName,
      api_key: inputs.apiKey,
      api_secret: inputs.apiSecret
    });

    var files = [];
    var errors = [];

    function receive() {
      var receiver__ = require('stream').Writable({ objectMode: true });
      receiver__._write = function onFile(__newFile, _unused, done) {
        var uploadStream = cloudinary.uploader.upload_stream(function(result) {
          if (result && result.error) {
            errors.push(result.error);
            return done();
          }
          files.push(result);
          done();
        }, inputs.imageOptions);
        uploadStream.on('error', function (err) {
          errors.push({ message: 'Error on uploading the image, try again.' });
          return done();
        });
        __newFile.pipe(uploadStream);
      };
      return receiver__;
    }

    var filesStream = env.req.file(inputs.fieldName);
    filesStream.upload(receive(), function (err) {
      if (err) return exits.error(err);
      if (errors.length && !files.length) return exits.error(errors);
      exits.success(files);
    });
  },
  identity: "upload-image"
};
