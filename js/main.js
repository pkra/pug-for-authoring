// modified from https://pugjs.org/js/generic.js
!function r(e,t,n){function u(i,c){if(!t[i]){if(!e[i]){var f="function"==typeof require&&require;if(!c&&f)return f(i,!0);if(o)return o(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var a=t[i]={exports:{}};e[i][0].call(a.exports,function(r){var t=e[i][1][r];return u(t||r)},a,a.exports,r,e,t,n)}return t[i].exports}for(var o="function"==typeof require&&require,i=0;i<n.length;i++)u(n[i]);return u}({1:[function(r,e,t){"use strict";var n=r("pug"),u=function(r){if(r&&r.__esModule)return r;var e={};if(null!=r)for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e.default=r,e}(n);r("../browser/menu.js"),window.pug=u},{"../browser/menu.js":1,pug:"pug"}]},{},[1]);


// load content.pug and render it
let url = window.location.href.substr(0, location.href.lastIndexOf("/") + 1) + '/content.pug'
const load = function(){
    fetch(url, {
	method: 'get'
}).then(function(response) {
	response.text().then( function(value){
        document.getElementById('input').value = value;
        render();
    })
}).catch(function(err) {
	console.warn('An Error! ', err)
});

document.getElementById("input").addEventListener("input", function() {
    render();
}, false);
}

const render = function(){
    let result = false;
    try {
        result = pug.render(document.getElementById('input').value);
    }
    catch(e){console.log(e)}
    if (result) {
        document.getElementById('output').innerHTML = result;
        postProcessing();
    }
}
window.onload = load;
