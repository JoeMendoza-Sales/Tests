---
title: "Special Characters"
checksumTestId: Lm2No
startUrl: https://joetodoapp-a03b4.web.app/
---

## Test Steps

1. Clear localStorage and navigate to https://joetodoapp-a03b4.web.app/
2. Type the following text in #todoInput: "Test <script>alert('XSS')</script> & \"quotes\" task"
3. Click the "Add" button (.btn-primary)
4. Verify a new todo item appears in the todo list
5. Verify no JavaScript alert dialog appears (XSS prevention)
6. Verify the special characters are displayed correctly (angle brackets, ampersand, quotes shown as literal characters)
