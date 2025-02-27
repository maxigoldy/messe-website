
////////////////////
//  LIB: Popup.JS //
////////////////////

// Get if PopupJS CSS is included
console.log('popup.js funktioniert.');


let CSSNOCHECKPUJS = false;

try {
    if (noPuJSCSSCheck) {
        CSSNOCHECKPUJS = noPuJSCSSCheck;
    }
} catch {
    CSSNOCHECKPUJS = false;
}

if (!CSSNOCHECKPUJS) {
    let pujsCSS = false;
    let pujsCSSLinks = document.getElementsByTagName('link');
    for (let i = 0; i < pujsCSSLinks.length; i++) {
        if (pujsCSSLinks[i].href.includes('popup.css') ||
            pujsCSSLinks[i].href.includes('popup.min.css') ||
            pujsCSSLinks[i].href.includes('pu.css') ||
            pujsCSSLinks[i].href.includes('pu.min.css')) {
            pujsCSS = true;
            break;
        }
    }

    if (!pujsCSS) {
        console.warn('PopupJS: CSS file is not included. Please include the CSS file in the head tag. For more information, visit https://aphbrt.web.app/articles/user-manuals/popupjs/?article=solutions Warning ID: CSS_NOT_INCLUDED');
    }
}

let pujsLoadedIcons = {};

let pujs = {
    getCssRule: function (selectorText) {
        let i;
        try {
            for (i = 0; i < document.styleSheets.length; i += 1) {
                let sheet = document.styleSheets[i];
                let j;
                for (j = 0; j < sheet.cssRules.length; j += 1) {
                    let rule = sheet.cssRules[j];
                    if (rule.selectorText === selectorText) {
                        return rule;
                    }
                }
            }
        } catch { }
        return null;
    },
    setup: {
        body_scrollable: true,
        original: {
            position: '',
            minHeight: '',
            top: '',
            overflow: '',
            width: '',
            overflowX: '',
            overflowY: '',
            scroll: 0,
            scrollLeft: 0,
            background: '#FFFFFF'
        },
        icons_path: 'lib/popup/icons/',
        init: function () {
            if (document.getElementsByClassName('alert').length === 0) {
                let Alert = document.createElement('div');
                Alert.classList.add('pujs-alert');
                let AlertIcon = document.createElement('div');
                AlertIcon.classList.add('alert-icon');
                Alert.appendChild(AlertIcon);
                let AlertText = document.createElement('div');
                AlertText.classList.add('alert-text');
                Alert.appendChild(AlertText);
                document.body.appendChild(Alert);
            }
            puJSPreloadIcons(['close', 'check']);

            if (!document.querySelector('.puJS-fullscreen-cover')) {
                let FullscreenCover = document.createElement('div');
                FullscreenCover.classList.add('puJS-fullscreen-cover');
                document.body.appendChild(FullscreenCover);
            }
        },
        todo: {
            alert: {
                start: function () { return false; },
                end: function () { return false; }
            },
            popup: {
                start: function () { return false; },
                end: function () { return false; }
            },
            pullOut: {
                start: function () { return false; },
                end: function () { return false; },
                ending: function () { return false; } // Ending event need if the close of the alert is animated
            },
            lastingBanner: {
                start: function () { return false; },
                end: function () { return false; }
            },
            actionSheet: {
                start: function () { return false; },
                end: function () { return false; }
            }
        }
    }
};

if (pujs.icons) {
    pujs.setup.icons_path = pujs.icons;
}

pujs.init = pujs.setup.init;

// Replace all <icon> to <svg>
let puJS_icon_holders = document.getElementsByTagName('icon');
async function puJSIcons() {
    if (puJS_icon_holders.length === 0) {
        return;
    }
    let icon = puJS_icon_holders[0].getAttribute('data-icon');
    let icon_element = puJS_icon_holders[0];
    let icon_parent = icon_element.parentElement;
    let svgUrl = `${pujs.setup.icons_path}/${icon}.svg`;
    if (!pujsLoadedIcons[icon]) {
        await fetch(svgUrl)
            .then((response) => response.text())
            .then((svg) => {
                let span = document.createElement('span');
                span.innerHTML = svg;
                let icon_class = icon_element.getAttribute('class');
                span.setAttribute('class', icon_class);
                span.setAttribute('style', '--mask-i: url(' + svgUrl + ')');
                try { icon_parent.replaceChild(span, icon_element); } catch { }
                puJSIcons();
                pujsLoadedIcons[icon] = svg;
            });
    } else {
        let span = document.createElement('span');
        span.innerHTML = pujsLoadedIcons[icon];
        let icon_class = icon_element.getAttribute('class');
        span.setAttribute('class', icon_class);
        span.setAttribute('style', '--mask-i: url(' + svgUrl + ')');
        try { icon_parent.replaceChild(span, icon_element); } catch { }
        puJSIcons();
    }
}

