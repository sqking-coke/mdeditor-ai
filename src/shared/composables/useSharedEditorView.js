import { ref } from 'vue'

export const sharedEditorView = ref(null)

export function useSharedEditorView() {
  function setEditorView(view) {
    sharedEditorView.value = view
  }

  function getEditorView() {
    return sharedEditorView.value
  }

  function getSelectedText() {
    const view = sharedEditorView.value
    if (!view) return ''
    const { state } = view
    const selection = state.selection.main
    if (selection.from === selection.to) return ''
    return state.doc.sliceString(selection.from, selection.to)
  }

  function replaceSelectedText(newText) {
    const view = sharedEditorView.value
    if (!view) return false
    const { state } = view
    const selection = state.selection.main
    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: newText }
    })
    view.focus()
    return true
  }

  function insertAtCursor(text) {
    const view = sharedEditorView.value
    if (!view) return false
    const pos = view.state.selection.main.head
    view.dispatch({
      changes: { from: pos, insert: text }
    })
    view.focus()
    return true
  }

  return {
    setEditorView,
    getEditorView,
    getSelectedText,
    replaceSelectedText,
    insertAtCursor
  }
}
