const vscode = require('vscode');
const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/.env`});

function showTranslation() {

    var sourceLanguage;
    var targetLanguage;
    var textToTranslate;
    
    vscode.window.showInputBox({
        placeHolder: 'Source language'
    }).then((lang) => {
        sourceLanguage = lang;
        vscode.window.showInputBox({
            placeHolder: 'Target language'
        }).then((lang) => {
            targetLanguage = lang;
            vscode.window.showInputBox({
                placeHolder: 'Text to translate'
            }).then((text) => {
                textToTranslate = text;
            }).then(() => {
                const request = require('request');
                let options = {
                    method: 'GET',
                    url: 'https://translated-mymemory---translation-memory.p.rapidapi.com/get',
                    qs: {langpair: `${sourceLanguage}|${targetLanguage}`, q: textToTranslate, mt: '1', onlyprivate: '0', de: 'a@b.c'},
                    headers: {
                        'X-RapidAPI-Key': process.env.APIKey,
                        'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com',
                        useQueryString: true
                    }
                    };
                
                    request(options, function (error, response, body) {
                        if (error) vscode.window.showInformationMessage(`Can\'t translate text ${Error(error).message}`);

                        vscode.window.showInformationMessage(
                            `Translated text: ${decodeURI(JSON.parse(body).responseData.translatedText)}`);
                    });
            })
        })
    }
    );
}

function activate(context) {

    console.log('Extension "etra" is now active!');

    let disposable = vscode.commands.registerCommand('extension.translate', function () {
        showTranslation();
        console.log('end');
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;