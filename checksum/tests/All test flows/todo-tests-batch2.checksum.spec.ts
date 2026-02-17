import { init, IChecksumPage } from "@checksum-ai/runtime";

const { test, defineChecksumTest, expect, checksumAI } = init();

const BASE_URL = 'https://joetodoapp-a03b4.web.app/';

// Helper: Clear localStorage and navigate to the app
async function setupTest(page: IChecksumPage, checksumAI: Function): Promise<void> {
  await checksumAI("Navigate to the Todo app", async () => {
    await page.goto(BASE_URL);
  });
  await page.evaluate(() => localStorage.clear());
  await checksumAI("Reload page after clearing localStorage", async () => {
    await page.reload();
  });
  await page.waitForLoadState('domcontentloaded');
}

// Helper: Add a todo item with optional due date
async function addTodo(page: IChecksumPage, checksumAI: Function, text: string, dueDate?: string): Promise<void> {
  await checksumAI(`Enter todo text: ${text}`, async () => {
    await page.locator('#todoInput').fill(text);
  });
  if (dueDate) {
    await checksumAI(`Set due date to ${dueDate}`, async () => {
      await page.locator('#dueDateInput').fill(dueDate);
    });
  }
  await checksumAI("Click Add button", async () => {
    await page.locator('.btn-primary').click();
  });
}

// Helper: Get a future date string in yyyy-mm-dd format for date input
function getFutureDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper: Format date from yyyy-mm-dd to mm/dd/yy (app's display format)
function formatDateForDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${month}/${day}/${year.slice(-2)}`;
}

test.describe('Todo Application Tests - Batch 2', () => {

  test(
    defineChecksumTest('Edit Todo Due Date', 'Gh7Ij'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Type 'Task with date' in #todoInput and click the 'Add' button (no due date)
      await addTodo(page, checksumAI, 'Task with date');

      // Step 3: Verify the todo item is visible with no due date displayed
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display 'Task with date' text"
      ).toHaveText('Task with date');
      await expect(
        todoItem.locator('.todo-due'),
        "Due date should not be visible initially"
      ).not.toBeVisible();

      // Step 4: Click the edit button (.btn-icon with pencil icon) on the todo item
      await checksumAI("Click the edit button", async () => {
        await todoItem.locator('.btn-icon').first().click();
      });

      // Step 5: Verify the edit form (.edit-form) appears
      const editForm = todoItem.locator('.edit-form');
      await expect(
        editForm,
        "Edit form should be visible"
      ).toBeVisible();

      // Step 6: Click on the date input field and select a future date (14 days from today)
      const futureDateStr = getFutureDateString(14);
      await checksumAI("Fill in future due date", async () => {
        await editForm.locator('input[type="date"]').fill(futureDateStr);
      });

      // Step 7: Click the Save button (.btn-save)
      await checksumAI("Click the Save button", async () => {
        await editForm.locator('.btn-save').click();
      });

      // Step 8: Verify the todo now displays the selected due date in the .todo-due element
      const todoDue = page.locator('.todo-item .todo-due');
      const expectedDateDisplay = `Due: ${formatDateForDisplay(futureDateStr)}`;
      await expect(
        todoDue,
        "Due date should be visible after saving"
      ).toBeVisible();
      await expect(
        todoDue,
        "Due date should display the correct date"
      ).toContainText(expectedDateDisplay);
    }
  );

  test(
    defineChecksumTest('Edit Todo Text', 'Fg6Hi'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Type 'Original task text' in #todoInput and click the 'Add' button
      await addTodo(page, checksumAI, 'Original task text');

      // Step 3: Verify the todo item with text 'Original task text' is visible
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display 'Original task text'"
      ).toHaveText('Original task text');

      // Step 4: Click the edit button (.btn-icon with pencil icon) on the todo item
      await checksumAI("Click the edit button", async () => {
        await todoItem.locator('.btn-icon').first().click();
      });

      // Step 5: Verify the edit form (.edit-form) appears with the current text pre-filled
      const editForm = todoItem.locator('.edit-form');
      await expect(
        editForm,
        "Edit form should be visible"
      ).toBeVisible();
      const textInput = editForm.locator('input[type="text"]');
      await expect(
        textInput,
        "Text input should have original text pre-filled"
      ).toHaveValue('Original task text');

      // Step 6: Clear the text input and type 'Updated task text'
      await checksumAI("Clear the text input", async () => {
        await textInput.clear();
      });
      await checksumAI("Type updated task text", async () => {
        await textInput.fill('Updated task text');
      });

      // Step 7: Click the Save button (.btn-save)
      await checksumAI("Click the Save button", async () => {
        await editForm.locator('.btn-save').click();
      });

      // Step 8: Verify the todo text now displays 'Updated task text'
      await expect(
        page.locator('.todo-item .todo-text'),
        "Todo text should display 'Updated task text' after saving"
      ).toHaveText('Updated task text');
    }
  );

  test(
    defineChecksumTest('Empty State Display', 'Jk0Lm'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Verify the todo list area (#todoList) is visible
      await expect(
        page.locator('#todoList'),
        "Todo list area should be visible"
      ).toBeVisible();

      // Step 3: Verify the empty state element (.empty-state) displays 'No todos yet. Add one above!'
      await expect(
        page.locator('.empty-state'),
        "Empty state message should display correct text"
      ).toHaveText('No todos yet. Add one above!');

      // Step 4: Verify the text input (#todoInput) and 'Add' button (.btn-primary) are visible and ready for use
      await expect(
        page.locator('#todoInput'),
        "Todo input field should be visible"
      ).toBeVisible();
      await expect(
        page.locator('#todoInput'),
        "Todo input field should be editable"
      ).toBeEditable();
      await expect(
        page.locator('.btn-primary'),
        "Add button should be visible"
      ).toBeVisible();
      await expect(
        page.locator('.btn-primary'),
        "Add button should be enabled"
      ).toBeEnabled();
    }
  );

  test(
    defineChecksumTest('Long Text Todo', 'Mn3Op'),
    async ({ page, vs }) => {
      // Step 1: Clear localStorage and navigate
      await setupTest(page, checksumAI);

      // Step 2: Type a very long text (200+ characters) in #todoInput
      const longText = 'This is a very long todo item that tests how the application handles extended text content. It should wrap properly and not break the layout. The user should be able to read the entire text of this todo item without any truncation issues.';
      await checksumAI("Enter long todo text", async () => {
        await page.locator('#todoInput').fill(longText);
      });

      // Step 3: Click the 'Add' button (.btn-primary)
      await checksumAI("Click Add button", async () => {
        await page.locator('.btn-primary').click();
      });

      // Step 4: Verify the todo item is created and the long text is displayed
      const todoItem = page.locator('.todo-item');
      await expect(
        todoItem,
        "Todo item should be visible"
      ).toBeVisible();
      await expect(
        todoItem.locator('.todo-text'),
        "Todo item should display the full long text"
      ).toHaveText(longText);

      // Step 5: Verify the todo item layout is not broken (checkbox, delete, and edit buttons are still visible and accessible)
      await expect(
        todoItem.locator('.todo-checkbox'),
        "Checkbox should be visible"
      ).toBeVisible();
      await expect(
        todoItem.locator('.btn-icon').first(),
        "Edit button should be visible"
      ).toBeVisible();
      await expect(
        todoItem.locator('.btn-icon.delete'),
        "Delete button should be visible"
      ).toBeVisible();
    }
  );
});
