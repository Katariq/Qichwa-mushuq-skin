/* Ima kaypi kaq JavaScript qillqapas tukuy ruraqkunapaq tukuy p'anqakunap tukuy chaqnankunapi chaqnamusqa kanqa. */

 /* Test if an element has a certain class **************************************
  *
  * Description: Uses regular expressions and caching for better performance.
  * Maintainers: [[User:Mike Dillon]], [[User:R. Koot]], [[User:SG]]
  */
 
 var hasClass = (function () {
     var reCache = {};
     return function (element, className) {
         return (reCache[className] ? reCache[className] : (reCache[className] = new RegExp("(?:\\s|^)" + className + "(?:\\s|$)"))).test(element.className);
     };
 })();

 /** Collapsible tables *********************************************************
 *
 *  Description: Allows tables to be collapsed, showing only the header. See
 *               [[Wikipedia:NavFrame]].
 *  Maintainers: [[User:R. Koot]]
 */

var autoCollapse = 2;
var collapseCaption = "pakay";
var expandCaption = "rikuchiy";

function collapseTable( tableIndex )
{
    var Button = document.getElementById( "collapseButton" + tableIndex );
    var Table = document.getElementById( "collapsibleTable" + tableIndex );

    if ( !Table || !Button ) {
        return false;
    }

    var Rows = Table.rows;

    if ( Button.firstChild.data == collapseCaption ) {
        for ( var i = 1; i < Rows.length; i++ ) {
            Rows[i].style.display = "none";
        }
        Button.firstChild.data = expandCaption;
    } else {
        for ( var i = 1; i < Rows.length; i++ ) {
            Rows[i].style.display = Rows[0].style.display;
        }
        Button.firstChild.data = collapseCaption;
    }
}

function createCollapseButtons()
{
    var tableIndex = 0;
    var NavigationBoxes = new Object();
    var Tables = document.getElementsByTagName( "table" );

    for ( var i = 0; i < Tables.length; i++ ) {
        if ( hasClass( Tables[i], "collapsible" ) ) {

            /* only add button and increment count if there is a header row to work with */
            var HeaderRow = Tables[i].getElementsByTagName( "tr" )[0];
            if (!HeaderRow) continue;
            var Header = HeaderRow.getElementsByTagName( "th" )[0];
            if (!Header) continue;

            NavigationBoxes[ tableIndex ] = Tables[i];
            Tables[i].setAttribute( "id", "collapsibleTable" + tableIndex );

            var Button     = document.createElement( "span" );
            var ButtonLink = document.createElement( "a" );
            var ButtonText = document.createTextNode( collapseCaption );

            Button.style.styleFloat = "right";
            Button.style.cssFloat = "right";
            Button.style.fontWeight = "normal";
            Button.style.textAlign = "right";
            Button.style.width = "6em";

            ButtonLink.style.color = Header.style.color;
            ButtonLink.setAttribute( "id", "collapseButton" + tableIndex );
            ButtonLink.setAttribute( "href", "javascript:collapseTable(" + tableIndex + ");" );
            ButtonLink.appendChild( ButtonText );

            Button.appendChild( document.createTextNode( "[" ) );
            Button.appendChild( ButtonLink );
            Button.appendChild( document.createTextNode( "]" ) );

            Header.insertBefore( Button, Header.childNodes[0] );
            tableIndex++;
        }
    }

    for ( var i = 0;  i < tableIndex; i++ ) {
        if ( hasClass( NavigationBoxes[i], "collapsed" ) || ( tableIndex >= autoCollapse && hasClass( NavigationBoxes[i], "autocollapse" ) ) ) {
            collapseTable( i );
        }
    }
}

$( createCollapseButtons );

 //fix edit summary prompt for undo
 //this code fixes the fact that the undo function combined with the "no edit summary prompter" causes problems if leaving the
 //edit summary unchanged
 //this was added by [[User:Deskana]], code by [[User:Tra]]
 $(function () {
   if (document.location.search.indexOf("undo=") != -1
   && document.getElementsByName('wpAutoSummary')[0]) {
     document.getElementsByName('wpAutoSummary')[0].value='';
   }
 })