puJSIcons();

function puJSPreloadIcons(a = []) {
    a.forEach((icon) => {
        fetch(`${pujs.setup.icons_path}/${icon}.svg`)
            .then((response) => response.text())
            .then((svg) => {
                pujsLoadedIcons[icon] = svg;
            });
    });
}

pujs.pullOutAlerts = [];

pujs.lockscreen = function () {
    if (pujs.setup.body_scrollable) {

        let scrollbar_width = window.innerWidth - document.documentElement.clientWidth;

        pujs.setup.original.scroll = window.scrollY || 0;
        pujs.setup.original.scrollLeft = window.scrollX || 0;
        try { pujs.setup.original.minHeight = pujs.getCssRule('body').style.minHeight || 'auto'; } catch { }
        try { pujs.setup.original.width = pujs.getCssRule('body').style.width || 'auto'; } catch { }
        try { pujs.setup.original.overflow = pujs.getCssRule('body').style.overflow || 'auto'; } catch { }
        try { pujs.setup.original.overflowX = pujs.getCssRule('body').style.overflowX || 'auto'; } catch { }
        try { pujs.setup.original.overflowY = pujs.getCssRule('body').style.overflowY || 'auto'; } catch { }
        try { pujs.setup.original.position = pujs.getCssRule('body').style.position || 'static'; } catch { }
        try { pujs.setup.original.top = pujs.getCssRule('body').style.top || 0; } catch { }
        try { pujs.setup.original.right = pujs.getCssRule('body').style.right || 0; } catch { }

        document.body.style.position = 'fixed';
        document.body.style.top = '-' + pujs.setup.original.scroll + 'px';
        document.body.style.minHeight = '100vh';
        document.body.style.width = `calc(100vw - ${scrollbar_width + 'px'})`;
        document.body.style.right = scrollbar_width + 'px';
        document.body.style.overflow = 'hidden';

        // add .pujs-screen-locked to body
        document.body.classList.add('pujs-screen-locked');
    }
};

pujs.lockscreen.unlock = function () {
    if (pujs.setup.body_scrollable) {
        document.body.style.position = pujs.setup.original.position;
        document.body.style.top = pujs.setup.original.top;
        document.body.style.minHeight = pujs.setup.original.minHeight;
        document.body.style.width = pujs.setup.original.width;
        document.body.style.overflow = pujs.setup.original.overflow;
        document.body.style.overflowX = pujs.setup.original.overflowX;
        document.body.style.overflowY = pujs.setup.original.overflowY;
        window.scrollTo(pujs.setup.original.scrollLeft, pujs.setup.original.scroll);

        // remove .pujs-screen-locked from body
        document.body.classList.remove('pujs-screen-locked');
    }
}

pujs.pullOutTouch = {
    start_x: 0,
    start_y: 0,
    time: 0,
    done: () => {
        pujs.setup.todo.pullOut.end();
        if (pujs.pullOutAlerts.length === 0) {
            pujs.lockscreen.unlock();
        }
    }
};

document.body.addEventListener('click', function (e) {
    const t = e.target;

    let containspoAlert = false;

    let T = t;
    try {
        while (T.nodeName !== 'BODY') {
            if (T.classList.contains('pujs-poAlert') || T.classList.contains('puJS-donotclose')) {
                containspoAlert = true;
                break;
            }
            T = T.parentNode;
        }
    } catch { }

    if (!containspoAlert && pujs.pullOutAlerts.length) {
        pujs.pullOutAlerts[pujs.pullOutAlerts.length - 1].style.animation = 'pujsPoAlertSlideOut .5s forwards';

        let toBeRomoved = pujs.pullOutAlerts[pujs.pullOutAlerts.length - 1];

        pujs.pullOutAlerts.pop();
        // remove from array
        try {
            let id = pujs.pullOutAlerts[pujs.pullOutAlerts.length - 1].id;
            if (id) {
                // remove id from pujs.pullOutAlerts
                let index = pujs.pullOutAlerts.indexOf(id);
                if (index > -1) {
                    pujs.pullOutAlerts.splice(index, 1);
                }
            }
        } catch { }

        try {
            // ending event
            pujs.setup.todo.pullOut.ending();
        } catch { }

        try {
            setTimeout(() => {
                toBeRomoved.remove();
                pujs.pullOutTouch.done();
            }, 500);
        } catch { }
    }
});

