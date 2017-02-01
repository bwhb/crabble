//dict
if (localStorage.getItem("dict")) dict = JSON.parse(LZString.decompress(localStorage.getItem("dict")));
else dict =[];
dictsplit ={};

//Multiplikatoren
m2w = ['B6','B10','D8','F2','F14','H4','H12','J2','J14','L8','N6','N10'];
m3w = ['A3','A13','C15','C1','O3','O13','P15','M1','M15'];
m2b = ['C3','C13','E7','E9','G5','G11','I5','I11','K7','K9','M3','M13'];
m3b = ['A5','A11','B2','C7','C9','D4','B14','D12','E1','E15','F6','F10','G3','G13','I3','I13','J6','J10','K1','K15','L4','L12','M7','M9','N2','N14','O5','O11'];
// Buchstaben
buchstabenwerte ={}
buchstabenwerte.a = 1;
buchstabenwerte.b = 2;
buchstabenwerte.c = 4;
buchstabenwerte.d = 1;
buchstabenwerte.e = 1;
buchstabenwerte.f = 4;
buchstabenwerte.g = 2;
buchstabenwerte.h = 2;
buchstabenwerte.i = 1;
buchstabenwerte.j = 6;
buchstabenwerte.k = 4;
buchstabenwerte.l = 2;
buchstabenwerte.m = 3;
buchstabenwerte.n = 1;
buchstabenwerte.o = 2;
buchstabenwerte.p = 4;
buchstabenwerte.q = 10;
buchstabenwerte.r = 1;
buchstabenwerte.s = 1;
buchstabenwerte.t = 1;
buchstabenwerte.u = 1;
buchstabenwerte.v = 6;
buchstabenwerte.w = 3;
buchstabenwerte.x = 8;
buchstabenwerte.y = 10;
buchstabenwerte.z = 3;
buchstabenwerte.ae = 6;
buchstabenwerte.oe = 8;
buchstabenwerte.ue = 6;

function drawMulti(){
  $(".m3w,.m2w,.m3b,.m2b").prop("class","")
  m3w.forEach(function(d){
    $("#"+d).addClass("m3w")
  })
  m3b.forEach(function(d){
    $("#"+d).addClass("m3b")
  })
  m2b.forEach(function(d){
    $("#"+d).addClass("m2b")
  })
  m2w.forEach(function(d){
    $("#"+d).addClass("m2w")
  })
}

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}

function dictspliter(specialDict){
  //dictsplit durchführen
console.log("Dictsplit durchführen")
  console.time("short");
  specialDict.forEach(function(d,i){
      var sub = d.substring(0,2)
      if(!Array.isArray(dictsplit[sub])) dictsplit[sub] = []
      dictsplit[sub].push(d)
  })
  console.timeEnd("short")
  //console.dir(dictsplit)
}