/*</pre>

== Búsqueda especial extendida (specialsearch) ==
Añade a la página [[Special:Search]] enlaces a buscadores externos como Yahoo, Google, MSN Live y Exalead.

Trabaja en conjunto con el módulo [[MediaWiki:SpecialSearch.js]] y está basado en [[w:fr:MediaWiki:Monobook.js]].
/** Change Special:Search to use a drop-down menu
 *
 *  Description: Dodaje do strony Special:Search menu selectbox
 *               pozwalajace na wybór wyszukiwarki
 *  Created by: [[en:User:Gracenotes]] Updated by [[fr:User:Pmartin]]
 */

function externalSearchEngines() {
  if (typeof SpecialSearchEnhanced2Disabled != 'undefined') return;


  var mainNode = document.getElementById("powersearch");
  if (!mainNode) mainNode = document.getElementById("search");
  if (!mainNode) return;

  var beforeNode = document.getElementById("mw-search-top-table");
  if (!beforeNode) return;
  beforeNode = beforeNode.nextSibling;
  if (!beforeNode) return;
 
  var firstEngine = "mediawiki";
 
  var choices = document.createElement("div");
  choices.setAttribute("id","searchengineChoices");
  choices.style.textAlign = "center";
 
  var lsearchbox = document.getElementById("searchText");
  var initValue = lsearchbox.value;
 
  var space = "";

  for (var id in searchEngines) {
    var engine = searchEngines[id];
if(engine.ShortName)
   {
    if (space) choices.appendChild(space);
    space = document.createTextNode(" ");
 
    var attr = { 
      type: "radio", 
      name: "searchengineselect",
      value: id,
      onFocus: "changeSearchEngine(this.value)",
      id: "searchengineRadio-"+id
    };
 
    var html = "<input";
    for (var a in attr) html += " " + a + "='" + attr[a] + "'";
    html += " />";
    var span = document.createElement("span");
    span.innerHTML = html;
 
    choices.appendChild( span );
    var label
    if (engine.Template.indexOf('http') == 0) {
      label = document.createElement("a");
      label.href = engine.Template.replace("{searchTerms}", initValue).replace("{language}", "fr");
    } else {
      label = document.createElement("label");
    }
  
    label.appendChild( document.createTextNode( engine.ShortName ) );
    choices.appendChild( label );
  }
 }
  mainNode.insertBefore(choices, beforeNode);
 
  var input = document.createElement("input");
  input.id = "searchengineextraparam";
  input.type = "hidden";
 
  mainNode.insertBefore(input, beforeNode);

  changeSearchEngine(firstEngine, initValue);
}

function changeSearchEngine(selectedId, searchTerms) {

  var currentId = document.getElementById("searchengineChoices").currentChoice;
  if (selectedId == currentId) return;
 
  document.getElementById("searchengineChoices").currentChoice = selectedId;
  var radio = document.getElementById('searchengineRadio-'  + selectedId);
  radio.checked = "checked";
 
  var engine = searchEngines[selectedId];
  var p = engine.Template.indexOf('?');
  var params = engine.Template.substr(p+1);
 
  var form;
  if (document.forms["search"]) {
    form = document.forms["search"];
  } else {
    form = document.getElementById("powersearch");
  }
  form.setAttribute("action", engine.Template.substr(0,p));
 
  var l = ("" + params).split("&");
  for (var idx = 0;idx < l.length;idx++) {
    var p = l[idx].split("=");
    var pValue = p[1];
 
    if (pValue == "{language}") {
    } else if (pValue == "{searchTerms}") {
      var input;
      input = document.getElementById("searchText");
 
      input.name = p[0];
    } else {
      var input = document.getElementById("searchengineextraparam");
 
      input.name = p[0];
      input.value = pValue;
    }
  }
}