document.body.addEventListener('touchstart', function (e) {
    if (e.target.className === 'pujs-poAlert') {
        pujs.pullOutTouch.start_x = e.touches[0].clientX;
        pujs.pullOutTouch.start_y = e.touches[0].clientY;
        pujs.pullOutTouch.time = Date.now();
    }
});

document.body.addEventListener('touchmove', function (e) {
    if (e.target.className === 'pujs-poAlert') {
        let y = e.touches[0].clientY;
        let dy = y - pujs.pullOutTouch.start_y;
        let percentage = dy / window.innerHeight * 100;
        e.target.style.bottom = `-${percentage}%`;
        e.target.style.transition = 'none';

        // if percentage is negative, /10 and increase to the height
        if (!e.target.dataset.height) {
            e.target.dataset.height = e.target.style.height;
        }
        if (percentage < 0) {
            e.target.style.height = `calc(${e.target.dataset.height} + ${-percentage}px)`;
        }
    }
});

document.body.addEventListener('touchend', function (e) {
    if (e.target.className === 'pujs-poAlert') {
        // if the alert is moved more than 50% of the screen, remove the alert
        if (pujs.pullOutAlerts.includes(e.target.id)) {
            // remove from array
            let index = pujs.toggledPullOut.indexOf(e.target.id);
            if (index > -1) {
                pujs.toggledPullOut.splice(index, 1);
            }
        }
        let y = e.changedTouches[0].clientY;
        let dy = y - pujs.pullOutTouch.start_y;
        let percentage = dy / window.innerHeight * 100;

        // release back the height
        e.target.style.height = e.target.dataset.height;
        // remove the dataset
        e.target.removeAttribute('data-height');

        let timeDifference = Date.now() - pujs.pullOutTouch.time;

        let ppt = (percentage / timeDifference > 0.26);
        if (percentage > 30 || ppt) {

            e.target.style.transition = '0.5s var(--pu-smooth-ease)';
            e.target.style.pointerEvents = 'none';
            e.target.style.bottom = '-100%';

            // ending event
            pujs.setup.todo.pullOut.ending();

            // background cover remove if no other data-fullscreen-cover
            // document.querySelector('

            setTimeout(() => {
                e.target.remove();
                pujs.pullOutAlerts.pop();
                pujs.pullOutTouch.done();
            }, 500);
        } else {
            e.target.style.transition = '1s var(--pu-smooth-ease)';
            e.target.style.bottom = '0';
        }
    }
});

pujs.pullOut = (html = '', scroll = false, options = {}) => {
    pujs.setup.todo.pullOut.start();

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let a = document.createElement('div');
            a.innerHTML = html;
            a.className = 'pujs-poAlert';
            if (scroll) {
                a.style.display = 'block';
                a.style.overflowY = 'scroll';
            }

            if (options.id) { a.id = options.id; }

            if (!a.id) {
                a.id = Math.random().toString(36).substring(7);
            }

            if (options.lockscreen == null || options.lockscreen == undefined || options.lockscreen) {
                pujs.lockscreen();
            }

            if (options.dragHandle) {
                let dragHandle = document.createElement('div');
                dragHandle.classList.add('pujs-poAlert-dragHandle');

                let startDrag = (e) => {
                    e.target.parentElement.classList.add('dragging');
                };

                let endDrag = (e) => {
                    if (e.target.parentElement.classList.contains('dragging'))
                        e.target.parentElement.classList.remove('dragging');
                };

                dragHandle.addEventListener('mousedown', startDrag);
                document.addEventListener('mouseup', endDrag);

                dragHandle.addEventListener('touchstart', startDrag);
                document.addEventListener('touchend', endDrag);

                a.appendChild(dragHandle);
            }

            if (options.closeButton) {
                let closeButton = document.createElement('button');
                closeButton.classList.add('pujs-poAlert-closeButton');
                closeButton.innerHTML = '<icon data-icon="close"></icon>';
                closeButton.addEventListener('click', () => {
                    let event = new Event('click');
                    document.body.dispatchEvent(event);
                });
                a.appendChild(closeButton);
            }

            if (options.height) {
                a.style.height = options.height;
            }

            document.body.appendChild(a);

            resolve(a);

            puJSIcons();

            pujs.pullOutAlerts.push(a);
        }, 1);
    });
};