jQuery(document).ready(function($) {
  $("td").each(function(){
    // $(this).text($(this).data("koord"))
  })
  if(dict.length==0){
    $.getJSON('dict.json', function(json, textStatus) {
        dict = json
        localStorage.setItem("dict",LZString.compress(JSON.stringify(dict)))
    });
  }
  drawMulti()
  console.log("Sortiere dict")
  shortdict = []
  var c=0;
  dict.sort(function(a,b){
    return a.length - b.length;
  })



  //dict.reverse()
  console.log("Erzeuge shortdict")
  console.time("short");
  /*while(dict.length>0){
    c++;
    el = dict.shift()
    var treffer = false
    for (var i=0; i<dict.length; i++) {
      re = new RegExp(el)
      if(re.exec(dict[i])){
        treffer = true;
        break;
      }
    }
    if(c%100==0){
      console.timeEnd("short")
      console.time("short")
    }
    if(!treffer){
      shortdict.push(el)
      if((shortdict.length%10)==0)console.log(el+" hinzugefügt "+shortdict.length+"/"+c)
      if((shortdict.length%100)==0){
        localStorage.setItem("shortdict",LZString.compress(JSON.stringify(shortdict)))
        console.log("Shortdict  gespeichert " + (shortdict.length/c))
      }
    }
  }*/
});
$(document).on("click","#suche2",function(event) {
  console.time("start")
  $(".result").empty()
  var txt= $("input").val().toUpperCase()
  var perm = permutator(JSON.parse(txt.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]")));
  console.log('Permutationen abgeschlossen');
  console.timeEnd("start")
  console.time("clean")
  console.log(perm.length);
  var pos = [];
  perm.forEach(function(p,i){
    var pc = p.join("").replace(/(.{4}).*/g,"$1")
    var t = new RegExp(pc)
    if(pos.indexOf(pc)==-1||!dict.some(function (post) {return post.match(t)})){
      perm.forEach(function(d,i){
        if(d.join("").match(t)) perm.splice(i,1);
      });
      pos.push(pc);
    }
    else pos.push(pc);
  });
  // perm2 = perm.filter(function(v){
  //   var pc = v.join("").replace(/(.{2}).*/g,"$1")
  //   if(pos.indexOf(pc)!==-1) return false;
  //   var t = new RegExp(pc)

  //   if(dict.find(function (post) {return post.match(t)})){
  //     return true;
  //   }
  //   else{
  //     pos.push(pc);
  //   }
  // })

  // perm = perm2
  console.timeEnd("clean")
  console.time("suche")
  console.log('Permutationen bereinigt');
  console.log(perm.length);
  if(txt.length>1){
    var r =""
    for(i=0;i<txt.length;i++){
      r = r + "["+txt+"]?";
    }
    var preReg = new RegExp("[^"+txt+"]");
    var r ="(";
    for(i=0;i<perm.length;i++){
      r = r + perm[i].join("?");
      if(i<(perm.length-1))r = r +"?|";
    }
    r = r +")";
    var regEx = new RegExp("^"+r+"?$");
    res =[];
    dict.forEach(function (post) {
      if (!post.match(preReg)){
        if(post.match(regEx)){
          var punkttest = JSON.parse(post.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]"))
          var punkte = 0
          punkttest.forEach(function(d){

            punkte = punkte + buchstabenwerte[d.toLowerCase().replace(/ä/,"ae").replace(/ö/,"oe").replace(/ü/,"ue")];
          })
         res.push(post+" ("+punkte+")")
        }
      }
    });
    res.sort(function(a,b){
      return a.replace(/.*(\d+).*/,"$1") - b.replace(/.*(\d+).*/,"$1")
    });
    res.reverse();
    res.forEach(function(d){
      $(".result").append("<div>"+d+"</div>")
    });
    console.timeEnd("suche")
    console.log("Fertig.");
  }
});



$(document).on("click","#suche",function(event) {
  res =[];
  stop=[];
  console.time("start")
  $(".result").empty()
  $("table").hide()
  var txt= $("input").val().toUpperCase()
  var perm = permutator(JSON.parse(txt.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]")));
  console.timeEnd("start")
  console.log('Permutationen abgeschlossen');
  console.time("clean")
  var interimdict =[];
  var filter = new RegExp("["+txt+"]{2,}")
  dict.forEach(function(d,i){

    if(filter.exec(d)){
      interimdict.push(d)
    }

  })
  console.log(dict.length+" "+interimdict.length);
  dictspliter(interimdict)
  perm2=[];
  perm.forEach(function(d){
    d = d.join("");
    /*console.log(d.substring(0,2))
    console.log(dictsplit[d.substring(0,2)])*/
    if(perm2.indexOf(d)==-1&&Array.isArray(dictsplit[d.substring(0,2)]))perm2.push(d)
  })
  //console.log(perm2);
  if(txt.length>1){
    perm2.forEach(function(d){
      //d = d.join("")
      var sub = d.substring(0,2)
      if(stop.indexOf(sub)==-1&&Array.isArray(dictsplit[sub])){
        var re = new RegExp("^"+d.replace(/(.)/g,"$1?")+"$");
       // console.log(re);
        dictsplit[sub].forEach(function(post){
          if(re.exec(post)){
            var punkttest = JSON.parse(post.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]"))
            var punkte = 0
            punkttest.forEach(function(d){

              punkte = punkte + buchstabenwerte[d.toLowerCase().replace(/ä/,"ae").replace(/ö/,"oe").replace(/ü/,"ue")];
            })
           if(res.indexOf(post+" ("+punkte+")")==-1)res.push(post+" ("+punkte+")")
          }
        })
      }
      else{
        stop.push(sub)
      }
    })
    console.log(res);
    res.sort(function(a,b){
      return Number(a.replace(/.*?(\d+).*$/,"$1")) - Number(b.replace(/.*?(\d+).*$/,"$1"))
    });
    res.reverse();
    res.forEach(function(d){
      $(".result").append("<div>"+d+"</div>")
    });
    console.timeEnd("suche")
    console.log("Fertig.");
  }
});



$(document).on('blur keyup paste input', '[contenteditable]',function(){
  b = $(this).text().substr(0,1).toUpperCase().replace("&nbsp;","").trim()
  if (b.length==1)$(this).html(b +"<sub>"+ buchstabenwerte[b.toLowerCase().replace(/ä/,"ae").replace(/ö/,"oe").replace(/ü/,"ue")] +"</sub>")
})