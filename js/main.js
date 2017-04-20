    // modified from https://pugjs.org/js/generic.js
!function r(e,t,n){function u(i,c){if(!t[i]){if(!e[i]){var f="function"==typeof require&&require;if(!c&&f)return f(i,!0);if(o)return o(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var a=t[i]={exports:{}};e[i][0].call(a.exports,function(r){var t=e[i][1][r];return u(t||r)},a,a.exports,r,e,t,n)}return t[i].exports}for(var o="function"==typeof require&&require,i=0;i<n.length;i++)u(n[i]);return u}({1:[function(r,e,t){"use strict";var n=r("pug"),u=function(r){if(r&&r.__esModule)return r;var e={};if(null!=r)for(var t in r)Object.prototype.hasOwnProperty.call(r,t)&&(e[t]=r[t]);return e.default=r,e}(n);r("../browser/menu.js"),window.pug=u},{"../browser/menu.js":1,pug:"pug"}]},{},[1]);


// load content.pug and render it
const load = function(){
    fetch('http://localhost:8080/content.pug', {
	method: 'get'
}).then(function(response) {
	response.text().then( function(value){
         document.body.innerHTML = pug.render(value);
         postProcessing();
    })
}).catch(function(err) {
	console.warn('An Error! ', err)
});
   
}

const postProcessing = function(){
    let proofs = document.querySelectorAll('.proof');
    for (let proof of proofs){
    let heading = proof.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) heading.innerHTML = "Proof " + heading.innerHTML.trim();
    else {
        // TODO look up hierarchy
        heading = document.createElement('h2');
        heading.innerHTML = 'Proof.';
        proof.insertBefore(heading, proof.firstChild);
    }
    }
    let theorems = document.querySelectorAll('theorem, corollary, proposition');
    let thmcounter = 0;
    for (let theorem of theorems){
    if (theorem.querySelector('h1, h2, h3, h4, h5')) continue;
    thmcounter++;
    let heading = document.createElement('h1');
    let name = theorem.tagName.trim();
    heading.innerHTML = name + ' ' + thmcounter;
    theorem.insertBefore(heading, theorem.firstChild);
    }

    let anchors = document.querySelectorAll('a[href^="#"]');

    let fillRef = function(anchor){
    let href = anchor.getAttribute('href');
    let id = href.substring(href.indexOf('#')+1);
    // console.log(id);
    let aTarget = document.getElementById(id);
    if (aTarget){
        let contentSource = aTarget.querySelector('h1, h2, h3, h4, h5, figcaption em');
        let content = contentSource.innerHTML || contentSource.id || id;
        anchor.innerHTML = content.trim();
    }
    else anchor.innerHTML = anchor.className + ': ' + id ;
    }

    for (let a of anchors) fillRef(a);

    // citations 
    let bib = {
    'EH': {
        'url': 'http://www.numdam.org/item?id=CM_1935__2__463_0',
        'mark': 'EH<sup>2</sup>',
        'html': ''
    }
    }
    let citations = document.querySelectorAll('.cite');
    let biblist = document.querySelector('#bibliography');
    for (let citation of citations){
    let key = citation.querySelector('a').getAttribute('data-key');
    let url = bib[key].url;
    let anchor = citation.querySelector('a');
    anchor.setAttribute('href', url);
    anchor.innerHTML = bib[key].mark;
    let bibitem = document.createElement('li');
    bibitem.appendChild(anchor.cloneNode(true));
    biblist.appendChild(bibitem);
    }

    // footnotes

    const handleFootnote = function(footnote, counter){
    footnote.id = 'fn-'+ counter; 
    let a = document.createElement('a');
    a.setAttribute('href', '#' + footnote.id);
    a.className = 'fnlink';
    a.id = 'fnlink-' + counter;
    a.innerHTML = `<sup>` + counter + `</sup>`;
    footnote.parentNode.insertBefore(a,footnote);
    let close = document.createElement('a');
    close.setAttribute('href', '#' + a.id);
    close.className = 'fnlink';
    close.innerHTML = '<sup aria-label="close footnote">✕</sup>';
    footnote.appendChild(close);
    }

    let footnotes = document.querySelectorAll('.footnote');
    for (let i = 0; i< footnotes.length; i++) handleFootnote(footnotes[i], i+1);

    // MathJax
    window.MathJax = {
    tex2jax: {
        inlineMath: [
        ['$', '$'],
        ["\\(", "\\)"]
        ],
        processEscapes: true
    },
    AuthorInit: function(){
        MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
    var MML = MathJax.ElementJax.mml,
        TEX = MathJax.InputJax.TeX;

    TEX.Definitions.macros.nicefrac = "myBevelFraction";

    TEX.Parse.Augment({
        myBevelFraction: function (name) {
        var num = this.ParseArg(name),
            den = this.ParseArg(name);
        this.Push(MML.mfrac(num,den).With({bevelled: true}));
        }
    });
    });
    }
    }
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_CHTML-full';
    document.getElementsByTagName('head')[0].appendChild(script);
}


window.onload = load; 
