## Solarized extended theme for Logseq (light only!)
<table border="0">
 <tr>
    <td>
        <p align="center">
            <a href="https://github.com/yoyurec/logseq-solarized-extended-theme">
                <img src="https://raw.githubusercontent.com/yoyurec/logseq-solarized-extended-theme/main/icon.png" alt="logo" height="128" />
            </a>
        </p>
    </td>
    <td>
        <ul>
            <li>"Fira Sans" narrow font
            <li>Custom main toolbar: arrows, search
            <li>Sticky level-1 content items!
            <li>Colored TODO tasks statuses & priorities
            <li>Narrow QUERY table, `#kanban` columns
            <li>Favicons
            <li>Background image, borders, shadows, etc...
        </ui>
    </td>
 </tr>
</table>

## If you want to support my work ☕
<a href='https://ko-fi.com/yoyurec' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>

## Screenshots
![Light Mode](screenshots/light.png)
More here - https://github.com/yoyurec/logseq-solarized-extended-theme/tree/main/screenshots

[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine)

## Usage
### Marketplace
This theme is available on the Marketplace.

![](./screenshots/market.png)

### Using custom.css
Add this to your 'custom.css' page in Logseq:
```css
@import url('https://cdn.jsdelivr.net/gh/yoyurec/logseq-solarized-extended-theme@main/custom.css');
```

## Features and customizations
### 🖼 Background image:
* go to https://unsplash.com , choose any image,
* right click, "copy image link",
* edit address in `--bg-url` variable
* paste code to your `custom.css`

```css
html[data-theme=light],
.white-theme,
.light-theme {
    --bg-url: url(https://images.unsplash.com/photo-1511014437194-85e903a0c1b4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2127&q=80);
}

```
### 📌 Sticky levels-1:
Feature is enabled by default!
To disable - put this CSS to your `custom.css`

```css
    :root {
        --no-sticky-levels: true; /* Disable "Sticky level 1 items" */
    }
```
![Sticky levels-1](screenshots/sticky-levels.gif)

### 🔍 Search panel
Some positioning styles already applied...

**BUT!** for better work you need to copy content from my [custom.js](custom.js) to yours.
*(if it doesn't exist - just copy file to `graph/logseq` folder, restart LS and allow to run script)*

![Search panel](screenshots/search-panel.gif)
### 🎨 Colors palette:

```css
html[data-theme=light],
.white-theme,
.light-theme {
    --cp-accent: #2aa198;
    --cp-accent-opacity: #2aa19820;
    --cp-accent-opacity-semi: #2aa19870;

    --cp-white: #fef9ec;
    --cp-white-dark: #f3efe2;
    --cp-white-darker: #efe9d7;
    --cp-dark: #d7d1c1;
    --cp-black: #333333;
    --cp-gray: #aaaaaa;
}
```

## What is Logseq?
Logseq is a privacy-first, open-source knowledge base. Visit https://logseq.com for more information.

## Support
If you have any questions, issues or feature request, use the issue submission on GitHub: https://github.com/yoyurec/logseq-solarized-extended-theme/issues

## Credits

-   Icon - Keiran O'Leary https://dribbble.com/shots/6361500-Alacritty-Terminal-Icon
-   Other - in CSS comments

## License

[MIT License](./LICENSE)
