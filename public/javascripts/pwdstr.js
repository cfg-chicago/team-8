$( document ).ready(function() {
  $('#password').on('propertychange change keyup paste input', function() {
    // TODO: only use the first 128 characters to stop this from blocking the browser if a giant password is entered
    var password = $(this).val();
    var passwordScore = zxcvbn(password)['score'];
    
    var updateMeter = function(width, background, text) {
      $('.password-background').css({"width": width, "background-color": background});
      $('.strength').text('Strength: ' + text).css('color', background);
    }
    
    if (passwordScore === 0) {
      if (password.length === 0) {
        updateMeter("0%", "#ffa0a0", "none");
      } else {
        updateMeter("20%", "#ffa0a0", "very weak");
      }
    }
    if (passwordScore == 1) updateMeter("40%", "#d12323", "weak");
    if (passwordScore == 2) updateMeter("60%", "#d18221", "medium");
    if (passwordScore == 3) updateMeter("80%", "#aed121", "strong");
    if (passwordScore == 4) updateMeter("100%", "#3bd121", "very strong"); // Color needs changing
    
  });
  
  // TODO: add ie 8/7 support, what browsers didnt support this check market share
  $('.show-password').click(function(event) {
    event.preventDefault();
    if ($('#password').attr('type') === 'password') {
      $('#password').attr('type', 'text');
      $('.show-password').text('Hide password');
    } else {
      $('#password').attr('type', 'password');
      $('.show-password').text('Show password');
    }
  });
  
});
