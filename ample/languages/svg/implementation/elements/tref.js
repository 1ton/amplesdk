/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_tref	= function(){};
cSVGElement_tref.prototype	= new cSVGElement;

if (cSVGElement.useVML) {

	cSVGElement_tref.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x":
					case "y":
					case "dx":
					case "dy":
						this.$getContainer().path	= 'm ' + [(this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : 0)) * 1 + (this.getAttribute("dx") || 0) * 1, (this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : 0)) * 1 + ((this.getAttribute("dy") || 0)) * 1].map(Math.round) + ' r 1000,0 x';
						break;
					case "xlink:href":
						var oTextPath = this.ownerDocument.getElementById(oEvent.newValue.substr(1));
						if (oTextPath)
							this.$getContainer().path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
				setTimeout(function() {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1));
					if (oRef instanceof cSVGElement_text && oRef.firstChild instanceof AMLCharacterData)
						that.$getContainer().getElementsByTagName("textpath")[0].string	= oRef.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');
				});
			}
			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		}
	};

	// presentation
	cSVGElement_tref.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
			// Font size calculations
			aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:' + (this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")) + 'px;top:' + (this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")) + 'px;"\
					path="m ' + [(this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : 0)) * 1 + (this.getAttribute("dx") || 0) * 1, (this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : 0)) * 1 + (this.getAttribute("dy") || 0) * 1].map(Math.round) + ' r 1000,0 x" allowoverlap="false"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />';
	};

	cSVGElement_tref.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

//Register Element with language
oSVGNamespace.setElement("tref", cSVGElement_tref);