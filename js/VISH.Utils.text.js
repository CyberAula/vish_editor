VISH.Utils.text = (function(V,undefined){
    
    /**
    * Divide an entire phrase in an array of phrases, all with the max pixel length given.
    * The words are initially separated by the space char.
    * @param phrase
    * @param length
    * @return
    */
    var getLines = function (ctx, phrase, maxPxLength, textStyle) {
        var wa = phrase.split(" "),
            phraseArray = [],
            lastPhrase = "",
            l = maxPxLength,
            measure = 0,
            i = 0,
            w = 0;
            
        ctx.font = textStyle;
        
        for (i=0; i < wa.length; i++) {
            w = wa[i];
            measure = ctx.measureText(lastPhrase+w).width;
            if (measure < l) {
                lastPhrase += (" "+w);
            }else {
                phraseArray.push(lastPhrase);
                lastPhrase = w;
            }
            if (i === wa.length-1) {
                phraseArray.push(lastPhrase);
                break;
            }
        }
        return phraseArray;
    };
    
    return {
        getLines    : getLines
    };
    
}) (VISH);
