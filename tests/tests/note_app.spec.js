const {test, expect, describe, beforeEach} = require('@playwright/test');
describe('Note app', () => {
    beforeEach(async({page, request})=>{

        await request.post('http://localhost:3001/api/testing/reset')
        await request.post('http://localhost:3001/api/users', {
            data: {
                name: 'Luyinda Reagan',
                username: 'Reagan',
                password: '123456789'

            }
        })
 await page.goto('http://localhost:5173');
    })
test('front page can be opened', async ({page}) => {
    const locator = page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible();
})

test('user can log in', async ({page}) => {
    await page.getByRole('button', {name: 'login'}).click();
    await page.getByLabel('username').fill('Reagan');
    await page.getByLabel('password').fill('123456789');
    await page.getByRole('button', {name: 'login'}).click();

    await expect(page.getByText('Welcome, Luyinda Reagan!')).toBeVisible();
})

describe('when logged in', () => {
    beforeEach(async ({page}) => {
        await page.getByRole('button', {name: 'login'}).click();
        await page.getByLabel('username').fill('Reagan');
        await page.getByLabel('password').fill('123456789');
        await page.getByRole('button', {name: 'login'}).click();
    });
    test('a new note can be created', async ({page}) => {
        await page.getByRole('button', {name: 'new note'}).click()
        await page.getByRole('textbox').fill('a note created by playwright')
        await page.getByRole('button', {name: 'save'}).click()
        await expect(page.getByText('a note created by playwright')).toBeVisible()
})

describe('and a note exists', () => {
    beforeEach(async ({page})=>{
        await page.getByRole('button', {name: 'new note'}).click();
        await page.getByRole('textbox').fill('a note created by playwright');
        await page.getByRole('button', {name: 'save'}).click();
    })

    test('importance can be changed', async ({page}) => {
        await page.getByRole('button', {name: 'make not important'}).click();
        await expect(page.getByText('make important')).toBeVisible();
    })
})
})

test('login fails with wrong password', async ({page}) => {
    await page.getByRole('button', {name: 'login'}).click();
    await page.getByLabel('username').fill('Reagan');
    await page.getByLabel('password').fill('wrongpassword');
    await page.getByRole('button', {name: 'login'}).click();

    await expect(page.getByText('Wrong credentials')).toBeVisible();
})
})