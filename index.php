<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Title Page</title>

    <!-- Bootstrap CSS -->
    <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">-->

    <link rel="stylesheet" href="style.css">
  </head>
  <body>
<table style='width: 80%;'>
<?php
$v = ['','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];
for ($i=1;$i<=15;$i++){
  echo "\n<tr style='border:1; height: 6%;'>\n";
  for ($j=1;$j<=15;$j++){
    echo "\n\t<td style='border-style:solid; width:6%'' data-koord='".$v[$i].$j."' id='".$v[$i].$j."' contentEditable='true'></td>";
  }
  echo "\n</tr>";
}
echo "</table><button id='reload'>Reload</button><div><input ><button id='suche'>Suche</button></div><div class='result'></div";
?>

    <!-- jQuery -->
    <script language="javascript" src="node_modules/lz-string/libs/lz-string.min.js"></script>
    <script src="//code.jquery.com/jquery.js"></script>
    <!-- Bootstrap JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    <script id='app' src='app.js'></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
     <script>
     $(document).on("click","#reload",function(){
        $("#app").remove()
        $("body").append('<script id="app" src="app.js" />')
     })

     </script>
  </body>
</html>