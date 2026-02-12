---
title: "Multiple Todos Management"
checksumTestId: No4Pq
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Add first todo: Type "Buy milk" in #todoInput and click "Add"
3. Add second todo: Type "Call dentist" in #todoInput and click "Add"
4. Verify both "Buy milk" and "Call dentist" are visible in the todo list
5. Mark "Buy milk" as complete by clicking its checkbox
6. Verify "Buy milk" shows completed styling (strikethrough)
7. Click the edit button on "Call dentist", change text to "Call doctor", and click Save
8. Verify the todo now displays "Call doctor"
9. Click the delete button on "Buy milk"
10. Verify "Buy milk" is removed and only "Call doctor" remains in the list
