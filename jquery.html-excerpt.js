jQuery.fn.htmlExcerpt = function(maxVisibleChars, options) {
	var $ = jQuery

	var rootElement = this.clone()

	if(!options){
		options = {}
	}

	options = $.extend({
		readMoreLinkText: '<div style="margin-top: 5px">[Read More...]</div>',
	}, options)

	var getCharsToTrim = function(){
		return rootElement.text().length - maxVisibleChars
	}

	if(getCharsToTrim() <= 0){
		// The element is already short enough.
		return rootElement
	}

	var suffix = '...'
	var readMoreURL = options.readMoreURL
	if(readMoreURL){
		suffix += ' <a href="' + readMoreURL + '">' + options.readMoreLinkText + '</a>'
	}
	suffix = $("<span>" + suffix + "</span>")

	var limitVisibleChars = function(rootElement, currentElement){
		var loopCount = 0
		while(true){
			loopCount++
			if(loopCount > 1000){
				console.log('$.fn.limitVisibleCharacter() has looped too many times.  Giving up....  Please report this issue to mark@fastmail.net and send the content of the html element you attempted to limit.')
				return;
			}
			
			var contents = currentElement.contents()
			var lastNode = contents[contents.length-1]
			if(!lastNode){
				// We've run out of nodes!
				break;
			}

			if(lastNode.nodeType == 3){ // text nodes
				if(lastNode.textContent.length == 0){
					$(lastNode).remove()
				}
				else{
					var nodeCharsToTrim = Math.min(getCharsToTrim(), lastNode.length)
					var endIndex = lastNode.length-nodeCharsToTrim
					var newTextContent = lastNode.textContent.substring(0, endIndex)
					newTextContent = newTextContent.substring(0, newTextContent.lastIndexOf(' '))
					lastNode.textContent = newTextContent

					var charsToTrim = getCharsToTrim()
					if(charsToTrim <= 0){
						currentElement.append(suffix)
						return true
					}

				}
			}
			else if(lastNode.nodeType == 1){ // element node
				lastNode = $(lastNode)

				if(lastNode.text().length == 0){
					$(lastNode).remove()
				}
				else if(limitVisibleChars(rootElement, lastNode)){
					return true;
				}
			}
		}

		return false
	}

	limitVisibleChars(rootElement, rootElement)

	return rootElement
}