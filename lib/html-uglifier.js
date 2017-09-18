'use babel';

import HtmlUglifierView from './html-uglifier-view';
import { CompositeDisposable } from 'atom';

export default {

  htmlUglifierView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.htmlUglifierView = new HtmlUglifierView(state.htmlUglifierViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.htmlUglifierView.getElement(),
      visible: false
    });

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html-uglifier:uglifySelection': () => this.uglify('selection'),
      'html-uglifier:uglifyAll': () => this.uglify('all')
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.htmlUglifierView.destroy();
  },

  serialize() {
    return {
      htmlUglifierViewState: this.htmlUglifierView.serialize()
    };
  },

  uglify(portion) {

    let editor = atom.workspace.getActiveTextEditor();

    function replaceIt(text) {
      return text.replace(/\s+/g, ' ').replace(/>\s+</g, '><');
    }

    console.log("Uglifying started!")

    if (portion === 'all') {
      editor.setText(
        replaceIt(
          editor.getText()
        )
      )
    } else {
      editor.insertText(
        replaceIt(
          editor.getSelectedText()
        )
      );
    }

    console.log("Uglifying ended!");
  }
};
