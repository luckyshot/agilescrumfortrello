/*

    Agile SCRUM for Trello Boards Google Chrome Extension
    Copyright (C) 2015  Xavi Esteve

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

*/
var AST = AST || {};

(function( d ){ 'use strict';

$( d ).ready(function(){

AST = (function ( A ) {

	var appName 			= 'Agile SCRUM for Trello boards',
		appVersion 			= '1.4.3',

		regexFraction 		= /\([0-9\.]{1,6}\/[0-9\.]{1,6}\)/,
		regexFractionDone 	= /\([0-9\.]{1,6}\//,
		regexFractionTotal 	= /\/[0-9\.]{1,6}\)/,
		regexNumberTotal 	= /\([0-9\.]{1,5}\)/,
		regexNumeric 		= /[0-9\.]+/,
		regexProjectTag 	= /\[([a-zA-ZáãàâäéèẽêëíìĩîïóòõôöúùũûüçÁÃÀÂÄÉÈẼÊËÍÌĨÎÏÓÒÕÔÖÚÙŨÛÜÇ0-9 \_\-\.\#]*)\]/g,
		regexHeader			= />\*{3} .+ \*{3}$/i,
		regexShortLink 		= /c\/([^/]+)\/.+/g,

		storyPointDecimals 	= 1,

		bodyColor 			= false,
		bodyWidth           = 0,
		cssStoryPoints 		= '',

		runTimer 			= false,
		runTimerInterval 	= 5000,
		runTimerChecksum 	= 0,

		currentListElement 	= false,
		currentListDone 	= 0,
		currentListTotal 	= 0,

		currentHeaderElement = false,
		currentHeaderDone 	= 0,
		currentHeaderTotal 	= 0,

		currentCardElement 	= false,
		currentCardDone 	= 0,
		currentCardTotal 	= 0,
		currentCardTitle 	= false,
		currentCardFraction = false;




		/**
		 * Initialize extension
		 */
		A.init = function()
		{
			console.info( appName + ' v' + appVersion + ' started' );
			_start();
			_run();
		};


		/**
		 * Runs on page load only and gets things started
		 */
		var _start = function()
		{
			var cardId = null,
				cardDetailOpen = null;
				
			_run();

			$('.window-wrapper').bind("DOMSubtreeModified",function(){
			if ( window.location.href.match(regexShortLink) && !cardDetailOpen )
			{
				cardId = regexShortLink.exec( window.location.href )[1];
				regexShortLink.lastIndex = 0;
				cardDetailOpen = true;
			} 
			else if ( !window.location.href.match( regexShortLink ) && cardDetailOpen )
			{
				cardDetailOpen = false;
				_run();
			}
		});



			runTimer = setInterval(function(){
				_checkForChanges();
			}, runTimerInterval );
		};


		/**
		 * Counts the number of characters in div#board to see if anything changed
		 * Not the most reliable method but better than the old one
		 * See: https://github.com/luckyshot/agilescrumfortrello/issues/5
		 */
		var _checkForChanges =  function()
		{
			var currentChecksum = $('#board').html().length;

			if ( runTimerChecksum !== currentChecksum )
			{
				runTimerChecksum = currentChecksum;
				_run();
			}
		};


		/**
		 * Refreshes the whole page
		 */
		var _run = function()
		{
			// Get body color
			bodyColor = ( $('body').css('background-color') && !$('body').hasClass('body-custom-board-background') ) ? $('body').css('background-color') : 'rgb(55, 158, 90)';

			// Clean previous elements
			_removeElements();

			// Loop through Lists
			$('#board').find('.list-cards').each(function(){

				currentListElement = $(this);

				// Loop through Cards
				currentListElement.find('.list-card').each(function(){

					currentCardElement = $(this);

					// if the card is the textbox then ignore it
					if ( _isCardATextBox( currentCardElement ) ) { return -2; }



					// Reset title
					if (  !$( currentCardElement ).find('.list-card-title').html().match(/<small /g) )
					{
						currentCardTitle = $( currentCardElement ).find('.list-card-title').html();
						currentCardElement.data('original', currentCardTitle );
					}
					else
					{
						currentCardTitle = currentCardElement.data('original');
						$( currentCardElement ).find('.list-card-title').html( currentCardTitle );
					}



					// Is Card a header?
					if ( _isCardAHeader( currentCardTitle ) )
					{
						// If there's a previous header then process it and reset it
						if ( currentHeaderTotal > 0 )
						{
							_finishHeader();
						}
						// Set as the current header
						currentHeaderElement = currentCardElement;

						// Style it (remove *** and add the CSS class)
						currentHeaderElement[0].innerHTML = currentHeaderElement[0].innerHTML.replace(/( ?\*\*\* ?)/g, '');
						currentHeaderElement.addClass( 'scrum-card-header' );
					}


					// Get card Story Points (fraction style)
					else if ( currentCardTitle.match( regexFraction ) ) // (1/2)
					{
						currentCardFraction 	= currentCardTitle.match( regexFraction )[0];
						currentCardDone 		= _getNumber( currentCardFraction.match( regexFractionDone )[0] );
						currentCardTotal 		= _getNumber( currentCardFraction.match( regexFractionTotal )[0] );
					}

					// Get card Story Points (whole number style)
					else if ( currentCardTitle.match( regexNumberTotal ) ) // (1)
					{
						currentCardTotal = _getNumber( currentCardTitle.match( regexNumberTotal )[0] );
					}





					// Card formatting

					// Add red class if overrun
					if ( currentCardDone == currentCardTotal )
					{
						cssStoryPoints = ' perfect';
					}
					else if ( currentCardDone > currentCardTotal )
					{
						cssStoryPoints = ' overrun';
					}
					else
					{
						cssStoryPoints = '';
					}

					// Display Story points
					currentCardElement[0].innerHTML = currentCardElement[0].innerHTML.replace( regexNumberTotal, _formatCardPoints );
					currentCardElement[0].innerHTML = currentCardElement[0].innerHTML.replace( regexFraction, _formatCardPoints );
					currentCardElement[0].innerHTML = currentCardElement[0].innerHTML.replace( regexProjectTag, _formatCardProjectTag );

					// display Progress bar
					if ( currentCardTotal > 0 )
					{
						// Display Card progress bar
						bodyWidth = currentCardDone / currentCardTotal * 100;
						currentCardElement.prepend( '<div class="scrum-card-progress' + cssStoryPoints + '" style="background-color:' + bodyColor + ';width:' + ( bodyWidth <= 100 ? bodyWidth : 100 ) + '%"></div>');

						// Increase card font size depending on its SP
						$( currentCardElement[0] )
							.css('font-size', ( (currentCardTotal < 8) ? (90 + (5*currentCardTotal) ) : 130 ) + '%' )
							.css('line-height', '1.2em');
					}



					// Update list Story Points
					currentListDone 	= currentListDone + currentCardDone;
					currentListTotal 	= currentListTotal + currentCardTotal;


					// Update header Story Points if there is a current one
					if ( currentHeaderElement )
					{
						currentHeaderDone  = currentHeaderDone + currentCardDone;
						currentHeaderTotal = currentHeaderTotal + currentCardTotal;
					}

					// now reset the Card for the next one
					currentCardElement 	= false;
					currentCardTitle 	= currentCardFraction 	= '';
					currentCardTotal 	= currentCardDone 		= 0;


				}); // end loop Cards




				// last header
				if ( currentHeaderTotal > 0 )
				{
					_finishHeader();
				}

				// display List Story Points
				currentListElement.parent().prepend('<small class="scrum-list-total' + cssStoryPoints + '"><span class="scrum-light">' + currentListDone.toFixed( storyPointDecimals ) + '/</span>' + currentListTotal.toFixed( storyPointDecimals ) + '</small>');

				// display List progress bar
				if ( currentListTotal > 0 )
				{
					bodyWidth = currentListDone / currentListTotal * 100;
					currentListElement.parent('.list').prepend('<div class="scrum-list-progress"  style="background-color:' + bodyColor + ';width:' + ( bodyWidth <= 100 ? bodyWidth : 100 ) + '%"></div>');
				}

				// now reset it for the next one
				currentListElement 	= false;
				currentListDone 	= currentListTotal 	= 0;

			}); // end loop Lists

		}; // _run


		/**
		 * Remove previously created elements
		 */
		var _removeElements = function()
		{
			$('.scrum-list-total,.scrum-list-progress,.scrum-card-progress').remove();
		};


		/**
		 * Is this card the one with an input text (the last one)?
		 */
		var _isCardATextBox = function()
		{
			return currentCardElement.hasClass('js-composer');
		};


		/**
		 * Checks the title for '***' '***'
		 */
		var _isCardAHeader = function( title )
		{
			return title.match( regexHeader );
		};


		/**
		 * Resets the header points and sets the header nicely
		 */
		var _finishHeader = function()
		{
			$( currentHeaderElement.find('.list-card-title')[0] ).prepend( '<small class="scrum-card-points'+((currentHeaderDone>currentHeaderTotal)?' overrun':'')+'"><span class="scrum-light">' + currentHeaderDone.toFixed( storyPointDecimals ) + '/</span>' + currentHeaderTotal.toFixed( storyPointDecimals ) + '</small>' );
			currentHeaderDone = currentHeaderTotal = 0;
		};


		/**
		 * Extract number from string
		 */
		var _getNumber = function( str )
		{
			return parseFloat( str.match( regexNumeric )[0] );
		};


		/**
		 * Convert [project] strings to HTML
		 */
		var _formatCardProjectTag = function( match )
		{
			return '<small class="scrum-card-project" style="background:' + _stringToColor( match ) + '">' + match.replace( /\[|\]/g, '' ).toUpperCase() + '</small>';
		};


		/**
		 * Convert (storypoint) strings to HTML
		 */
		var _formatCardPoints = function( match )
		{
			return '<small class="scrum-card-points' + cssStoryPoints + '">' + match.replace( /\(|\)/g, '' ).toUpperCase() + '</small>';
		};


		/**
		 * Generate random color from a string
		 */
		var _stringToColor = function( s )
		{
			var r = 0,
				i = 0,
				len = s.length;

			s = s.toLowerCase();

			for ( ; i < len; i++ )
			{
				r += (s.charAt(i).charCodeAt() * 900);
			}
			return 'hsla('+(r % 256)+',50%,40%,1)';
		};






	return A;

})( AST || {} );


AST.init();


}); // jQuery document ready

}( document ));
