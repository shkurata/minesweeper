/* Tip verder werker: NodeJSvoorFEO, p. 13:
Property query van de eerste parameter van de callback functie van methode get stelt de waarden van de doorgestuurde invoervelden voor. (of juister: van de querystring, dit is in de url van een request het gedeelte na het vraagteken, dat bestaat uit key-value paren)
Om hetzelfde te doen als de form naar de server gestuurd is via een POST, moeten we vooraf module body-parser installeren (npm install body-parser) en gebruiken: */

$(function () {

    var interval;
    var timer;

    haalUitLocalStorage();

    $("#divSpelbord").hide();

    $("#btnStart").click(function () {
        if ($('#invoerBommen').val() < 1 || $('#invoerBommen').val() >= $('#invoerRijen').val() * $('#invoerKolommen').val()) {
            alert('Gelieve het spelidee te respecteren')
        } else {
            nieuwSpelUI();
            // console.log("bommen: " + $('#invoerBommen').val());
            // console.log("rijen: " + $('#invoerRijen').val()); 
            // console.log("kolommen: " + $('#invoerKolommen').val());
            // console.log('product: ' + $('#invoerRijen').val() * $('#invoerKolommen').val());

            $('#speelveld').remove();
            $("#divSpelbord").show();
            var tellerV = 0;
            var aantalRijen = +$("#invoerRijen").val();
            var aantalKolommen = +$("#invoerKolommen").val();
            var aantalBommen = +$("#invoerBommen").val();
            var spelersnaam = $("#invoerNaam").val();

            var spel = new Spel(spelersnaam, aantalBommen, aantalRijen, aantalKolommen);

            $("#showBombs").html("Resterende bommen: " + aantalBommen);

            $('#divSpelbord').append($("<table>").attr('id', 'speelveld'));

            $("#speelveld").one("mousedown", function () {
                timer.starten();
            });

            for (var i = 0; i < aantalRijen; i++) {
                $("#speelveld").append($('<tr>').attr('id', i))
                for (var y = 0; y < aantalKolommen; y++) {
                    //console.log(i + '.' + y)
                    // console.log(i + '.' + y)
                    $('#' + i).append($('<td>').attr('id', i + '_' + y)
                        .click(function (event) {
                            var rij = +this.id.split('_')[0];
                            var kolom = +this.id.split('_')[1];
                            //console.log("links ", rij, ": ", kolom);
                            // console.log("links ", rij, ": ", kolom);
                            if (spel.bord[rij][kolom].symboolBepalen() != 'v') {
                                $('#' + this.id).attr('class', 'clicked');
                                $('#' + this.id);
                                spel.vakjeOmdraaien(rij, kolom);
                                grafischeWeergaveAanpassen();
                                spel.winControle();
                                var klik = "links";
                                controleerEindeSpel(klik);
                            }
                        }).contextmenu(function (event) {
                            var rij = this.id.split('_')[0]
                            var kolom = this.id.split('_')[1]
                            spel.bord[rij][kolom].vlag()
                            $("#" + this.id).html(spel.bord[rij][kolom].symboolBepalen())
                            //console.log("rechts ", rij, ": ", kolom);
                            // console.log("rechts ", rij, ": ", kolom);
                            if (spel.bord[rij][kolom].symboolBepalen() == 'v') {
                                tellerV++;
                                spel.markedVakjes++;
                                spel.winControle();
                                var klik = "rechts";
                                controleerEindeSpel(klik);
                                $(this).addClass('alert');
                                // $(this).on('click', function () { prop("disabled", false) });
                                // $(this).prop('click()', 'disabled')
                                $(this).attr({ disabled: true })
                                // $(this).attr('disabled', 'disabled')
                                //console.log(this)
                                //console.log($(this))
                                // $(this).attr('disabled', 'disabled')
                                // console.log(this)
                                // console.log($(this))
                            } else if (spel.bord[rij][kolom].symboolBepalen() == '?') {
                                tellerV--;
                                spel.markedVakjes--;
                                spel.winControle();
                                var klik = "rechts";
                                controleerEindeSpel(klik);
                                $(this).removeClass('alert');
                                $(this).addClass('warning');
                                $(this).prop('disabled', true)
                            } else {
                                $(this).removeClass('warning');
                            }
                            $("#showBombs").html("Resterende bommen: " + (aantalBommen - tellerV));
                        })
                    );
                }
            }

            function grafischeWeergaveAanpassen() {
                // } //else {
                for (var i = 0; i < spel.bord.length; i++) {
                    for (var y = 0; y < spel.bord[i].length; y++) {
                        if (spel.bord[i][y].omgedraaid) {
                            $('#' + i + '_' + y).attr('class', 'gedraaid')
                        }
                        // console.log(this.bomBuren)
                        if (spel.bord[i][y].bomBuren) {
                            //bomburen opsporen
                            $('#' + i + '_' + y).html(spel.bord[i][y].bomBuren)
                            //console.log(spel.bord[i][y].bomBuren)
                        }
                    }
                }
            }

            console.log(spel.bord);

            var config = {
                "bommen": aantalBommen,
                "rijen": aantalRijen,
                "kolommen": aantalKolommen
            }

            bewaarInLocalStorage(config);

            timer = new MijnTimer();

            interval = setInterval(function () {
                document.getElementById("showTime").innerHTML = "Verstreken tijd: " + timer.seconden;
            }, 1000);

            function controleerEindeSpel(klik) {
                if (spel.einde) {
                    timer.stoppen();
                    if (klik == "links") {
                        $("#divSpelbord").hide();
                        $('#divSpel').append('<br>')
                            .append($('<img>').attr('src', 'Images/lose.jpg'));
                    } else {
                        $("#divSpelbord").hide();
                        $('#divSpel').append('<br>')
                            .append($('<img>').attr('src', 'Images/win.jpg'))
                        // .append('<div>').html(melding)
                        voegSpelerToeAanLijst(timer.seconden);
                    }
                }
            }

            function bewaarInLocalStorage(config) {
                localStorage.setItem("configuratie", JSON.stringify(config));
            }
        }
        // einde start button

        $("#btnPauzeer").on('click', function () {
            timer.stoppen();
            console.log('ok')
            // $("#divSpelbord").hide();
            // $("#divSpelbord").addClass('pauze')
            $("#divSpelbord").prepend($('<img>').attr("src", "Images/pauze.gif"))
            $("#speelveld").hide()
        });


        $("#btnHerneem").click(function () {
            timer.hernemen();
            $("#divSpelbord").show();
            $("#divSpelbord>img").remove()
            $("#speelveld").show()
        });
    })

    function haalUitLocalStorage() {
        var config = JSON.parse(localStorage.getItem("configuratie"));
        if (config) {
            $("#invoerRijen").val(+config.rijen);
            $("#invoerKolommen").val(+config.kolommen);
            $("#invoerBommen").val(+config.bommen);
        }
    }

    $('#getIt').click(function () {

        var naam = $("#dnNaam").val(),
            bom = $("#dnBom").val(),
            rij = $("#dnRij").val(),
            kolom = $("#dnKolom").val();

        $.ajax({
            //url: "http://192.168.23.124:1111/deelnemers",
            url: "http://127.0.0.1:1111/deelnemers",
            async: true, // overbodig
            /* success: function (param) {
                verwerkGegevens(param)
            }, */
            data: {
                "naam": naam,
                "bommen": bom,
                "rijen": rij,
                "kolommen": kolom
            },
            dataType: 'json'
        }).done(function (param) {
            //console.log("naam: " + naam)
            //console.log(param)
        }).done(function (param) {
            // console.log("naam: " + naam)
            console.log(param);
            verwerkGegevens(param)
        })
    })

    function verwerkGegevens(data) {
        // if ($("#tabelDeelnrs")) {
        $("#tabelDeelnrs").remove()
        // }  // test blijkbaar niet nodig...?
        // console.log('data fie is ' + data)
        var arr = data

        $('#getIt').after(($('<table>').attr('id', 'tabelDeelnrs'))
            .append($('<thead>')
                .append($('<th>').html('Naam'))
                .append($('<th>').html('Tijd'))
                .append($('<th>').html('Bommen'))
                .append($('<th>').html('Rijen'))
                .append($('<th>').html('Kolommen')))
            .append($('<tbody>').attr('id', 'dlns')))
        //console.log(arr)
        arr.forEach(function (deelnemer) {

            $('#dlns').append($('<tr>')
                .append($('<td>').html(deelnemer.naam))
                .append($('<td>').html(deelnemer.tijd))
                .append($('<td>').html(deelnemer.bommen))
                .append($('<td>').html(deelnemer.rijen))
                .append($('<td>').html(deelnemer.kolommen)))
        }, this);
    }

    function voegSpelerToeAanLijst(tijd) {
        var naam = $("#invoerNaam").val(),
            bom = $("#invoerBommen").val(),
            rij = $("#invoerRijen").val(),
            kolom = $("#invoerKolommen").val(),
            tijd = tijd;
        $.post({
            //url: "http://192.168.23.124:1111/nieuw",
            url: "http://127.0.0.1:1111/nieuw",
            data: {
                "naam": naam,
                "bommen": bom,
                "rijen": rij,
                "kolommen": kolom,
                "tijd": tijd
            },
            success: function (melding) {
                var mssg = melding
                console.log(JSON.parse(mssg));

                // $('img').after($('<div>').html(melding.message))
            }
        })
    }

    //$('#dnNaam').click(function() {
    $.ajax({
        //url: "http://192.168.23.124:1111/namenlijst",
        url: "http://127.0.0.1:1111/namenlijst",
        async: true, // 
        data: {},
        dataType: 'json'
    }).done(function (namen) {
        console.log(namen);
        for (var i = 0; i < namen.length; i++) {
            var nieuweOptie = document.createElement('option');
            nieuweOptie.text = namen[i];
            nieuweOptie.value = namen[i];
            document.getElementById("dnNaam").add(nieuweOptie);
        }
    })
    //});

    $.ajax({
        //url: "http://192.168.23.124:1111/namenlijst",
        url: "http://127.0.0.1:1111/rijen",
        async: true, // 
        data: {},
        dataType: 'json'
    }).done(function (rijen) {
        console.log("Dit zijn de rijen: " + rijen);
        for (var i = 0; i < rijen.length; i++) {
            var nieuweOptie = document.createElement('option');
            nieuweOptie.text = rijen[i];
            nieuweOptie.value = rijen[i];
            document.getElementById("dnRij").add(nieuweOptie);
        }
    })

    $.ajax({
        //url: "http://192.168.23.124:1111/namenlijst",
        url: "http://127.0.0.1:1111/kolommen",
        async: true, // 
        data: { "rij": 10 },
        dataType: 'json'
    }).done(function (kolommen) {
        console.log("Dit zijn de kolommen: " + kolommen);
        for (var i = 0; i < kolommen.length; i++) {
            var nieuweOptie = document.createElement('option');
            nieuweOptie.text = kolommen[i];
            nieuweOptie.value = kolommen[i];
            document.getElementById("dnKolom").add(nieuweOptie);
        }
    })

    function nieuwSpelUI() {
        verwijderUI();
        bouwNieuweUI();
    }

    function verwijderUI() {
        console.log($('#divSpel')) /* WTF? */
        $('#interface').children().remove();
        console.log($('#divSpel'))
    }
    function bouwNieuweUI() {
        /* div#spel
            div
                div.btn etc
                    input
                    input
                div
                br
                div.btn
                    div showtime
                    div showbombs
            div#spelbord */

        $('#interface')
            .append(($('<div>').attr('id', 'divSpel'))
                .append(($('<div>'))
                    .append(($('<div>').addClass('btn-group'))
                        .append($('<input>').addClass("btn btn-default").attr('name', 'btnPauzeer').attr('id', 'btnPauzeer').attr('value', 'Pauzeer spel').attr('type', 'button'))
                        .append($('<input>').addClass("btn btn-default").attr('name', 'btnHerneem').attr('id', 'btnHerneem').attr('value', 'Herneem spel').attr('type', 'button'))
                        .append($('<br>'))
                        .append(($('<div>').addClass('btn-group'))
                            .append($('<div>').addClass('btn btn-default').attr('id', 'showTime').attr('name', 'showTime'))
                            .append($('<div>').addClass('btn btn-default').attr('id', 'showBombs')
                                .attr('name', 'showBombs'))))));
        $('#divSpel').after($('<hr>'))
            // .after(($('<div>').addClass('btn-group')))
            .after($('<div>').attr('id', 'divSpelbord')//.append($('<hr>'))
            );
        /*
                                        <div class="btn-group">
                                            <div class="btn btn-default" name="showTime"
                                                id="showTime"> Verstreken tijd</div>
                                            <div class="btn btn-default" name="showBombs"
                                                id="showBombs"> Resterende bommen </div>
                                        </div>
                    </div>
        
                                    <div id="divSpelbord">
                                    </div>
                </div> -->  */

    }
});
// einde van de onload