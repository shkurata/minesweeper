  $.ajax({
      //url: "http://192.168.23.124:1111/namenlijst",
      url: "http://127.0.0.1:1111/namenlijst",
      async: true, // 
      data: {},
      dataType: 'json'
  }).done(function(namen) {
      console.log(namen);
      for (var i = 0; i < namen.length; i++) {
          $("#dnNaam").append($("<option>").text(namen[i]).val(namen[i]));
      }
  })

  $.ajax({
      //url: "http://192.168.23.124:1111/namenlijst",
      url: "http://127.0.0.1:1111/rijen",
      async: true, // 
      data: {},
      dataType: 'json'
  }).done(function(rijen) {
      console.log("Dit zijn de rijen: " + rijen);
      for (var i = 0; i < rijen.length; i++) {
          $("#dnRij").append($("<option>").text(rijen[i]).val(rijen[i]));
      }
  })

  document.getElementById("dnRij").onchange = function() {
      $("#dnKolom").show();
      var idK = document.getElementById("dnKolom");
      verwijderOpties(idK, "selecteer kolommen");
      var indexR = document.getElementById("dnRij").selectedIndex;
      var geselecteerdeOptieR = document.getElementById("dnRij")[indexR].value;
      $.ajax({
          //url: "http://192.168.23.124:1111/namenlijst",
          url: "http://127.0.0.1:1111/kolommen",
          async: true, // 
          data: { "rij": geselecteerdeOptieR },
          dataType: 'json'
      }).done(function(kolommen) {
          for (var i = 0; i < kolommen.length; i++) {
              $("#dnKolom").append($("<option>").text(kolommen[i]._id).val(kolommen[i]._id));
          }
      })
  }

  document.getElementById("dnKolom").onchange = function() {
      $("#dnBom").show();
      var idB = document.getElementById("dnBom");
      verwijderOpties(idB, "selecteer bommen");
      var indexR = document.getElementById("dnRij").selectedIndex;
      var geselecteerdeOptieR = document.getElementById("dnRij")[indexR].value;
      var indexK = document.getElementById("dnKolom").selectedIndex;
      var geselecteerdeOptieK = document.getElementById("dnKolom")[indexK].value;
      $.ajax({
          //url: "http://192.168.23.124:1111/bommen",
          url: "http://127.0.0.1:1111/bommen",
          async: true, // 
          data: { "rij": geselecteerdeOptieR, "kolom": geselecteerdeOptieK },
          dataType: 'json'
      }).done(function(bommen) {
          console.log("Dit zijn de bommen: " + bommen);
          for (var i = 0; i < bommen.length; i++) {
              $('#dnBom').append($('<option>').text(bommen[i]._id).val(bommen[i]._id));
          }
      })
  }

  function verwijderOpties(id, tekst) {
      var aantalOpties = id.options.length;
      console.log("Dit is aantal opties: " + aantalOpties);
      for (var i = 0; i < aantalOpties; i++) {
          id.remove(0);
      }
      var defaultOptie = document.createElement('option');
      defaultOptie.text = tekst;
      defaultOptie.value = "";
      id.add(defaultOptie);
  }