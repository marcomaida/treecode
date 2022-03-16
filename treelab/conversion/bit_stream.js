function text2Binary(string) {
    return string.split('').map(function (char) {
        return char.charCodeAt(0).toString(2);
    }).join(' ');
}

export class BitStreamText {
    constructor (text) {
        this.text = text;
    }

    *getStream(){
        for (const bit of text2Binary(this.text)){
            yield bit == '1'? 1 : 0;
        }

        yield 1; // final extra one
    }
}