---
title: "Edit Todo Cancel"
checksumTestId: Hi8Jk
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Type "Do not change me" in #todoInput and click the "Add" button
3. Verify the todo item with text "Do not change me" is visible
4. Click the edit button (.btn-icon with pencil icon) on the todo item
5. Clear the text input and type "This should be discarded"
6. Click the Cancel button (.btn-cancel)
7. Verify the todo text still displays "Do not change me" (original text unchanged)
