// export { Spel, Bord, Vakje }

var spel = new Spel('Joske');
// console.log(spel.bord.bord)  
spel.bord.verdelingBommen()
for (var i = 0; i < spel.bord.veld.length; i++) {
    console.log(spel.bord.veld[i].Vakje[i].bom)
    
    for (var y = 0; y < spel.bord.veld[i].length; y++) {
        // console.log(spel.bord.veld[i][y].bom)
    }
}