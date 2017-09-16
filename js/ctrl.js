
app.controller('mijnenCtrl', ['$interval', '$timeout', '$http', '$mdDialog', function($interval, $timeout, $http, $mdDialog) {
  var self = this;
  this.naam = '';
  this.spel = null;
  this.progressBarValue = 0;
  this.interval = null;
  this.running = true;
  this.top3 = [];
  this.activeTab = 0;
  this.fullLijst = {};
  this.sortOptie = 'naam';
  // this.apiUrl = 'http://192.168.23.124:1111';
  this.apiUrl = 'http://localhost:1111';
  this.changeActiveTab = function(tabNum) {
    this.activeTab = tabNum;
  };
  this.kreegTop3 = function(naam, rijen, kolommen, bommen) {
    var url = this.apiUrl + '/deelnemers' +
      (naam ? '?naam=' + naam : '') +
      (rijen && kolommen && bommen ? '?rijen=' + rijen + '&kolommen=' + kolommen + '&bommen=' + bommen : '');
    $http.get(url)
    .then(function(response) {
      self.top3 = response.data.slice(0, 3);
    });
  };

  this.stuurData = function() {
    $http({
      method: 'post',
      url: this.apiUrl + '/nieuw',
      data:  {
        naam: this.spel.spelersnaam,
        tijd: this.spel.speltijd,
        rijen: this.spel.rijen,
        kolommen: this.spel.kolommen,
        bommen: this.spel.bommen
      }
    }).then(function(res) {
      self.kreegTop3('', self.rijen,self.kolommen,self.bommen);
      if (res.data[0] == 'J') {
        var spellerIndex = self.top3.findIndex( speller =>
          speller.naam == res.config.data.naam &&
          speller.rijen == res.config.data.rijen &&
          speller.kolommen == res.config.data.kolommen &&
          speller.bommen == res.config.data.bommen
         );
         self.top3[spellerIndex].bold = true;
      }
    }).then(function(res) {
    });
  };

  //omdraien met vertraging functies
  // this.tableReborn = function() {
  //   return this.spel.bord.map((rij, i) => rij.map((vak, j) => {
  //     vak.marked = false;
  //
  //     return vak;
  //   }));
  // };
  //
  // this.zoek = function(rij, kolom, array) {
  //   // var array = [];
  //   // while () {
  //   //
  //   // }
  //   var buurBommen = 0;
  //   var veiligeBuren = [];
  //   for (var i = rij - 1; i <= rij + 1; i++) {
  //       if (this.spel.bord[i]) {
  //           for (var j = kolom - 1; j <= kolom + 1; j++) {
  //               if (this.spel.bord[i][j]) {
  //                   if (this.spel.bord[i][j].bom) {
  //                       buurBommen++;
  //                   } else {
  //                       if (!this.spel.bord[i][j].marked) {
  //                           veiligeBuren.push([i, j]);
  //                       }
  //                   }
  //               }
  //           }
  //       }
  //   }
  //   this.spel.bord[rij][kolom].bomBuren = buurBommen;
  //   veiligeBuren = !buurBommen ? veiligeBuren : [];
  //   if (veiligeBuren.length) {
  //     veiligeBuren.forEach(koords => {
  //       var r = koords[0];
  //       var k = koords[1];
  //       if (!this.spel.bord[r][k].marked && this.spel.bord[r][k].symboolBepalen() != 'v') {
  //         this.spel.bord[r][k].marked = true;
  //         array.push(this.spel.bord[r][k]);
  //         this.zoek(r, k, array);
  //       }
  //     });
  //   }
  //
  //   return array;
  // };
  //
  // this.draaiVakjesTrager = function(vakjes) {
  //   vakjes.forEach(vak => vak.omgedraaid = true);
  //   // (function f(index, array) {
  //   //   if (index < array.length) {
  //   //     setTimeout(function() {
  //   //         array[index].omgedraaid = true;
  //   //       f(index + 1, array);
  //   //     }, 10);
  //   //   }
  //   // })(0, vakjes);
  // };

  this.rijSelChange = function() {
    $http.get(this.apiUrl + '/kolommen?rij=' + this.rijenSel)
    .then(function(response) {
      self.fullLijst.kolommen = response.data.map(val => +val._id);
    });
  };
  this.kolSelChange = function() {
    $http.get(this.apiUrl + '/bommen?rij=' + this.rijenSel + '&kolom=' + this.kolommenSel)
    .then(function(response) {
      self.fullLijst.bommen = response.data.map(val => +val._id);
    });
  };
  this.kreegNamenEnRijen = function() {
    $http.get(this.apiUrl + '/namenlijst')
    .then(function(response) {
      self.fullLijst.namen = response.data;
    });
    $http.get(this.apiUrl + '/rijen')
    .then(function(response) {
      self.fullLijst.rijen = response.data;
    });
  };

  this.startGame = function() {
    this.spel = new Spel(this.naam, this.bommen, this.rijen, this.kolommen);
    // this.spel.bord = this.tableReborn();
    this.saveConfig();
    this.kreegTop3('', self.rijen,self.kolommen,self.bommen);
    var progressBarInterval = $interval(function () {
      self.progressBarValue += 2;
    }, 5);
    $timeout(() => {
      self.changeActiveTab(2);
      $interval.cancel(progressBarInterval);
      this.running = true;
      this.progressBarValue = 0;
    }, 1000);
  };
  this.loadConfig = function() {
    var config = JSON.parse(localStorage.getItem('bordConfig'));
    this.rijen = config ? config.rijen : 10;
    this.kolommen = config ? config.kolommen : 10;
    this.bommen = config ? config.bommen : 10;
  };
  this.saveConfig = function() {
    var config = {
        rijen: this.rijen,
        kolommen: this.kolommen,
        bommen: this.bommen
    };
    localStorage.setItem('bordConfig', JSON.stringify(config));
};
  this.handleLC = function(x, y) {
    if (this.running) {
      this.startTimer(this.spel.timer.starten);
      // if (!this.spel.bord[x][y].omgedraaid && this.spel.bord[x][y].symboolBepalen() != 'v') {
      //   if (this.spel.bord[x][y].bom) {
      //     this.spel.einde = true;
      //   }  else {
      //     this.spel.bord[x][y].omgedraaid = true;
      //     this.draaiVakjesTrager(this.zoek(x, y, []));
      //   }
      // }
      this.spel.vakjeOmdraaien(x, y);
      if (this.spel.einde) {
        this.toonAlleBommen();
        this.stopTimer();
        this.showAlert('Booommmmmm!!!', 'You lose!!!');
        console.log(this.spel.speltijd,  !this.interval , !this.spel.einde);
      }
    }
  };

  this.toonAlleBommen = function() {
    this.spel.bomCoords.forEach(koords => this.spel.bord[koords[0]][koords[1]].omgedraaid = true);
  };
  this.handleRC = function(vak) {
    if (this.running && !vak.omgedraaid) {
      this.startTimer(this.spel.timer.starten);
      var currVal = vak.symboolBepalen();
      vak.vlag();
      if (vak.symboolBepalen() == 'v') {
        this.spel.markedVakjes++;
      } else {
        if (currVal == 'v') {
          this.spel.markedVakjes--;
        }
      }
      this.spel.winControle();
      if (this.spel.einde) {
        this.stopTimer();
        this.showAlert('Congratulations!!!', 'You win!!!');
        this.stuurData();

        this.changeActiveTab(1);
        console.log(self.top3);
      }
    }
  };
  this.startTimer = function (func) {
    this.running = true;
    if (!this.interval) {
      func();
      this.interval = $interval(() => {
              this.spel.speltijd = this.spel.timer.seconden;
          }, 1000)
    }
  };
  this.stopTimer = function () {
    this.spel.timer.stoppen();
    $interval.cancel(this.interval);
    this.interval = null;
    this.running = false;
  };

  this.showAlert = function(title, text) {
      alert = $mdDialog.alert({
        title: title,
        textContent: text,
        ok: 'Close'
      });

      $mdDialog
        .show( alert )
        .finally(function() {
          alert = undefined;
        });
  };

  this.loadConfig();
  this.kreegNamenEnRijen();

}]).config(function($mdIconProvider) {
    $mdIconProvider
      .icon('play', 'images/ic_play_arrow_black_24px.svg', 24)
       .icon('pause', 'images/ic_pause_circle_filled_black_24px.svg', 24)
   });

app.directive('ngRightClick', function($parse) {
  return function(scope, element, attrs) {
    var fn = $parse(attrs.ngRightClick);
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
        fn(scope);
      });
    });
  };
});