pujs.pullOut.close = (id = null) => {
    if (id) {
        let alert = document.getElementById(id);
        if (alert) {
            alert.style.animation = 'pujsPoAlertSlideOut .5s forwards';

            // ending event
            pujs.setup.todo.pullOut.ending();

            setTimeout(() => {
                alert.remove();
                let index = pujs.pullOutAlerts.indexOf(id);
                if (index > -1) {
                    pujs.pullOutAlerts.splice(index, 1);
                }
                pujs.pullOutTouch.done();
            }, 500);
        }
    } else {
        if (pujs.pullOutAlerts.length) {
            pujs.pullOutAlerts[pujs.pullOutAlerts.length - 1].style.animation = 'pujsPoAlertSlideOut .5s forwards';

            // ending event
            pujs.setup.todo.pullOut.ending();

            setTimeout(() => {
                pujs.pullOutAlerts[pujs.pullOutAlerts.length - 1].remove();
                pujs.pullOutAlerts.pop();
                pujs.pullOutTouch.done();
            }, 500);
        }
    }
};

let puJSAlertTO;

pujs.alert = (m = '', t = 'error', T = 3000, S = false, options = {}) => {
    pujs.setup.todo.alert.start();
    if (document.getElementsByClassName('alert').length === 0) {
        let Alert = document.createElement('div');
        Alert.classList.add('pujs-alert');
        let AlertIcon = document.createElement('div');
        AlertIcon.classList.add('alert-icon');
        Alert.appendChild(AlertIcon);
        let AlertText = document.createElement('div');
        AlertText.classList.add('alert-text');
        Alert.appendChild(AlertText);
        document.body.appendChild(Alert);
    }

    if (puJSAlertTO) { clearTimeout(puJSAlertTO); }

    if (S) {
        document.querySelector('.alert-text').style.userSelect = 'text';
        document.querySelector('.alert-text').style.pointerEvents = 'auto';
    } else {
        document.querySelector('.alert-text').style.userSelect = 'none';
        document.querySelector('.alert-text').style.pointerEvents = 'none';
    }
    let type_list = {
        error: {
            i: 'close',
            c: 'color-red'
        },
        success: {
            i: 'check',
            c: 'bg-green'
        }
    };

    let icon;

    if (type_list[t]) { icon = type_list[t].i || 'close'; }
    else { icon = t; }


    document.querySelector('.alert-icon').innerHTML = `<icon data-icon='${icon}' class='alert-icon stroke ${(type_list[t] ? type_list[t].c : '')}'></icon>`;
    document.querySelector('.alert-text').innerHTML = m;

    puJSIcons();

    document.querySelector('.pujs-alert').classList.add('show');

    puJSAlertTO = setTimeout(() => {
        document.querySelector('.pujs-alert').classList.remove('show');
        pujs.setup.todo.alert.end();
    }, T);
};

