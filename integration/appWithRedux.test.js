describe('appWithRedux', () => {
    it('base example, visually looks correct', async () => {
        // APIs from jest-puppeteer
        await page.setDefaultNavigationTimeout(0)
        await page.goto('http://localhost:9009/iframe.html?id=todolist-appwithredux-stories--app-with-redux-basic&viewMode=story');
        const image = await page.screenshot();

        // API from jest-image-snapshot
        expect(image).toMatchImageSnapshot();
    });
});

// iframe.html?id=
// yarn run updateSnapshot