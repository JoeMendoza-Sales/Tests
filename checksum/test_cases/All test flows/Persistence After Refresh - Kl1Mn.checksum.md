---
title: "Persistence After Refresh"
checksumTestId: Kl1Mn
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Type "Persistent task" in #todoInput and click the "Add" button
3. Verify the todo item with text "Persistent task" is visible
4. Refresh the page
5. Verify the todo item with text "Persistent task" is still visible after refresh
6. Verify the todo maintains its unchecked state