pujs.popup = (title = '', message = '', buttons = [{ 'text': 'OK', callback: () => { } }], button_type = 'vert', input, options = {
    lockscreen: true
}) => {
    pujs.setup.todo.popup.start();
    if (options.lockscreen) {
        pujs.lockscreen();
    }

    let popup = document.createElement('dialog');
    popup.classList.add('puJS-popup');

    let inp = '';

    if (input) {
        input.forEach((w) => {
            let inputElement = document.createElement('input');
            inputElement.classList.add('input');
            inputElement.classList.add('pujs-popup-inp');
            inputElement.placeholder = w.placeholder || '';
            inputElement.value = w.value || '';
            inputElement.type = w.type || 'text';
            inp += inputElement.outerHTML;
        });
    }

    popup.innerHTML = `<div class='puJS-popup-container'><div class='padding'><div class='title'>${title}</div><div class='message'>${message}</div>${inp}</div><div class='buttons'></div></div>`;

    if (button_type === 'vertical' || button_type === 'v') button_type = 'vert';
    if (button_type === 'horizontal' || button_type === 'h') button_type = 'horiz';

    if (button_type === 'vert') {
        buttons.forEach((w) => {
            let button = document.createElement('button');
            button.classList.add('puJS-popup-button');
            button.innerHTML = w.text;
            if (w.color) { button.style.color = w.color; }

            button.addEventListener('click', (e) => {
                let inputs = document.querySelectorAll('.pujs-popup-inp');
                let values = [];
                inputs.forEach((input) => {
                    values.push(input.value);
                });
                if (w.callback) { w.callback(values); }
                pujs.setup.todo.popup.end();

                // add .closed to popup
                e.target.parentElement.parentElement.parentElement.classList.add('closed');

                e.target.parentElement.parentElement.parentElement.classList.add('puJS-popup-ended');
                setTimeout(() => {
                    pujs.lockscreen.unlock();
                    e.target.parentElement.parentElement.parentElement.remove();
                }, 200);

            });
            popup.querySelector('.buttons').appendChild(button);
        });
    } else if (button_type === 'horiz') {
        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        let i;
        for (i = 0; i < 2; i++) {
            let button = document.createElement('button');
            button.classList.add('puJS-popup-button');
            button.innerHTML = buttons[i].text;
            if (buttons[i].color) {
                button.style.color = buttons[i].color;
            }

            button.dataset.index = i;

            button.addEventListener('click', (e) => {
                let inputs = document.querySelectorAll('.pujs-popup-inp');
                let values = [];
                inputs.forEach((input) => {
                    values.push(input.value);
                });
                if (buttons[e.target.dataset.index].callback) { buttons[e.target.dataset.index].callback(values); }
                pujs.setup.todo.popup.end();
                e.target.parentElement.parentElement.parentElement.parentElement.classList.add('puJS-popup-ended');
                // add .closed to popup
                e.target.parentElement.parentElement.parentElement.parentElement.classList.add('closed');
                setTimeout(() => {
                    pujs.lockscreen.unlock();
                    e.target.parentElement.parentElement.parentElement.parentElement.remove();
                }, 200);
            });
            buttonContainer.appendChild(button);
        }
        popup.querySelector('.buttons').appendChild(buttonContainer);
    }

    try {
        popup.querySelector('button').classList.add('emphasized');
    } catch { }

    document.body.appendChild(popup);

    // show dialog
    popup.showModal();
};

pujs.lastingBanner = (html = '', type = 'warning', pos = 'bottom', buttons = [{ 'text': 'Close', callback: () => { }, style: "color: white; background: black; padding: 5px 10px; border-radius: 50px;" }], id, options = {}) => {
    return new Promise((resolve, reject) => {
        pujs.setup.todo.lastingBanner.start();

        let banner = document.createElement('div');
        banner.classList.add('puJS-lasting-banner');

        if (!id) {
            id = Math.random().toString(36).substring(7);
        }
        banner.id = id;

        let type_list = {
            notice: {
                c: 'var(--pu-blue)',
                f: 'black'
            },
            error: {
                c: 'var(--pu-red)',
                f: 'black'
            },
            success: {
                c: 'var(--pu-green)'
            },
            warning: {
                c: 'var(--pu-yellow)',
                f: 'black'
            },
            alphabrate: {
                c: 'transparent',
                f: 'var(--pujs-popup-text-color)',
                button_style: 'margin: .2rem; color: var(--pujs-popup-background); background: var(--pujs-popup-text-color); padding: 5px 10px; border-radius: 50px;',
                block_style: 'backdrop-filter: blur(10px) saturate(180%); border: 1.5px solid var(--border)'
            },
        };

        // add block style 
        banner.style = type_list[type] ? type_list[type].block_style : '';

        banner.style.backgroundColor = type_list[type] ? type_list[type].c || type : type;
        if (type_list[type] ? type_list[type].f : false) banner.style.color = type_list[type] ? type_list[type].f || 'white' : 'white';

        let innerDiv = document.createElement('div');
        innerDiv.classList.add('inner');
        innerDiv.innerHTML = html;

        banner.appendChild(innerDiv);

        let buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons');

        buttons.forEach((w) => {
            let button = document.createElement('button');
            button.innerHTML = w.text;
            button.addEventListener('click', (e) => {
                if (w.callback) { w.callback(); }
                pujs.lastingBanner.close(banner.id);
            });
            let style = w.style;

            if (w.preset_style) {
                // add class
                button.classList.add(`pujs-button-${w.preset_style}`);
            }

            if (!style) {
                style = type_list[type] ? type_list[type].button_style || '' : '';
            }

            button.style = style;

            buttonsDiv.appendChild(button);
        });

        if (options.duration) {
            setTimeout(() => {
                pujs.lastingBanner.close(banner.id);
            }, options.duration);
        }

        banner.appendChild(buttonsDiv);

        document.body.appendChild(banner);

        resolve(banner);
    });
};

