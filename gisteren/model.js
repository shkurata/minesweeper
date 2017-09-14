'use strict';
/* config scherm */
/* top 3 & local storage */
/* tijdgerelateerd */

/* spel: default params voorzien indien géén "local storage" */

function Spel(spelersnaam, bommen = 5, rijen = 10, kolommen = 10) {
    var dit = this;
    dit.spelersnaam = spelersnaam;
    dit.config = {
        bommen: bommen,
        rijen: rijen,
        kolommen: kolommen
    }
    dit.speltijd = 0; // nodig wegens mog pauzeren
}

Spel.prototype.timer = function () {
    /* speltijd++ elke sec */
}

function Bord(config) {
    var dit = this;
    dit.bord = new Array(config.rijen).fill(new Array(config.kolommen));
    dit.bommen = config.bommen;
}

Bord.prototype.verdelingBommen = function () {
    // random bommen in vakjes steken
    var aantal = config.bommen
    do {
        var a = Math.floor(Math.random() * config.rijen);
        var b = Math.floor(Math.random() * config.kolommen);
        if (!this.bord[a][b].bom) {
            aantal--;
            this.bord[a][b].bom = true;
        }
    }
    while (aantal);
}

function Vakje() {
    var dit = this;
    dit.bom = false;
    dit.rechtsTeller = 0;
    dit.omgekeerd = false;
}

Vakje.prototype.omdraaien = function () {
    /*  addEventListener    links klik: bom ? BOOM : 'omdraaien'         */
    if (this.bom) {
        /* EINDE SPEL!!! - melding kapot, tonen bommen, stoppen timer, géén wegschrijven naar de server, etc */
    } else {
        /* omdraaien en wegvloeien, this.omgekeerd=true, hint cijfers, 'olievlek'  */
        this.omgekeerd = true;
    }
}

Vakje.prototype.plaatsVlagje = function () {
    /*        addEventListener    rechts klik: 1x = 'v', 2x = '?', 3x =reset teller
             */
    this.rechtsTeller++;
    /*  switch (rechtsTeller) {
         case 1:
         case 2:
         case 3: rechtsTeller = 0; break; */
    /* modulus */
    //}
}


// export { Spel, Bord, Vakje }