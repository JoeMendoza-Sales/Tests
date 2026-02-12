---
title: "Long Text Todo"
checksumTestId: Mn3Op
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Type a very long text (200+ characters) in #todoInput: "This is a very long todo item that tests how the application handles extended text content. It should wrap properly and not break the layout. The user should be able to read the entire text of this todo item without any truncation issues."
3. Click the "Add" button (.btn-primary)
4. Verify the todo item is created and the long text is displayed (may wrap to multiple lines)
5. Verify the todo item layout is not broken (checkbox, delete, and edit buttons are still visible and accessible)
