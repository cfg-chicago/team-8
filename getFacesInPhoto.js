var request = require("request");
//require('request').debug = true //turn on for debugging mode

exports.getFacesInPhoto = function(imageurl, schoolName, azureApiKey) {
    var confidence = '.65'; //only returns user ID's if they're above this confidence level.
    var subscriptionKey = azureApiKey;

    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect"

    var params = {};

    // Perform the REST API call.
    var options = { method: 'POST',
      url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect',
      headers: 
       { 'cache-control': 'no-cache',
         'ocp-apim-subscription-key': subscriptionKey,
         'content-type': 'application/json' },
      body: { url: imageurl },
      json: true };

    request(options, function (error, response, data) {
      if (error) throw new Error(error);

      len = data.length;
      faceIds = []
      //console.log(data);
      for(var i = 0; i < len; i++) {
        //console.log(data[i]["faceId"]);
        faceIds.push(data[i]["faceId"]);
      }
      
      
      //check if any of the identified faces are logged
      var options = { method: 'POST',
        url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify',
        headers: 
         { 'cache-control': 'no-cache',
           'ocp-apim-subscription-key': subscriptionKey,
           'content-type': 'application/json' },
        body: 
         { faceIds: faceIds,
           personGroupId: schoolName,
           confidenceThreshold: confidence },
        json: true };

      request(options, function (error, response, data) {
        if (error) throw new Error(error);
        
        toreturn = [];
        for(i=0; i<data.length;i++) {
          if(data[i]["candidates"].length > 0) {
            //console.log(data[i]["candidates"][0]["personId"]);
            toreturn.push(data[i]["candidates"][0]["personId"]);
          }
        }
        //console.log(toreturn[0]);
        
        return toreturn;
      });
    });
}

//test it
//getFacesInPhoto("https://media.bizj.us/view/img/10294641/unspecified*750xx1001-1335-87-0.jpg", "wff", "REPLACEME")
