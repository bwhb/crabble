//dict
if (localStorage.getItem("dict")) dict = JSON.parse(LZString.decompress(localStorage.getItem("dict")));
else dict =[];
dictsplit ={};

DictTree = function(){
  this.init = function(force = 0){
    that=this;
      dict.forEach(function(d,i){
        that.add(that.data,0,d)
      });
      return true;
  };
  this.search = function(word, obj=this.data, pos=0){
    var ret = false
    word = word.toUpperCase();
    if(pos==0)this.words = [];
    if(obj.hasOwnProperty(word[pos])){
        if(pos==1) ret = true
        if(obj[word[pos]].final==true){
          this.words.push(word.substring(0,pos+1));
        }
        if(word.length>pos){
          this.search(word,obj[word[pos]],pos+1);
        }
        else return ret;
    }
    if(pos==0)return this.words;
  };
  this.add = function(parentobj,pos,word){
    if (parentobj.hasOwnProperty(word[pos])){
      if (word.length == pos+1 ){
        parentobj[word[pos]].final = true;
        pos=0;
      }
      else{
        this.add(parentobj[word[pos]],pos+1,word);
      }
    }
    else{
      parentobj[word[pos]]={
      "final": word.length == pos+1,
      }
      if(word.length == pos+1)pos=0
      else this.add(parentobj[word[pos]],pos+1,word)
    }
  };
  this.data = {};
  this.words = [];
  this.punkte = function (word){
    var buchstabenwerte ={"a": 1,"b": 3,"c": 4,"d": 1,"e": 1,"f": 4,"g": 2,"h": 2,"i": 1,"j": 6,"k": 4,"l": 2,"m": 3,"n": 1,"o": 2,"p": 4,"q": 10,"r": 1,"s": 1,"t": 1,"u": 1,"v": 6,"w": 3,"x": 8,"y": 10,"z": 3,"ae": 6,"oe": 8,"ue": 6}
    var punkttest = JSON.parse(word.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]"))
    var punkte = 0
    punkttest.forEach(function(d){
      punkte = punkte + buchstabenwerte[d.toLowerCase().replace(/ä/,"ae").replace(/ö/,"oe").replace(/ü/,"ue")];
    })
    return punkte;
  }
}



//Multiplikatoren
m2w = ['B6','B10','D8','F2','F14','H4','H12','J2','J14','L8','N6','N10'];
m3w = ['A3','A13','C15','C1','O3','O13','P15','M1','M15'];
m2b = ['C3','C13','E7','E9','G5','G11','I5','I11','K7','K9','M3','M13'];
m3b = ['A5','A11','B2','C7','C9','D4','B14','D12','E1','E15','F6','F10','G3','G13','I3','I13','J6','J10','K1','K15','L4','L12','M7','M9','N2','N14','O5','O11'];
// Buchstaben
buchstabenwerte ={"a": 1,"b": 3,"c": 4,"d": 1,"e": 1,"f": 4,"g": 2,"h": 2,"i": 1,"j": 6,"k": 4,"l": 2,"m": 3,"n": 1,"o": 2,"p": 4,"q": 10,"r": 1,"s": 1,"t": 1,"u": 1,"v": 6,"w": 3,"x": 8,"y": 10,"z": 3,"ae": 6,"oe": 8,"ue": 6}

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

function permutatorx(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        if (results.indexOf(memo.concat(cur).join(""))==-1)results.push(memo.concat(cur).join(""));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}

function permutator(inputArr) {
  var results = [];
  var ignore = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];
    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      var word = memo.concat(cur).join("");
      var seResult = lala.search(word);
      if(ignore.indexOf(word)>=0){
        continue;
      }
      else if(seResult.length>0) results = results.concat(seResult);
      else if (seResult.length>0&&word.length>1){
        ignore.push(word);
      //  console.log(word)
        continue;
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }
    return results;
  }

  return permute(inputArr);
}


function dictspliter(specialDict){
  console.log("Dictsplit durchführen")
  console.time("short");
  specialDict.forEach(function(d,i){
      var sub = d.substring(0,2)
      if(!Array.isArray(dictsplit[sub])) dictsplit[sub] = []
      dictsplit[sub].push(d)
  })
  console.timeEnd("short")
}



jQuery(document).ready(function($) {
  console.time("dictTree");
  lala = new DictTree();
  lala.init();
  console.timeEnd("dictTree");
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
  console.clear();
  /*console.log("Sortiere dict")
  shortdict = []
  var c=0;
  dict.sort(function(a,b){
    return a.length - b.length;
  })*/



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



$(document).on("click","#suche3",function(event) {
  res =[];
  stop=[];
  console.clear()
  console.time("start")
  $(".result").empty()
  $("table").hide()
  var txt= $("input").val().toUpperCase()
  var perm = permutator(JSON.parse(txt.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]")));
  console.timeEnd("start")
  console.log('Permutationen abgeschlossen');
  console.time("clean")
  console.log(perm.length);
  perm2=[];
  perm.forEach(function(d){
    d = d.join("");
    if(perm2.indexOf(d)==-1&&Array.isArray(dictsplit[d.substring(0,2)])){
      perm2.push(d)
    }
  })
  console.log("Permutationen geschrumpft: " + perm2.length);
  if(txt.length>1){
  var interimdict =[];
  var filter = new RegExp("["+txt+"]{2,}")
  dict.forEach(function(d,i){

    if(filter.exec(d)){
      interimdict.push(d)
    }

  })
  console.log("Erforderliche Dict-Größe: "+(interimdict.length / dict.length));
  dictspliter(interimdict)

    perm2.forEach(function(d){

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

$(document).on("click","#suche",function(event) {
  res =[];
  stop=[];
  console.clear()
  console.time("start")
  $(".result").empty()
  $("table").hide()
  var txt= $("input").val().toUpperCase()
  var perm = permutator(JSON.parse(txt.replace(/(.)/g,"\"$1\",").replace(/(.*),$/,"[$1]")));
  console.log('Permutationen abgeschlossen:' +perm.length);

  console.timeEnd("start")
 /* console.time("clean")
  perm.forEach(function(d){
    res.concat(lala.search(d))
    /*lala.words.forEach(function(d){
      if (res.indexOf(d)==-1)res.push(d)
    });
    console.timeEnd("clean")
  })*/
  res = perm;
  res.forEach(function(d,i){
    res[i] = d + " ("+ lala.punkte(d) +")"
  })
  res2=[]
  res.forEach(function(d){
    if(res2.indexOf(d)==-1)res2.push(d)
  })
  res=res2
  res.sort(function(a,b){
      return Number(a.replace(/.*?(\d+).*$/,"$1")) - Number(b.replace(/.*?(\d+).*$/,"$1"))
    });
    res.reverse();
    res.forEach(function(d){
      $(".result").append("<div>"+d+"</div>")
    });
});


$(document).on('blur keyup paste input', '[contenteditable]',function(){
  b = $(this).text().substr(0,1).toUpperCase().replace("&nbsp;","").trim()
  if (b.length==1)$(this).html(b +"<sub>"+ buchstabenwerte[b.toLowerCase().replace(/ä/,"ae").replace(/ö/,"oe").replace(/ü/,"ue")] +"</sub>")
})