'use strict';
var toetsenbord = require('readline-sync');
var modSpel = require('./modelSpel.js');
var spel = new modSpel("Joske");

function SpelConsole(spelObj) {
  this.spel = spelObj;
}

SpelConsole.prototype.toonBord = function () {
  var bord = '';
  this.spel.bord.forEach(rij => {
    rij.forEach(vak => {
      bord += vak.omgedraaid ? ' ' + vak.bomBuren : vak.symboolBepalen() == '' ? ' .' : ' ' + vak.symboolBepalen();
    });
    bord += '\t\t\t\t';
    rij.forEach(vak => {
      bord +=  vak.bom ? ' x' : ' .';
    });
    bord += '\n';
  });
  console.log(bord);
};

SpelConsole.prototype.omdraaien = function (rij, kolom) {
  this.spel.vakjeOmdraaien(rij, kolom);
};

SpelConsole.prototype.markeren = function (rij, kolom) {
  this.spel.bord[rij][kolom].vlag();
};

function controlRL(tekst) {
  var type = toetsenbord.question(tekst)
  if (type.toLowerCase() !== 'l' && type.toLowerCase() !== 'r') {
    return controlRL(tekst);
  }
  return type;
}

function controlRK(tekst, getal) {
  var result = toetsenbord.question(tekst);
  if (result > getal || result < 0) {
    return controlRK(tekst, getal);
  }
  return parseInt(result, 10);
}

var cbord = new SpelConsole(spel);

do {
  cbord.toonBord();
  var knopType = controlRL('Kies R voor rechte en L voor linke knop: ');
  var rij = controlRK('Voer het rijnummer in: ', cbord.spel.rijen);
  var kolom = controlRK('Voer het kolomnummer in: ', cbord.spel.rijen);
  if (knopType.toLowerCase() == 'l') {
    cbord.omdraaien(rij, kolom);
  } else {
    cbord.markeren(rij, kolom);
  }
} while (!cbord.spel.einde);

console.log('BOOOOOMMMMM!!!');
cbord.toonBord();
