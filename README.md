## Solarized extended theme for Logseq
<table border="0">
 <tr>
    <td>
        <p align="center">
            <a href="https://github.com/yoyurec/logseq-solarized-extended-theme">
                <img src="icon.png" alt="logo" height="128" />
            </a>
        </p>
    </td>
    <td>
        <ul>
            <li>Light & dark vesions!
            <li>Powered up ⚡ with custom JS 👨‍💻
            <li>Auto <b>favicons</b> for external links!
            <li>Tabs plugin support, reposition & recolor - now like in real browser
            <li>Background image (can be customized, see README)
            <li>Changed dafault UI icons, new added
            <li>Custom main toolbar: nav arrows on left side, hidden home, redesigned search
            <li>Sticky bullets (1st level)! (can be disabled, see README)
            <li>Colored tasks statuses & priorities
            <li>Redesigned admonition blocks
            <li>Compact QUERY results header: settings, table toggler
            <li>Bullet Threading plugin support
            <li>`#kanban` columns (no plugin needed)
            <li>"Fira Sans" narrow font
            <li>etc...
        </ui>
    </td>
 </tr>
</table>

## If you ❤ what i'm doing - you can support my work! ☕
<a href="https://www.buymeacoffee.com/yoyurec" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 50px !important;width: 178px !important;" ></a>
<!-- - <a href='https://ko-fi.com/yoyurec' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a> -->


## Screenshots
![Light Mode](screenshots/theme.png)

More here - https://github.com/yoyurec/logseq-solarized-extended-theme/tree/main/screenshots

[![SWU-banner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://vshymanskyy.github.io/StandWithUkraine)

## Installation
This theme is available on the Marketplace.

![](./screenshots/market.png)

**⚠ If you want to use unpacked plugin, you MUST put it near others, to `C:\Users\%YOUR-USERNAME%\.logseq\plugins\logseq-solarized-extended-theme` to proper work!!!**

## Recommended plugins
* [Tabs](https://github.com/pengx17/logseq-plugin-tabs)
* [Bullet Threading](https://github.com/pengx17/logseq-plugin-bullet-threading)
* [TODO Master](https://github.com/pengx17/logseq-plugin-todo-master)
* [TOC Generator](https://github.com/sethyuan/logseq-plugin-tocgen)

## Features and customizations
### 🖼 Background image:
* go to https://unsplash.com
* choose any image, click (go to its details page with bigger image)
* right click on image, "copy image link",
* edit address in `--bg-url` variable
* paste code to your `custom.css`
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --bg-url: url(https://images.unsplash.com/photo-1524946274118-e7680e33ccc5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80);
    }
```
#### To remove image and set solid color or even gradient:

```css
    :root {
        --bg-url: none;
        --bg-overlay: #d7d1c1;
    }
```

### ⭐ Auto favicons for external links

<img src="screenshots/favicons.png" width="640">


### 📌 Sticky 1st level bullets:
Feature is enabled by default!

To disable:
* paste this CSS to your `custom.css` file
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --no-sticky-levels: true; /* Disable "Sticky level 1 items" */
    }
```
![Sticky levels-1](screenshots/sticky-levels.gif)


### 🔍 Search panel
You can edit button text, maybe you want to translate it ;)
* paste this CSS to your `custom.css` file
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --search-field-text: 'Search or create page';
        --search-field-text-short: 'Search...'; /* for narrow screen */
    }
```
![Search panel](screenshots/search-panel.gif)


### 🏠 Hidden "home button":
I decided do this, b'cose home brings to journals page... doesn't clicking "Journals" doing the same?

![home](screenshots/home.png)

Feature is enabled by default!
To disable:
* paste this CSS to your `custom.css` file
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --no-hidden-home: true;  /* Disable hiding home */
    }
```


### 🗂 Tabs plugin
Theme supports [Tabs plugin](https://github.com/pengx17/logseq-plugin-tabs) - panel was moved to top & recolored

![tabs](screenshots/tabs.png)


### 🚥 Kanban board
Just add `#kanban` tag to parent block and all children will become columns!

Recommend additionally to install [Logseq Plugin TODO Master](https://github.com/pengx17/logseq-plugin-todo-master)
and check [Logseq template](./extra/Kanban%20template.md)
<img src="screenshots/kanban.png" width="800">

### 📋 Compact QUERY results header
![queries](screenshots/queries.png)

### 📝 Redesigned admonition blocks
![admonition](screenshots/admonition.png)


### 📏 Sizes:
```css
    :root {
        --ls-main-content-max-width: 1200px; /* content width */
        --ls-main-content-max-width-wide: 1600px; /* content width in "wide mode" (t w) */
        --ls-left-sidebar-width: 250px;
        --ls-right-sidebar-width: 500px;
    }
```


### 🎨 Colors palette:
To set your own look:
* Paste code to your `custom.css` and edit values
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
/* Colors palette */
.light,
.light-theme,
html[data-theme='light'] {
    --bg-overlay: #77777777; /* Background solid color or gradient*/

    --cp-accent: #2aa198;
    --cp-accent-opacity: #e1efe1;
    --cp-accent-opacity-semi: #99d4c7;

    --cp-white-light: #fefcf5;
    --cp-white: #fef9ec;
    --cp-white-dark: #efe9d7;
    --cp-white-darker: #f3efe2;
    --cp-dark: #d7d1c1;
    --cp-black: #333333;
    --cp-gray: #cccccc;

    --cp-red: #d3455b;
    --cp-orange: #ffa542;
    --cp-yellow: #f6c423;
    --cp-yellow-light: #ffe79a;
    --cp-green: #27ae9e;
    --cp-blue: #2c89d9;
    --cp-purple: #9c739c;
    --cp-cherry: #955f60;

    --ls-link-text-hover-color: var(--cp-black);
    --mark-bg: var(--cp-yellow-light);
    --inline-code-bg: var(--cp-white-light);
}
.dark,
.dark-theme,
html[data-theme='dark'] {
    --bg-overlay: #1a1a1a99; /* Background solid color or gradient*/

    --cp-accent: #b88f0a;
    --cp-accent-dim: #ccb233;
    --cp-accent-opacity: #3c442f;
    --cp-accent-opacity-semi: #6a531f;

    --cp-white-light: #002b35;
    --cp-white: hsl(192deg 60% 12%);
    --cp-white-dark: hsl(192deg 50% 11%);
    --cp-white-darker: hsl(192deg 40% 10%);
    --cp-dark: #243e45;
    --cp-black: #aaaaaa;
    --cp-gray: #272f30;

    --cp-red: #d3455b;
    --cp-orange: #ffa542;
    --cp-yellow: #f6c423;
    --cp-yellow-light: #ffe79a;
    --cp-green: #27ae9e;
    --cp-blue: #2c89d9;
    --cp-purple: #9c739c;
    --cp-cherry: #955f60;

    --ls-link-text-color: var(--cp-accent-dim);
    --ls-link-text-hover-color: var(--cp-black);
    --mark-bg: var(--cp-accent-opacity-semi);
    --inline-code-bg: var(--cp-white-light);
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
