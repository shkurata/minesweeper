/* $(function () {
    
}) */
/* Tip verder werker: NodeJSvoorFEO, p. 13:
Property query van de eerste parameter van de callback functie van methode get stelt de waarden van de doorgestuurde invoervelden voor. (of juister: van de querystring, dit is in de url van een request het gedeelte na het vraagteken, dat bestaat uit key-value paren)
Om hetzelfde te doen als de form naar de server gestuurd is via een POST, moeten we vooraf module body-parser installeren (npm install body-parser) en gebruiken: */

$(function () {

    var spel;
    var interval;
    var timer;
    var tellerV;
    var spel, bommen, rijen, kolommen;
    // haalUitLocalStorage();

    var start = $("#btnStart");


    spelersnaam = $("#invoerNaam").val(),
        bommen = +$("#invoerBommen").val(),
        rijen = +$("#invoerRijen").val(),
        kolommen = +$("#invoerKolommen").val(),
        tellerV = 0;

    if (1 > bommen || bommen >= rijen * kolommen) {

        // if (($('#invoerBommen').val() < 1) || $('#invoerRijen').val() * ($('#invoerKolommen').val() <= $('#invoerBommen').val())) {
        // als variabele wordt opgeroepen ipv $('#xyz') wérkt dit niet door toegekenning(?)
        alert('Gelieve het spelidee te respecteren')
    } else {
        $("#showBombs").html("Resterende bommen: " + bommen);
        spel = new Spel(spelersnaam, bommen, rijen, kolommen);
        bouwVeld(bommen, rijen, kolommen);
        timer = new MijnTimer();
        bewaarGegevens();
        // TODO
        // hier bijzetten
        $('#btnPauzeer').on('click', pauze(timer));
        $('#btnHerneem').on('click', herneem());
    }

    function bouwVeld(bommen, rijen, kolommen) {
        $("#spelletje").remove();
        $("#divSpelbord").append($("<table>").attr("id", "spelletje"));
        for (var i = 0; i < rijen; i++) {
            $('#spelletje').append($('<tr>').attr('id', i));
            for (var y = 0; y < kolommen; y++) {
                voegTDToe(i, y);
            }
        }
    }

    function voegTDToe(r, k) {
        $('#' + r).append($('<td>')
            .attr('id', r + "_" + k)
            .on('click', function (e) {
                var rij = parseInt(this.id.split("_")[0]),
                    kolom = parseInt(this.id.split("_")[1]);
                if (spel.bord[r][k].symboolBepalen() != 'v') {
                    // $('#'+this.id).attr ???;
                    spel.vakjeOmdraaien(r, k);
                    grafischeWeergaveAanpassen();
                    controleerEindeSpel();
                }
            })
            .on('contextmenu', function () {

                var rij = this.id.split('_')[0]
                var kolom = this.id.split('_')[1]
                spel.bord[rij][kolom].vlag()
                $("#" + this.id).html(spel.bord[rij][kolom].symboolBepalen())
                if (spel.bord[rij][kolom].symboolBepalen() == 'v') {
                    tellerV++;
                    spel.markedVakjes++;
                    $(this).addClass('alert');
                } else if (spel.bord[rij][kolom].symboolBepalen() == '?') {
                    tellerV--;
                    spel.markedVakjes--;
                    $(this).removeClass('alert');
                    $(this).addClass('warning');
                } else {
                    $(this).removeClass('warning');
                }
                spel.winControle();
                controleerEindeSpel();

                resterendeBommenTonen();
            })
        )
    }

    function grafischeWeergaveAanpassen() {
        for (var i = 0; i < spel.bord.length; i++) {
            for (var y = 0; y < spel.bord[i].length; y++) {
                if (spel.bord[i][y].omgedraaid) {
                    $('#' + i + '_' + y).attr('class', 'gedraaid')
                }
                if (spel.bord[i][y].bomBuren) {
                    //bomburen opsporen
                    $('#' + i + '_' + y).html(spel.bord[i][y].bomBuren)
                }
            }
        }
    }

    function controleerEindeSpel() {
        console.log("spel: " + spel);
        console.log("spel.bomBuren: " + spel.bomBuren);
        if (spel.win || spel.boem) {
            console.log("win: " + spel.win);
            console.log("boem: " + spel.boem);
            timer.stoppen();
        }
    }

    function resterendeBommenTonen() {
        $("#showBombs").html("Resterende bommen: " + (bommen - tellerV));
    }
    function newTimer() {
        start.on('click', function () {
            timer = new MijnTimer();
            interval = setInterval(function () {
                $("#showTime").html("Verstreken tijd: " + timer.seconden);
            }, 1000);
            $("#speelveld").one("mousedown", function () {
                console.log('timer: ' + timer)
                timer.starten();
            });
        })
    };
    function pauze(timer) {
        console.log("timer: " + timer)
        timer.stoppen();
        $("#divSpelbord").prepend($('<img>').attr("src", "Images/pauze.gif"))
        $("#speelveld").hide()

    }
    function herneem() {

    }

    //             console.log(spel.bord);
    function bewaarGegevens() {
        var config = {
            "bommen": bommen,
            "rijen": rijen,
            "kolommen": kolommen
        }
        // bewaarInLocalStorage(config);
        localStorage.setItem("configuratie", JSON.stringify(config));
    }
    //             timer = new MijnTimer();


    //             $("#btnPauzeer").click(function () {
    //             });


    //             $("#btnHerneem").click(function () {
    //                 timer.hernemen();
    //                 $("#divSpelbord").show();
    //                 $("#divSpelbord>img").remove()
    //                 $("#speelveld").show()
    //             });

    //             function controleerEindeSpel() {
    //                 // console.log(spel.boem);
    //                 if (spel.win || spel.boem) {
    //                     timer.stoppen();
    //                 }
    //             }

    //             function bewaarInLocalStorage(config) {
    //                 localStorage.setItem("configuratie", JSON.stringify(config));
    //             }

    //             $('#getIt').click(function () {

    //                 var naam = $("#dnNaam").val(),
    //                     bom = $("#dnBom").val(),
    //                     rij = $("#dnRij").val(),
    //                     kolom = $("#dnKolom").val();

    //                 $.ajax({
    //                     url: "http://192.168.23.124:1111/deelnemers",
    //                     async: true, // overbodig
    //                     /* success: function (param) {
    //                         verwerkGegevens(param)
    //                     }, */
    //                     data: {
    //                         "naam": naam,
    //                         "bommen": bom,
    //                         "rijen": rij,
    //                         "kolommen": kolom
    //                     },
    //                     dataType: 'json'
    //                 }).done(function (param) {
    //                     // console.log("naam: " + naam)
    //                     // console.log(param)
    //                     verwerkGegevens(param)
    //                 })
    //             })


    //             function verwerkGegevens(data) {
    //                 // if ($("#tabelDeelnrs")) {
    //                 $("#tabelDeelnrs").remove()
    //                 // }  // test blijkbaar niet nodig...?
    //                 // console.log('data fie is ' + data)
    //                 var arr = data

    //                 $('#getIt').after(($('<table>').attr('id', 'tabelDeelnrs'))
    //                     .append($('<thead>')
    //                         .append($('<th>').html('Naam'))
    //                         .append($('<th>').html('Tijd'))
    //                         .append($('<th>').html('Bommen'))
    //                         .append($('<th>').html('Rijen'))
    //                         .append($('<th>').html('Kolommen')))
    //                     .append($('<tbody>').attr('id', 'dlns')))
    //                 console.log(arr)
    //                 arr.forEach(function (deelnemer) {
    //                     $('#dlns').append($('<tr>')
    //                         .append($('<td>').html(deelnemer.naam))
    //                         .append($('<td>').html(deelnemer.tijd))
    //                         .append($('<td>').html(deelnemer.bommen))
    //                         .append($('<td>').html(deelnemer.rijen))
    //                         .append($('<td>').html(deelnemer.kolommen)))
    //                 }, this);
    //             }

    //             $('#btnSubmit').click(function (e) {
    //                 // console.log("let's go!: " + e)
    //                 var naam = $("#naam").val(),
    //                     bom = $("#bom").val(),
    //                     rij = $("#rij").val(),
    //                     kolom = $("#kolom").val(),
    //                     tijd = 0;
    //                 $.post({
    //                     url: "http://192.168.23.124:1111/nieuw",
    //                     data: {
    //                         "naam": naam,
    //                         "bommen": bom,
    //                         "rijen": rij,
    //                         "kolommen": kolom,
    //                         "tijd": tijd
    //                     },
    //                     success: function () {
    //                         // console.log('ok')
    //                     }
    //                 })

    //                 $("#naam").val("");
    //                 $("#bom").val("");
    //                 $("#rij").val("");
    //                 $("#kolom").val("");
    //             })
    //         }
    //     })
    // });

    // function haalUitLocalStorage() {
    //     var config = JSON.parse(localStorage.getItem("configuratie"));
    //     if (config) {
    //         $("#invoerRijen").val(+config.rijen);
    //         $("#invoerKolommen").val(+config.kolommen);
    //         $("#invoerBommen").val(+config.bommen);
    //     }
    // };

});