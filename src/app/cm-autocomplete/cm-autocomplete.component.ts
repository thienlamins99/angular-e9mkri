import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { defaultKeymap, history } from '@codemirror/commands';
import {
  closeBrackets,
  autocompletion,
  CompletionSource,
  CompletionContext,
  Completion,
} from '@codemirror/autocomplete';
import { bracketMatching } from '@codemirror/language';
import { singleLineExtension } from './cm-utils/cm-one-line';
import { CmStateService } from './cm-state.service';

@Component({
  selector: 'cm-autocomplete',
  standalone: true,
  templateUrl: './cm-autocomplete.component.html',
  styleUrls: ['./cm-autocomplete.component.scss'],
})
export class CmAutocompleteComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() id = '';
  @Input() autocompletionOptions: Array<Completion> = [];

  @Output() ready = new EventEmitter();

  @ViewChild('cmParent') cmParent!: ElementRef<HTMLDivElement>;

  cmView!: EditorView;
  cmState!: EditorState;

  currentEditorValue = '';

  constructor(private __cmState: CmStateService) {}

  ngAfterViewInit() {
    this.buildCodeMirror();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && changes['id'].currentValue) {
      this.__cmState.register(this.id);
      this.ready.next(true);
    }
  }

  buildCodeMirror() {
    this.buildCodeMirrorState();
    this.buildCodeMirrorView();
  }

  buildCodeMirrorState() {
    // ! Repair Autocompletion override CompletionSource
    const autocompletionCompletionSource: CompletionSource = (
      context: CompletionContext
    ) => {
      let word = context.matchBefore(/\w*/);
      if (word) {
        if (word.from == word.to && !context.explicit) {
          return null;
        }
        return {
          from: word.from,
          options: this.autocompletionOptions,
        };
      }
      return null;
    };
    // ! BUILD STATE
    this.cmState = EditorState.create({
      doc: '',
      extensions: [
        placeholder('Press Ctrl + Space or Enter something...'),
        keymap.of(defaultKeymap),
        closeBrackets(),
        bracketMatching(),
        singleLineExtension(),
        autocompletion({
          override: [autocompletionCompletionSource],
          icons: false,
        }),
        EditorView.updateListener.of((viewUpdate) => {
          this.emitEditorValue(viewUpdate.state.doc.toString());
        }),
      ],
    });
  }

  buildCodeMirrorView() {
    // ! BUILD VIEW
    this.cmView = new EditorView({
      extensions: [basicSetup, history()],
      state: this.cmState,
      parent: this.cmParent.nativeElement,
    });
  }

  emitEditorValue(value: string) {
    if (this.currentEditorValue !== value) {
      this.currentEditorValue = value;
      this.__cmState.values[this.id].next(value);
    }
  }

  ngOnDestroy() {
    this.ready.complete();
    this.__cmState.unregister(this.id);
  }
}
