var request = require("request");

exports.addUser = function(username, imageurl, schoolName, azureApiKey) {
    //addUser 
    // username is the string of the user to be added
    // imageurl is the address of the new user's headshot which will be referenced in facial recognition  software.
    // schoolname is what is returned by setupFaces(). 
    // azureApiKey is your Microsoft Azure face API key.
    // returns personId which should be stored as an attribute of the user.
    
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/" + schoolName + "/persons"

    var params = {};

    // Perform the REST API call.
    var options = { method: 'POST',
        url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/' + schoolName + '/persons',
        headers: 
         { 'cache-control': 'no-cache',
           'ocp-apim-subscription-key': azureApiKey,
           'content-type': 'application/json' },
        body: { name: username, userData: 'optional' },
        json: true };

      request(options, function (error, response, data) {
        if (error) throw new Error(error);
        personId = data["personId"];
        //console.log(data);
        
        
        //add photo to user
        var options = { method: 'POST',
          url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/'+ schoolName + '/persons/' + personId + '/persistedFaces',
          headers: 
           { 'cache-control': 'no-cache',
             'ocp-apim-subscription-key': azureApiKey,
             'content-type': 'application/json' },
          body: { url: imageurl },
          json: true };

        request(options, function (error, response, data) {
          if (error) throw new Error(error);

          //console.log(data);
          
          //have the dataset retrain based on this new picture
          var options = { method: 'POST',
            url: 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/' + schoolName + '/train',
            headers: 
             { 'cache-control': 'no-cache',
               'ocp-apim-subscription-key': azureApiKey } };

          request(options, function (error, response, data) {
            if (error) throw new Error(error);
            return personId;
            //console.log(data);
          });

        });

      });

}       
  
//test it
//addUser("test2", "https://creationsciencestudy.files.wordpress.com/2014/02/michael-jackson.jpg", "wff", "CHANGEME")
