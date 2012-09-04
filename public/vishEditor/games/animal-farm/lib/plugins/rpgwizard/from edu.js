Dialog.printAtWordWrap = function(context, text, x, y, lineHeight, fitWidth, align) {
    fitWidth = fitWidth || 0;
    lineHeight = lineHeight || 20;
    var currentLine = 0;
    var lines = text.split(/\r\n|\r|\n/);
    for(var line = 0; line < lines.length; line++) {
        if(fitWidth <= 0) {
            context.fillText(lines[line], x, y + (lineHeight * currentLine));
        } else {
            var words = lines[line].split(' ');
            var idx = 1;
            while(words.length > 0 && idx <= words.length) {
                var str = words.slice(0, idx).join(' ');
                var w = context.measureText(str).width;
                if(w > fitWidth) {
                    if(idx == 1) {
                        idx = 2;
                    }
                    context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
                    currentLine++;
                    words = words.splice(idx - 1);
                    idx = 1;
                } else {
                    idx++;
                }
            }
            if(idx > 0)
                context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
        }
        currentLine++;
    }
}


********************************************************************************


Dialog.prototype.draw = function(ctx) {
    ctx.save();
    var blueGradient = ctx.createLinearGradient(0, 0, 0, 250);
    blueGradient.addColorStop(0, "black");
    blueGradient.addColorStop(1, "blue");
    ctx.fillStyle = blueGradient;
    ctx.lineJoin = "round";
    ctx.lineWidth = this.cornerRadius;
    ctx.strokeRect(this.posX + (this.cornerRadius / 2), this.posY + (this.cornerRadius / 2), this.width - this.cornerRadius, this.height - this.cornerRadius);
    ctx.fillRect(this.posX + (this.cornerRadius / 2), this.posY + (this.cornerRadius / 2), this.width - this.cornerRadius, this.height - this.cornerRadius);
    ctx.drawImage(this.drawedFace, -340, 135);
    ctx.font = "bold 14px monospace"
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    Dialog.printAtWordWrap(ctx, this.text, -165, 145, 20, 500);
    ctx.restore();
}


