---
title: "Edit Todo Due Date"
checksumTestId: Gh7Ij
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Type "Task with date" in #todoInput and click the "Add" button (no due date)
3. Verify the todo item is visible with no due date displayed
4. Click the edit button (.btn-icon with pencil icon) on the todo item
5. Verify the edit form (.edit-form) appears
6. Click on the date input field in the edit form and select a future date (14 days from today)
7. Click the Save button (.btn-save)
8. Verify the todo now displays the selected due date in the .todo-due element
