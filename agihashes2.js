
/**
 *
 * AGIHASHES BY g.wojak@aginternet.pl
 *
 * options:
 *
 *   menuAnimate
 *     menuId {string}
 *     catchHeight {number}
 *     changeClass {boolean}
 *     afterCatchDownFn {function}
 *     afterCatchUpFn {function}
 *
 *   sectionPages
 *     classNames {array}
 *     beforeScrollFn {function}
 *     afterScrollFn {function}
 *     scrollMore { Number } in px - scroll down more than top of the page (for example below fixed top menu)
 *     scrollMoreClass - css class to trigger scrollMore (some section pages can scroll more and some don't)
 *
 *   floatPages
 *     classNames {array}
 *     hiddenCSS {array}
 *       name {string}
 *       value {string}
 *     visibleCSS {array}
 *     afterClickFn {function}
 *     afterCloseFn {function}
 *
 *   fixedPages
 *     classNames {array}
 *     hiddenCSS {array}
 *     visibleCSS {array}
 *     afterClickFn {function}
 *     afterCloseFn {function}
 *
 *   hashLinks
 *     classNames {array}
 *     afterClick {function}
 *
 *   afterHashChangeFn {function}
 *   startShowPage {string} (id)
 *   afterStartFn {function} : boolean
 *
 *
 */


const hashpageIDprefix = 'hashpage_';


let starthash = window.location.hash;

let winw = $( window ).width();
let winh = $( window ).height();

let newhash = ''

const hpageLength = hashpageIDprefix.length;







export function scrollFn(el) {

  let speed = 1000;
  console.info('el', el);
  let difference = Math.round( Math.abs($(document).scrollTop() - $(el).offset().top) );
  if ( difference < 1000  ) {
    speed = 500;
  }

  //console.info('df', difference, speed);
  //console.info('el', el);
  $([document.documentElement, document.body]).animate({
    scrollTop: $(el).offset().top
  }, speed);

  const nhash = '#' + el.substr(hpageLength+1);
  window.location.hash = nhash;


}









/**
 * @param el {string} id of element
 * @param classNames {Array} array of classes
 * @returns {boolean} true if element (page) have at least one of given css classes, false if not
 * @private
 */


function _isPageType(el,classNames) {

  // console.info('eltype', typeof $(el).attr('class'));
  if ( typeof $('#'+ el).attr('class') === 'string') {

    let ret = false;
    const classList = $('#'+el).attr('class').split(/\s+/);
    classNames.forEach( (val, index) => {

      if ( classList.includes(val) ) {
        ret = true;
      }

    });

    return ret;

  } else {
    return false;
  }

}














function _findHashLinks(options) {

  const classtxt = options['hashLinks']['classNames'].join(',');
  console.info('ctxt', classtxt);


  $('body').on('click', classtxt, (a)=> {
    const link = $(a.currentTarget).attr('href');
    if ( link.substr(0,1) === '#' ) {
      const el = hashpageIDprefix + link.substr(1);
      console.info('cc', link, el);

      // SECTION PAGES
      if ( options.hasOwnProperty('sectionPages') ) {
        if ( _isPageType(el, options['sectionPages']['classNames'] ) ) {
          setTimeout( ()=> {
            _animateSectionPage(el, options);
          },500 );
        }
      }
      // FLOAT PAGES
      if ( options.hasOwnProperty('floatPages') ) {
        if ( _isPageType(el, options['floatPages']['classNames'] ) ) {
          $([document.documentElement, document.body]).animate({
            scrollTop: 0
          }, 500);
          _animateFloatPage( el, options);
        }
      }
      // FIXED PAGES
      if ( options.hasOwnProperty('fixedPages') ) {
        if ( _isPageType(el, options['fixedPages']['classNames'] ) ) {
          console.info('clicked', a.currentTarget);
          $([document.documentElement, document.body]).animate({
            scrollTop: 0
          }, 500);
          _animateFixedPage( el, options);
        }
      }
    }
    else {
     window.location.assign(link);
    }
  });

}




