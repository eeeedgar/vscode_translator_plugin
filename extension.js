const vscode = require('vscode');
const dotenv = require('dotenv');
dotenv.config({path: `${__dirname}/.env`});


function activate(context) {
    console.log('Etra activated.')
    let disposable = vscode.commands.registerCommand('extension.translate', code)
    context.subscriptions.push(disposable)
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;

function getLanguage(codes, placeholder) {
    return new Promise((resolve) => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.placeholder = placeholder;
      quickPick.selectMany = false;
      quickPick.items = codes.map(label => ({ label }));
      quickPick.onDidAccept(() => {
        const selection = quickPick.activeItems[0];
        resolve(selection.label);
        quickPick.hide();
      })
      quickPick.onDidChangeValue(() => {
        if (! codes.includes(quickPick.value)) {
          const newItems = [quickPick.value, ...codes].map(label => ({ label }));
          quickPick.items = newItems;
        }
      })
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    })
}


function getText() {
    return vscode.window.showInputBox({placeHolder: 'Text to translate'});
}

function showTranslationLol(sourceLanguage, targetLanguage, textToTranslate) {
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
}


  async function code() {
    
    let languages = ['ru', 'en', 'es', 'it', 'pt'];

    let sourceLanguage = await getLanguage(languages, 'Insert source language');
    console.log(sourceLanguage);

    let targetLanguage = await getLanguage(languages, 'Insert target language');
    console.log(targetLanguage);

    let text = await getText();
    console.log(text);

    showTranslationLol(sourceLanguage, targetLanguage, text);

  }