pujs.lastingBanner.close = (id) => {

    if (!id) {
        id = document.querySelector('.puJS-lasting-banner').id;
    }

    let banner = document.getElementById(id);
    if (banner) {
        // add animation, then remove
        banner.style.pointerEvents = 'none';
        banner.style.animation = 'pujsBannerSlideOut .5s forwards';
        setTimeout(() => {
            banner.remove();
        }, 500);
        pujs.setup.todo.lastingBanner.end();
    }
};

pujs.actionSheet = (title = '', message = '', buttons = [{ 'text': 'Action', callback: () => { } }], options = {}) => {
    // or bottom sheet
    pujs.setup.todo.actionSheet.start();
    if (options.lockscreen !== false) {
        pujs.lockscreen();
    }
    if (!document.querySelector('.puJS-fullscreen-cover')) {
        let FullscreenCover = document.createElement('div');
        FullscreenCover.classList.add('puJS-fullscreen-cover');
        document.body.appendChild(FullscreenCover);
    }

    if (!options.cancel) {
        options.cancel = 'Cancel';
    }

    let actionSheet = document.createElement('div');
    actionSheet.classList.add('puJS-action-sheet');

    let id = options.id || Math.random().toString(36).substring(7);
    actionSheet.id = id;

    let buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');

    buttons.forEach((w) => {
        let button = document.createElement('button');
        button.innerHTML = w.text;
        button.addEventListener('click', (e) => {
            if (w.callback) { w.callback(); }
            pujs.actionSheet.close(id);
        });

        // Types: action[default], disabled, destructive

        if (w.type) {
            button.classList.add(`pujs-button-${w.type}`);
        }

        if (w.type === 'disabled') {
            button.disabled = true;
        }

        buttonsDiv.appendChild(button);
    });

    let cancelButton = document.createElement('button');
    cancelButton.innerHTML = options.cancel;
    cancelButton.classList.add('cancel');
    cancelButton.addEventListener('click', () => {
        pujs.actionSheet.close(id);
    });

    let titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.innerHTML = title;

    let messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.innerHTML = message;

    let firstPart = document.createElement('div');
    firstPart.classList.add('first-part');
    firstPart.appendChild(titleDiv);
    firstPart.appendChild(messageDiv);
    firstPart.appendChild(buttonsDiv);

    actionSheet.appendChild(firstPart);
    actionSheet.appendChild(cancelButton);

    document.body.appendChild(actionSheet);

    document.querySelector('.puJS-fullscreen-cover').style.opacity = 1;
    document.querySelector('.puJS-fullscreen-cover').style.pointerEvents = 'all';

    return id;
};

pujs.actionSheet.close = (id) => {
    if (!id) {
        id = document.querySelector('.puJS-action-sheet').id;
    }

    let actionSheet = document.getElementById(id);
    if (actionSheet) {
        document.querySelector('.puJS-fullscreen-cover').style.opacity = 0;
        document.querySelector('.puJS-fullscreen-cover').style.pointerEvents = 'none';
        pujs.lockscreen.unlock();
        actionSheet.style.pointerEvents = 'none';
        actionSheet.style.animation = 'pujsActionSheetSlideOutOuter .7s forwards var(--pu-smooth-ease)';
        setTimeout(() => {
            actionSheet.remove();
        }, 700);
        pujs.setup.todo.actionSheet.end();
    }
};

////////////////////
//  LIB: Popup.JS //
////////////////////