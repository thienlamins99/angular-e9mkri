// import { ViewUpdate } from '@codemirror/view';
import { EditorState } from '@codemirror/state';

// export const singleLineExtension = (viewUpdate: ViewUpdate) => {
//     if (viewUpdate.changes) {
//         const totalLines = viewUpdate.state.doc.lines;
//         if (totalLines > 1) {
//             const newDocContent = viewUpdate.state.doc.sliceString(0).replace(/[\r\n]/g, '');
//             viewUpdate.state.doc.lines
//             const transaction = viewUpdate.state.update(
//                 {
//                     changes:
//                     {
//                         from: 0,
//                         to: viewUpdate.startState.doc.length + 1, // merging lines
//                         insert: newDocContent
//                     }
//                 }
//             );
//             viewUpdate.view.dispatch(transaction);
//         }
//     }
// }
// ! USAGE:
// EditorState.create({
//     ...,
//     extensions: [
//         ...
//         EditorView.updateListener.of((viewUpdate) => {
//             singleLineExtension(viewUpdate);
//         })
//         ...
//     ],
//     ...
// });

export const singleLineExtension = () =>
  EditorState.transactionFilter.of((tr) => {
    return tr.newDoc.lines > 1 ? [] : [tr];
  });
// ! USAGE:
// EditorState.create({
//     ...,
//     extensions: [
//         ...
//         singleLineExtension(),
//         ...
//     ],
//     ...
// });
