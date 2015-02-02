'use strict';

var vForm = document.getElementById('mgform');
var vInput = document.getElementById('mail');

vForm.onsubmit = function() {
  if(this.hid === 'bulk') {
    location = '/mail/submit/' + encodeURIComponent(vInput.value);
  }
  if(this.hid === 'list') {
    location = '/mail/validate/' + encodeURIComponent(vInput.value);
  }
  if(this.hid === 'invoice') {
    location = '/mail/invoice/' + encodeURIComponent(vInput.value);
  }

  return false;
};