if (mw.config.get('wgCanonicalSpecialPageName') == "Search") {
    var searchEngines = {
                mediawiki: {
                    ShortName: "MediaWiki search",
                    Template: "/w/index.php?search={searchTerms}"
                },
                wikiwix: {
                    ShortName: "Wikiwix",
                    Template: "http://qu.wikiwix.com/index.php?action={searchTerms}&lang=qu"
                },
                google: {
                    ShortName: "Google",
                    Template: "http://www.google.com.vn/search?as_sitesearch=qu.wikipedia.org&q={searchTerms}"
                },
 
                wlive: {
                    ShortName: "Windows Live",
                    Template: "http://search.live.com/results.aspx?q={searchTerms}&q1=site:http://qu.wikipedia.org"
                },
                yahoo: {
                    ShortName: "Yahoo!",
                    Template: "http://search.yahoo.com/search?p={searchTerms}&vs=qu.wikipedia.org"
                }
            };
    $(externalSearchEngines);
}

/*
== Cerrar mensajes ==
Ver ejemplo en [[Usuario:Chabacano/Fírmalo]], por [[Usuario:Platonides]].
<pre><nowiki> */

 $( function() {

 if (document.getElementById("cierraPadre")) {
      document.getElementById("cierraPadre").childNodes[0].onclick= function () { 
      document.getElementById("cierraPadre").style.cursor = 'pointer';
      document.getElementById("cierraPadre").parentNode.style.display = 'none';
      return false; /*no seguir el href*/} 
   }
 });

/*</pre>
== Wikimedia Player ==
Añade reproductor en la misma página.
<pre><nowiki> */

mw.loader.load('/w/index.php?title=MediaWiki:Wikimediaplayer.js&action=raw&ctype=text/javascript&smaxage=3600');


/** WikiMiniAtlas *******************************************************
  *
  *  Description: WikiMiniAtlas is a popup click and drag world map.
  *               This script causes all of our coordinate links to display the WikiMiniAtlas popup button.
  *               The script itself is located on meta because it is used by many projects.
  *               See [[Meta:WikiMiniAtlas]] for more information. 
  *  Created by: [[User:Dschwen]]
  */
mw.loader.load('//meta.wikimedia.org/w/index.php?title=MediaWiki:Wikiminiatlas.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400');

/*</pre>
== Mejoras de diseño de la Portada ==
<pre><nowiki> */

/** Mejoras de diseño de la Portada *********************************************************
  *
  *  Descripción:        Varias mejoras de diseño para la portada, incluyendo un
  *                      enlace adicional a la lista completa de idiomas disponibles.
  *  Adaptado de [[en:MediaWiki:Common.js]]
  */
 
 function mainPageAppendCompleteListLink() {
     try {
         var node = document.getElementById( "p-lang" )
                            .getElementsByTagName('div')[0]
                            .getElementsByTagName('ul')[0];
 
         var aNode = document.createElement( 'a' );
         var liNode = document.createElement( 'li' );
 
         aNode.appendChild( document.createTextNode( 'Lista completa' ) );
         aNode.setAttribute( 'href' , '//meta.wikimedia.org/wiki/Lista_de_Wikipedias' );
         liNode.appendChild( aNode );
         liNode.style.fontWeight = 'bold';
         node.appendChild( liNode );
      } catch(e) {
        // lets just ignore what's happened
        return;
     }
 }

 if ( mw.config.get('wgPageName') == "Wikipedia:Portada" ) {
        $( mainPageAppendCompleteListLink );
 }
//</nowiki></pre>

mw.loader.using('mediawiki.util', function() {
     var n = Math.round(Math.random() * 9); //10 opciones

     mw.util.addCSS('.rotate_0 { display: none }');
     mw.util.addCSS('.rotate_' + n + ' { display: block; }');
});

var wma_settings = {
buttonImage: "//upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Erioll_world.svg/15px-Erioll_world.svg.png"
}
