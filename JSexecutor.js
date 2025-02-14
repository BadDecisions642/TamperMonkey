// ==UserScript==
// @name         Executor/Injector
// @namespace    http://tampermonkey.net/
// @version      2.2x
// @description  JavaScript Executor
// @author       BadDecisions642
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    const createElement = (tag, options = {}) => {
        const el = document.createElement(tag);
        Object.entries(options).forEach(([key, value]) => el[key] = value);
        return el;
    };

    // Styles
    const style = createElement('style', {
        textContent: `
            #kqacUI {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 850px;
                height: 450px;
                background: linear-gradient(135deg, #007BFF, #FFFFFF);
                color: black;
                border-radius: 10px;
                box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
                display: none;
                flex-direction: column;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                padding: 15px;
                font-family: Arial, sans-serif;
            }
            .tab-container {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 10px;
                overflow-x: auto;
            }
            .tab {
                background: rgba(0, 0, 0, 0.2);
                color: black;
                padding: 8px 15px;
                cursor: pointer;
                border-radius: 5px;
                transition: background 0.2s;
            }
            .tab.active {
                background: rgba(0, 0, 0, 0.4);
            }
            .add-tab {
                background: rgba(0, 0, 0, 0.2);
                color: black;
                width: 25px;
                height: 25px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                cursor: pointer;
                border-radius: 50%;
                transition: background 0.2s;
            }
            .editor {
                flex: 1;
                background: rgba(255, 255, 255, 0.7);
                color: black;
                padding: 10px;
                font-family: monospace;
                font-size: 14px;
                border: 1px solid #333;
                resize: none;
                overflow-y: auto;
                width: 100%;
                height: 250px;
            }
            .button-container {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
            }
            .button {
                background: rgba(0, 0, 0, 0.3);
                color: white;
                padding: 10px;
                cursor: pointer;
                border-radius: 5px;
                transition: all 0.2s;
            }
            .button:hover {
                background: rgba(0, 0, 0, 0.5);
            }
            #toggleUI {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 50px;
                height: 50px;
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                font-size: 20px;
            }
            #toggleUI:hover {
                transform: scale(1.1);
            }
        `
    });
    document.head.appendChild(style);

    // UI Elements
    const ui = createElement('div', { id: 'kqacUI' });
    const tabContainer = createElement('div', { className: 'tab-container' });
    const codeEditor = createElement('textarea', { className: 'editor', placeholder: '// Write your JavaScript here...' });
    const buttonContainer = createElement('div', { className: 'button-container' });
    const runButton = createElement('div', { className: 'button', textContent: 'Run' });
    const clearButton = createElement('div', { className: 'button', textContent: 'Clear' });
    const toggleButton = createElement('div', { id: 'toggleUI', textContent: '+' });

    buttonContainer.append(runButton, clearButton);
    ui.append(tabContainer, codeEditor, buttonContainer);
    document.body.append(ui, toggleButton);

    // Tabs
    let tabs = [{ title: 'Tab 1', content: '' }];
    let activeTab = 0;

    const updateTabs = () => {
        tabContainer.innerHTML = '';
        tabs.forEach((tab, i) => {
            const tabElement = createElement('div', {
                className: `tab ${i === activeTab ? 'active' : ''}`,
                textContent: tab.title,
                onclick: () => switchTab(i)
            });
            tabContainer.appendChild(tabElement);
        });
        const addTabElement = createElement('div', {
            className: 'add-tab',
            textContent: '+',
            onclick: addTab
        });
        tabContainer.appendChild(addTabElement);
    };

    const switchTab = (index) => {
        tabs[activeTab].content = codeEditor.value;
        activeTab = index;
        codeEditor.value = tabs[index].content;
        updateTabs();
    };

    const addTab = () => {
        if (tabs.length >= 5) return;
        tabs.push({ title: `Tab ${tabs.length + 1}`, content: '' });
        switchTab(tabs.length - 1);
    };

    updateTabs();

    // UI Toggle
    toggleButton.addEventListener('click', () => {
        ui.style.display = ui.style.display === 'flex' ? 'none' : 'flex';
        setTimeout(() => ui.style.opacity = ui.style.display === 'flex' ? 1 : 0, 10);
    });

    // Run & Clear
    runButton.addEventListener('click', () => {
        try {
            eval(codeEditor.value);
        } catch (e) {
            alert('Error: ' + e.message);
        }
    });

    clearButton.addEventListener('click', () => {
        codeEditor.value = '';
    });

})();