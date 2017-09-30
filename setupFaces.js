var request = require("request");

exports.setupFaces function(schoolName, azureApiKey) {
    //setufFaces(schoolName, azureApiKey)
    //schoolName is the name of the person group to create.
    //    it needs to be an alphanumeric string. Save this to use later.
    //azureApiKey is your Microsoft Azure Face API key.
    
    var subscriptionKey = azureApiKey;

    // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
    // a free trial subscription key, you should not need to change this region.
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/" + schoolName
    // Request parameters.
    var params = {};

    // Perform the REST API call.
    var options = { method: 'PUT',
      url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/' + schoolName,
      headers: 
       { 'cache-control': 'no-cache',
         'ocp-apim-subscription-key': azureApiKey,
         'content-type': 'application/json' },
      body: { name: schoolName, userData: 'optional' },
      json: true };

    request(options, function (error, response, data) {
      if (error) throw new Error(error);

      //console.log(data);
    });
};
  
//example usage and test:
//setupFaces("school4", "REPLACEME")
