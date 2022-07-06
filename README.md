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
            <li>Light & dark versions!
            <li>Powered up ⚡ with custom JS 👨‍💻
            <li>Auto <b>favicons</b> for external links! <a href="#-auto-favicons-for-external-links">🡖</a>
            <li>Tabs plugin support, reposition & recolor - now like in real browser <a href="#-tabs-plugin">🡖</a>
            <li>Background image (can be customized, see README) <a href="#-background-image">🡖</a>
            <li>Banners plugin support and powered-up! <a href="#-banners-plugin">🡖</a>
            <li>Changed default UI icons, new added
            <li>Custom main toolbar: nav arrows on left side, hidden home, redesigned search <a href="#-search-panel">🡖</a>
            <li>Sticky headers (can be disabled, see README) <a href="#-sticky-1st-level-bullets">🡖</a>
            <li>Colored tasks statuses & priorities
            <li>Redesigned admonition blocks <a href="#-redesigned-admonition-blocks">🡖</a>
            <li>Compact QUERY results header: settings, table toggler <a href="#-compact-query-results-header">🡖</a>
            <li>Bullet Threading plugin support
            <li>Custom `#quote` <a href="#-blockquotes">🡖</a>
            <li>`#kanban` columns (no plugin needed) <a href="#-kanban-board">🡖</a>
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
* [Banners plugin](https://github.com/sawhney17/logseq-banners-plugin)
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
        --bg-url: url(https://images.unsplash.com/photo-1524946274118-e7680e33ccc5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80) !important;
    }
```
#### To remove image and set solid color or even gradient:

```css
    :root {
        --bg-url: none;
    }
    .light,
    .light-theme,
    html[data-theme='light'] {
        --bg-overlay: #77777777 !important;
    }
    .dark,
    .dark-theme,
    html[data-theme='dark'] {
        --bg-overlay: #1a1a1a99 !important;
    }
```
#### To remove page shadow:

```css
    :root {
        --bg-shadow: none;
    }
```

### 🎴 Banners plugin
Theme supports [Banners plugin](https://github.com/pengx17/logseq-plugin-tabs)
Background = blurred banner!
Icon glows!

Demo video: https://www.loom.com/share/31416785f6764a7a80fba271aea4ea79

To disable:
* paste this CSS to your `custom.css` file
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --icon-glow: none; /* Disable icons glow */
        --banner-bg: none; /* Disable blurred background image from banner */
    }
    .is-banner-active #left-container::before {
        background-image: var(--bg-url) !important;  /* Set back original background */
    }
}
```

<img src="screenshots/banner-plugin.png" width="640">

### ⭐ Auto favicons for external links
To disable:
* paste this CSS to your `custom.css` file
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --favicons: none; /* Disable favicons */
    }
```
<img src="screenshots/favicons.png" width="640">


### 📌 Sticky headers (h1-h5 in document root):
Feature is enabled by default!

To disable:
* paste this CSS to your `custom.css` file
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph

```css
    :root {
        --sticky-headers: none; /* Disable "Sticky headers" */
    }
```
![Sticky headers](screenshots/sticky-headers.gif)


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


### 🗂 Tabs plugin
Theme supports [Tabs plugin](https://github.com/pengx17/logseq-plugin-tabs) - panel was moved to top & recolored
![tabs](screenshots/tabs.png)


### 💬 Blockquotes
Just add `#quote` tag to parent block!
<img src="screenshots/quote.png" width="800">


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
* Paste code from theme [settings.css](src/settings.css) to your `custom.css` and edit values
    * edit in external app! Logseq heavy cached
    * to additionally update - Refresh (not Re-index) your graph


## What is Logseq?
Logseq is a privacy-first, open-source knowledge base. Visit https://logseq.com for more information.

## Support
If you have any questions, issues or feature request, use the issue submission on GitHub: https://github.com/yoyurec/logseq-solarized-extended-theme/issues

## Credits

-   Icon - Keiran O'Leary https://dribbble.com/shots/6361500-Alacritty-Terminal-Icon
-   Other - in CSS comments

## License

[MIT License](./LICENSE)