function _animateSectionPage(el, opt) {

  opt['fixedPages']['classNames'].forEach( (val, index) => {

    opt['fixedPages']['hiddenCSS'].forEach( (val2, index2)=> {

      $('.'+val).css(val2['name'], val2['value']);

    });

  });

  opt['sectionPages']['classNames'].forEach( (val, index) => {

    opt['sectionPages']['visibleCSS'].forEach( (val2, index2)=> {

      $('.'+val).css(val2['name'], val2['value']);

    });

  });


  if ( opt['sectionPages'].hasOwnProperty('beforeScrollFn') ) {

    opt['sectionPages']['beforeScrollFn'](el);

  }

  let speed = 1000;
  console.info('el', el);
  const eltop = $('#' + el).offset( ).top;

  let difference = Math.round( Math.abs($(document).scrollTop() - eltop) );
  if ( difference < 1000  ) {
    speed = 500;
  }

  //console.info('df', difference, speed);
  //console.info('el', el);


  let scrollMeTo =  $('#'+el).offset().top;
  if ( opt['sectionPages'].hasOwnProperty('scrollMore') ) {
    if ( opt['sectionPages'].hasOwnProperty('scrollMoreClass') ) {
      if (_isPageType(el, opt['sectionPages']['scrollMoreClass'])) {
        scrollMeTo -= Number( opt['sectionPages']['scrollMore'] );
      }
    }
  }

  $([document.documentElement, document.body]).animate({
    scrollTop: scrollMeTo
  }, speed, ()=>{

    if ( opt['sectionPages'].hasOwnProperty('afterScrollFn') ) {
      opt['sectionPages']['afterScrollFn'](el);
    }


  });

  const nhash = '#' + el.substr(hpageLength);
  window.location.hash = nhash;


}





function _animateFloatPage(el, opt) {

  /**
   * @TODO animateFloatPage
   */

}



function _animateFixedPage( el, opt) {



  opt['fixedPages']['classNames'].forEach( (val, index) => {

    opt['fixedPages']['hiddenCSS'].forEach( (val2, index2)=> {

      $('.'+val).css(val2['name'], val2['value']);

    });

  });

  opt['sectionPages']['classNames'].forEach( (val, index) => {

    opt['sectionPages']['hiddenCSS'].forEach( (val2, index2)=> {

      $('.'+val).css(val2['name'], val2['value']);

    });

  });

  opt['fixedPages']['visibleCSS'].forEach( (val2, index2)=> {

    $('#'+el).css(val2['name'], val2['value']);

  });



  if ( opt['fixedPages'].hasOwnProperty('afterClickFn') ) {

    opt['fixedPages']['afterClickFn'](el);

  }


  const nhash = '#' + el.substr(hpageLength);
  window.location.hash = nhash;



  /**
   * @TODO afterCloseFn
   */



}









function _initMenuAnimate(opt) {

}


function _initSectionPages(opt) {

}


function _initFloatPages(opt) {

}


function _initFixedPages(opt) {

}












/**
 *
 * @param options {object} configuration options
 */
export function init(options) {


  if (options.hasOwnProperty('menuAnimate')) {
      _initMenuAnimate(options);
  }
  if (options.hasOwnProperty(('sectionPages'))) {
    _initSectionPages(options)
  }
  if (options.hasOwnProperty(('floatPages'))) {
    _initFloatPages(options)
  }
  if (options.hasOwnProperty(('fixedPages'))) {
    _initFixedPages(options)
  }


  _findHashLinks(options);

  // console.info('starthash', starthash);

  if (options.hasOwnProperty(('startShowPage'))) {
    if (starthash != '') {


      const sid = "#hashpage_" + starthash.substr(1);
      // $( sid ).fadeIn('fast');


      const el = sid.substr(1);

      if ( options.hasOwnProperty('fixedPages') ) {
        if ( _isPageType(el, options['fixedPages']['classNames'] ) ) {
          $([document.documentElement, document.body]).animate({
            scrollTop: 0
          }, 500);
          _animateFixedPage( el, options);
        }
      }

      if ( options.hasOwnProperty('sectionPages') ) {
        if ( _isPageType(el, options['sectionPages']['classNames'] ) ) {
          _animateSectionPage(el, options);
        }
      }




      } else {
      $( options['startShowPage'] ).fadeIn('fast');
    }
  }

  $(window).on('hashchange', function() {
    // console.info('hash changed!', window.location.hash );
    starthash = window.location.hash;
    const sid = "#hashpage_" + starthash.substr(1);
    // $( sid ).fadeIn('fast');


    const el = sid.substr(1);

    if ( options.hasOwnProperty('fixedPages') ) {
      if ( _isPageType(el, options['fixedPages']['classNames'] ) ) {
        $([document.documentElement, document.body]).animate({
          scrollTop: 0
        }, 500);
        _animateFixedPage( el, options);
      }
    }

    if ( options.hasOwnProperty('sectionPages') ) {
      if ( _isPageType(el, options['sectionPages']['classNames'] ) ) {
        _animateSectionPage(el, options);
      }
    }

  });

  if (options.hasOwnProperty(('afterStartFn'))) {

    options['afterStartFn'](starthash);
  }

}













