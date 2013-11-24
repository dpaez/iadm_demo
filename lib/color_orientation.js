/**
 * Usamos Revealing Module Pattern para encapsular nuestro modulo javascript.
 * Mas info en: http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript
 */
var ColorOrientation = (function( window, $, chroma, Modernizr ){

  /**
   * Implementation details below
   */
  var bezInterpolator = chroma.interpolate.bezier(['white', 'yellow', 'green', 'black']);

  /**
   * Some utilities functions below
   */

  function normalizeAlpha( val ){
    if ( !val ){ return undefined; }

    return ( (val) / (360) );
  };

  function normalizeBeta( val ){
    if ( !val ){ return undefined; }
    return ( (val + 180)/(360) );
  };

  function normalizeGamma( val ){
    if ( !val ){ return undefined; }
    return ( (val + 90)/(180) );
  };

  function estimateColorForValue(hue, value, darkestValue, brightestValue) {
    // Constants to determine saturation and brightness
    var darkBrightness = 0.6;
    var brightBrightness = 1;
    var darkSaturation = 0.3;
    var brightSaturation = 1;

    // Compute saturation and brightness:
    var gradient = (value - darkestValue) / (brightestValue - darkestValue);
    var saturation = darkSaturation + gradient * (brightSaturation - darkSaturation);
    var brightness = darkBrightness + gradient * (brightBrightness - darkBrightness);

    return {h: hue, s:saturation, b:brightness};
  };

  function handleMotion( event ){

    var x = event.x || undefined;
    var y = event.y || undefined;
    var z = event.z || undefined;


    if ( !(x && y && z) ){ return; }

    $( '#acc_x' ).html( x );
    $( '#acc_y' ).html( y );
    $( '#acc_z' ).html( z );

    // Podriamos llamar a colorify o realizar otra tarea usando el acelerometro
    //colorify( x );

  };

  function handleOrientation( event ){

    var alpha = event.alpha || undefined;
    var beta = event.beta || undefined;
    var gamma = event.gamma || undefined;

    if ( !( alpha && beta && gamma ) ){ return; }

    $( '#ori_alpha' ).html( normalizeAlpha(alpha) );
    $( '#ori_beta' ).html( normalizeBeta(beta) );
    $( '#ori_gamma' ).html( normalizeGamma(gamma) );

    // llamamos a colorify con datos del giroscopio
    colorify(gamme, beta, alpha);
  }

  function colorify( val1, val2, val3 ){
    /*
      Podriamos colorear usando las tres variables del acelerometro o giroscopio.
      Por razones de simplicidad solo usamos una.
     */

    var color_chroma = bezInterpolator( normalizeGamma(val1) );
    var backgroundColor = color_chroma.saturate().hex();
    $( '#color' ).html( backgroundColor );

    var textColor = chroma('black').brighten();
    if ( chroma.contrast(backgroundColor, textColor) < 4.5 ){
      textColor = chroma('white').brighten();
    }

    $( '#text_color' ).html( textColor );
    $( 'body' ).css( 'color', textColor );
    $( 'body' ).css( 'background-color', backgroundColor );

  }

  function init(){
    if ( Modernizr.devicemotion ){
      console.log( 'devicemotion event is present!' );
      window.addEventListener('devicemotion', handleMotion, true);
    }

    if ( Modernizr.deviceorientation ){
      console.log( 'deviceorientation event is present!' );
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }

  /**
   * Public API below
   */

  publicStart: function(){
    init();
  }

  return {
    start: publicStart
  };

})( window, Zepto, chroma, Modernizr );