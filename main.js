// ==UserScript==
// @name         Azar Visual Ultimate
// @namespace    https://github.com/VeltrixJS
// @version      6.0
// @description  Suite complète d'effets visuels avec interface moderne
// @author       VeltrixJS
// @match        https://azarlive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=azarlive.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // === CONFIGURATION AVEC SAUVEGARDE ===
    const DEFAULT_CONFIG = {
        // Effets visuels
        particles: false,
        particlesColor: '#51f59b',
        particlesCount: 50,
        particlesIntensity: 50,
        snow: false,
        snowIntensity: 50,
        rain: false,
        rainIntensity: 50,
        matrix: false,
        matrixIntensity: 50,
        stars: false,
        starsIntensity: 50,
        bubbles: false,
        bubblesIntensity: 50,
        glitch: false,
        glitchIntensity: 50,

        // Rainbow & animations
        rainbow: false,
        backgroundRainbow: false,
        disco: false,
        gradientAnimation: false,

        // Background
        backgroundEffect: 'none',
        backgroundCustomColor: '#667eea',
        backgroundBlur: 0,

        // Interface
        uiColor: '#51f59b',
        uiTheme: 'dark',
        uiOpacity: 95,
        uiFontSize: 13,
        uiCompact: false,

        // Skip Button
        skipButtonColor: '#51f59b',
        skipButtonSize: 100,
        skipButtonShape: 'circle',

        // Autres
        syncColors: false,
        showFPS: false,
        keyboardShortcuts: true,
        skipKey: 'Space'
    };

    function loadConfig() {
        const saved = localStorage.getItem('azarVisualConfig');
        if (saved) {
            try {
                return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
            } catch (e) {
                return { ...DEFAULT_CONFIG };
            }
        }
        return { ...DEFAULT_CONFIG };
    }

    function saveConfig() {
        localStorage.setItem('azarVisualConfig', JSON.stringify(config));
    }

    const config = loadConfig();

    // === CRÉATION DE L'INTERFACE MODERNE ===
    function createInterface() {
        const ui = document.createElement('div');
        ui.id = 'azarUI';
        ui.innerHTML = `
            <style>
                /* === INTERFACE PRINCIPALE === */
                #azarUI {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 420px;
                    background: #121212;
                    border: 1px solid #51f59b;
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(81,245,155,0.2);
                    z-index: 999998;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    color: #51f59b;
                    overflow: hidden;

                }

                #azarUI.compact {
                    width: 320px;
                }

                #azarUI.minimized {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 15px rgba(81,245,155,0.4);
                }

                #azarUI.minimized .ui-tabs,
                #azarUI.minimized .ui-content {
                    display: none !important;
                }

                #azarUI.minimized .ui-header {
                    padding: 0;
                    border: none;
                    background: transparent;
                    width: 100%;
                    height: 100%;
                }

                #azarUI.minimized .ui-header h2,
                #azarUI.minimized .header-actions {
                    display: none !important;
                }

                #azarUI.minimized .minimize-btn {
                    display: none !important;
                }

                #azarUI.minimized #drag-handle-mini {
                    display: flex !important;
                }

                #drag-handle-mini {
                    display: none;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                #drag-handle-mini svg {
                    width: 28px;
                    height: 28px;
                }

                /* === HEADER === */
                .ui-header {
                    background: rgba(81,245,155,0.05);
                    padding: 16px 20px;
                    border-bottom: 1px solid rgba(81,245,155,0.2);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                }

                .ui-header h2 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 900;
                    color: #51f59b;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .ui-icon {
                    font-size: 20px;
                }

                .header-actions {
                    display: flex;
                    gap: 8px;
                }

                .minimize-btn, .theme-btn {
                    background: transparent;
                    border: 1px solid #51f59b;
                    color: #51f59b;
                    width: 36px;
                    height: 36px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .minimize-btn:hover, .theme-btn:hover {
                    background: rgba(81,245,155,0.2);
                    border-color: rgba(81,245,155,0.5);
                    transform: scale(1.05);
                }

                /* === TABS === */
                .ui-tabs {
                    display: flex;
                    background: #1c1c1c;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    overflow-x: auto;
                }

                .ui-tabs::-webkit-scrollbar {
                    height: 3px;
                }

                .ui-tabs::-webkit-scrollbar-thumb {
                    background: #51f59b;
                    border-radius: 10px;
                }

                .tab {
                    flex: 1;
                    min-width: 80px;
                    padding: 12px 8px;
                    background: transparent;
                    border: none;
                    border-bottom: 3px solid transparent;
                    color: rgba(255,255,255,0.6);
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .tab:hover {
                    color: rgba(255,255,255,0.9);
                    background: rgba(255,255,255,0.05);
                }

                .tab.active {
                    color: #51f59b;
                    border-bottom-color: #51f59b;
                    background: rgba(81,245,155,0.1);
                }

                /* === CONTENT === */
                .ui-content {
                    padding: 16px;
                    max-height: 500px;
                    overflow-y: auto;
                }

                .ui-content::-webkit-scrollbar {
                    width: 6px;
                }

                .ui-content::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.05);
                    border-radius: 10px;
                }

                .ui-content::-webkit-scrollbar-thumb {
                    background: #51f59b;
                    border-radius: 10px;
                }

                .tab-content {
                    display: none;
                }

                .tab-content.active {
                    display: block;
                    animation: fadeIn 0.2s;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* === SECTIONS === */
                .section {
                    #1c1c1c;
                    border-left: 4px solid #51f59b;
                    border-radius: 6px;
                    padding: 14px;
                    margin-bottom: 12px;
                }

                .section-title {
                    font-size: 12px;
                    font-weight: 800;
                    color: #51f59b;
                    text-transform: uppercase;
                    letter-spacing: 1.2px;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(81,245,155,0.2);
                }

                /* === OPTIONS === */
                .option {
                    background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 6px;
                    padding: 10px 12px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                }

                .option:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(81,245,155,0.3);
                    transform: translateX(3px);
                }

                .option-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .option-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #e0e0e0;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .option-icon {
                    font-size: 14px;
                }

                /* === TOGGLE SWITCH === */
                .switch {
                    position: relative;
                    width: 44px;
                    height: 24px;
                }

                .switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .switch-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.3);
                    transition: .3s;
                    border-radius: 24px;
                }

                .switch-slider:before {
                    position: absolute;
                    content: "";
                    height: 16px;
                    width: 16px;
                    left: 3px;
                    bottom: 3px;
                    background: white;
                    transition: .3s;
                    border-radius: 50%;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }

                input:checked + .switch-slider {
                    background: #51f59b;
                    border-color: #51f59b;
                    box-shadow: 0 0 10px rgba(81,245,155,0.5);
                }

                input:checked + .switch-slider:before {
                    transform: translateX(20px);
                }

                /* === SELECT & INPUT === */
                .select, .color-input, .text-input {
                    width: 100%;
                    padding: 8px 10px;
                    background: #1c1c1c;
                    border: 1px solid #51f59b;
                    border-radius: 6px;
                    color: #51f59b;
                    font-size: 12px;
                    margin-top: 6px;
                    cursor: pointer;
                }

                .select option {
                    background: #121212;
                    color: #51f59b;
                }

                .select:focus, .color-input:focus, .text-input:focus {
                    outline: none;
                    border-color: #51f59b;
                    box-shadow: 0 0 10px rgba(81,245,155,0.3);
                }

                .color-input {
                    height: 36px;
                }

                /* === SLIDERS === */
                .slider-container {
                    margin-top: 8px;
                }

                .slider-label {
                    font-size: 11px;
                    color: #999;
                    margin-bottom: 6px;
                    display: flex;
                    justify-content: space-between;
                }

                .slider-value {
                    color: #51f59b;
                    font-weight: 700;
                }

                .slider {
                    width: 100%;
                    height: 5px;
                    border-radius: 5px;
                    background: transparent;
                    outline: none;
                    -webkit-appearance: none;
                }

                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #51f59b;
                    cursor: pointer;
                    box-shadow: 0 0 8px rgba(81,245,155,0.7);
                    transition: all 0.2s;
                }

                .slider::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                }

                /* === GRID LAYOUT === */
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }

                .grid-3 {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 8px;
                }

                /* === THEME PRESETS === */
                .theme-preset {
                    padding: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 2px solid transparent;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                }

                .theme-preset:hover {
                    background: transparent;
                    transform: scale(1.05);
                }

                .theme-preset.active {
                    border-color: #51f59b;
                    box-shadow: 0 0 15px rgba(81,245,155,0.3);
                }

                .theme-preset-name {
                    font-size: 11px;
                    font-weight: 700;
                    margin-top: 6px;
                    color: #51f59b;
                }

                .theme-preview {
                    width: 100%;
                    height: 40px;
                    border-radius: 6px;
                    margin-bottom: 4px;
                }

                /* === SKIP BUTTON === */
                #skipButton {
                    position: fixed;
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, #51f59b 0%, #3dd382 100%);
                    border: 4px solid #fff;
                    box-shadow: 0 10px 40px rgba(81,245,155,0.6);
                    z-index: 999999;
                    cursor: grab;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Arial Black', Arial, sans-serif;
                    font-size: 20px;
                    font-weight: 900;
                    color: #121212;
                    transition: transform 0.1s;
                    user-select: none;
                    animation: pulse-skip 2s infinite;
                }

                #skipButton.circle {
                    border-radius: 50%;
                }

                #skipButton.square {
                    border-radius: 15px;
                }

                @keyframes pulse-skip {
                    0%, 100% { box-shadow: 0 10px 40px rgba(81,245,155,0.6); }
                    50% { box-shadow: 0 15px 60px rgba(81,245,155,0.9); }
                }

                #skipButton:hover {
                    transform: scale(1.1);
                }

                #skipButton:active {
                    cursor: grabbing;
                    transform: scale(0.95);
                }

                /* === EFFECTS === */
                #particles-js, #snow-canvas, #rain-canvas, #matrix-canvas,
                #stars-canvas, #bubbles-canvas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1;
                    opacity: 0.7;
                }

                #backgroundOverlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 0;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.5s, filter 0.3s;
                }

                #backgroundOverlay.active {
                    opacity: 1;
                }

                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }

                body.rainbow-effect {
                    animation: rainbow 3s linear infinite !important;
                }

                @keyframes rainbow-bg {
                    0% { filter: hue-rotate(0deg) brightness(0.8); }
                    100% { filter: hue-rotate(360deg) brightness(0.8); }
                }

                #backgroundOverlay.rainbow-bg {
                    animation: rainbow-bg 5s linear infinite !important;
                }

                @keyframes disco {
                    0% { background: #ff0080; }
                    25% { background: #00ff80; }
                    50% { background: #0080ff; }
                    75% { background: #ff8000; }
                    100% { background: #ff0080; }
                }

                #backgroundOverlay.disco {
                    animation: disco 2s linear infinite !important;
                    opacity: 0.3 !important;
                }

                @keyframes gradient-slide {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                #backgroundOverlay.gradient-animated {
                    background-size: 200% 200% !important;
                    animation: gradient-slide 10s ease infinite !important;
                }

                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                    100% { transform: translate(0); }
                }

                body.glitch-effect {
                    animation: glitch 0.3s infinite;
                }

                /* === FPS COUNTER === */
                #fpsCounter {
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    background: #121212;
                    color: #51f59b;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 14px;
                    font-weight: bold;
                    z-index: 999997;
                    border: 1px solid #51f59b;
                }

                /* === BUTTONS === */
                .btn {
                    width: 100%;
                    padding: 10px;
                    border: none;
                    border-radius: 6px;
                    font-weight: 700;
                    font-size: 12px;
                    cursor: pointer;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.2s;
                    margin-top: 8px;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #51f59b 0%, #3dd382 100%);
                    color: #121212;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(81,245,155,0.5);
                }

                .btn-danger {
                    background: linear-gradient(135deg, #ff4757 0%, #ff6348 100%);
                    color: white;
                }

                .btn-danger:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(255,71,87,0.5);
                }

                .btn-secondary {
                    background: transparent;
                    color: white;
                    border: 1px solid #51f59b;
                }

                .btn-secondary:hover {
                    background: rgba(255,255,255,0.15);
                }

                /* === INFO BOX === */
                .info-box {
                    background: rgba(81,245,155,0.1);
                    border: 1px solid rgba(81,245,155,0.3);
                    border-radius: 6px;
                    padding: 10px;
                    font-size: 11px;
                    color: #51f59b;
                    margin-top: 10px;
                    text-align: center;
                }

                /* === COMPACT MODE === */
                #azarUI.compact .section {
                    padding: 10px;
                }

                #azarUI.compact .option {
                    padding: 8px 10px;
                }

                #azarUI.compact .option-label {
                    font-size: 11px;
                }

                /* === LIGHT THEME === */
                #azarUI.light {
                    background: #f5f5f5;
                    color: #333;
                }

                #azarUI.light .ui-header {
                    background: linear-gradient(135deg, rgba(81,245,155,0.2) 0%, rgba(81,245,155,0.1) 100%);
                }

                #azarUI.light .section {
                    background: rgba(0,0,0,0.03);
                    border-color: rgba(0,0,0,0.08);
                }

                #azarUI.light .option {
                    background: white;
                    border-color: rgba(0,0,0,0.1);
                }

                #azarUI.light .option-label {
                    color: #333;
                }

                #azarUI.light .select,
                #azarUI.light .color-input,
                #azarUI.light .text-input {
                    background: white;
                    border-color: rgba(0,0,0,0.2);
                    color: #333;
                }
            </style>

            <!-- HEADER -->
            <div class="ui-header" id="uiHeader">
                <div id="drag-handle-mini">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#51f59b" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5"/>
                        <path d="M2 12l10 5 10-5"/>
                    </svg>
                </div>
                <h2><span class="ui-icon">✨</span> VISUAL FX</h2>
                <div class="header-actions">
                    <button class="theme-btn" id="themeBtn" title="Changer thème">🌓</button>
                    <button class="minimize-btn" id="minimizeBtn">−</button>
                </div>
            </div>

            <!-- TABS -->
            <div class="ui-tabs">
                <button class="tab active" data-tab="effects">Effets</button>
                <button class="tab" data-tab="background">Fond</button>
                <button class="tab" data-tab="colors">Couleurs</button>
                <button class="tab" data-tab="skip">Skip</button>
                <button class="tab" data-tab="settings">Réglages</button>
            </div>

            <!-- CONTENT -->
            <div class="ui-content">
                <!-- TAB: EFFETS -->
                <div class="tab-content active" data-tab="effects">
                    <div class="section">
                        <div class="section-title">Particules</div>
                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🌟</span> Particules classiques</span>
                                <label class="switch">
                                    <input type="checkbox" id="particlesToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <input type="color" class="color-input" id="particlesColor" value="#51f59b">
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="particlesIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="particlesIntensity" min="10" max="100" value="50">
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">❄️</span> Neige</span>
                                <label class="switch">
                                    <input type="checkbox" id="snowToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="snowIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="snowIntensity" min="10" max="100" value="50">
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🌧️</span> Pluie</span>
                                <label class="switch">
                                    <input type="checkbox" id="rainToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="rainIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="rainIntensity" min="10" max="100" value="50">
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🟢</span> Matrix</span>
                                <label class="switch">
                                    <input type="checkbox" id="matrixToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="matrixIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="matrixIntensity" min="10" max="100" value="50">
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">⭐</span> Étoiles</span>
                                <label class="switch">
                                    <input type="checkbox" id="starsToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="starsIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="starsIntensity" min="10" max="100" value="50">
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🫧</span> Bulles</span>
                                <label class="switch">
                                    <input type="checkbox" id="bubblesToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="bubblesIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="bubblesIntensity" min="10" max="100" value="50">
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Animations</div>
                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🌈</span> Rainbow Interface</span>
                                <label class="switch">
                                    <input type="checkbox" id="rainbowToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">⚡</span> Glitch</span>
                                <label class="switch">
                                    <input type="checkbox" id="glitchToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                            <div class="slider-container">
                                <div class="slider-label">
                                    <span>Intensité</span>
                                    <span class="slider-value" id="glitchIntensityValue">50</span>
                                </div>
                                <input type="range" class="slider" id="glitchIntensity" min="10" max="100" value="50">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: FOND -->
                <div class="tab-content" data-tab="background">
                    <div class="section">
                        <div class="section-title">Fond d'écran</div>
                        <select class="select" id="backgroundSelect">
                            <option value="none">Par défaut</option>
                            <option value="gradient-1">🟣 Violet</option>
                            <option value="gradient-2">🌸 Rose</option>
                            <option value="gradient-3">🔵 Bleu</option>
                            <option value="gradient-4">🟢 Vert</option>
                            <option value="gradient-5">🌈 Sunset</option>
                            <option value="custom">🎨 Personnalisé</option>
                        </select>

                        <div id="customColorOption" style="display: none; margin-top: 8px;">
                            <div class="option-label" style="margin-bottom: 6px;">Couleur personnalisée</div>
                            <input type="color" class="color-input" id="backgroundColorPicker" value="#667eea">
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Effets de fond</div>
                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🌈</span> Rainbow</span>
                                <label class="switch">
                                    <input type="checkbox" id="backgroundRainbowToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🪩</span> Discothèque</span>
                                <label class="switch">
                                    <input type="checkbox" id="discoToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🎨</span> Gradient animé</span>
                                <label class="switch">
                                    <input type="checkbox" id="gradientAnimToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="option">
                            <div class="slider-label">
                                <span>Flou</span>
                                <span class="slider-value" id="blurValue">0px</span>
                            </div>
                            <input type="range" class="slider" id="blurSlider" min="0" max="20" value="0">
                        </div>
                    </div>
                </div>

                <!-- TAB: COULEURS -->
                <div class="tab-content" data-tab="colors">
                    <div class="section">
                        <div class="section-title">Thèmes prédéfinis</div>
                        <div class="grid-3" id="themesGrid">
                            <div class="theme-preset" data-theme="neon">
                                <div class="theme-preview" style="background: linear-gradient(135deg, #51f59b 0%, #00d4ff 100%);"></div>
                                <div class="theme-preset-name">Neon</div>
                            </div>
                            <div class="theme-preset" data-theme="sunset">
                                <div class="theme-preview" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);"></div>
                                <div class="theme-preset-name">Sunset</div>
                            </div>
                            <div class="theme-preset" data-theme="ocean">
                                <div class="theme-preview" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);"></div>
                                <div class="theme-preset-name">Ocean</div>
                            </div>
                            <div class="theme-preset" data-theme="fire">
                                <div class="theme-preview" style="background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);"></div>
                                <div class="theme-preset-name">Fire</div>
                            </div>
                            <div class="theme-preset" data-theme="purple">
                                <div class="theme-preview" style="background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);"></div>
                                <div class="theme-preset-name">Purple</div>
                            </div>
                            <div class="theme-preset" data-theme="mint">
                                <div class="theme-preview" style="background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);"></div>
                                <div class="theme-preset-name">Mint</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Couleurs personnalisées</div>
                        <div class="option">
                            <div class="option-label">Couleur interface</div>
                            <input type="color" class="color-input" id="uiColorPicker" value="#51f59b">
                        </div>

                        <div class="option">
                            <div class="option-label">Couleur Skip</div>
                            <input type="color" class="color-input" id="skipColorPicker" value="#51f59b">
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">🔗</span> Synchroniser</span>
                                <label class="switch">
                                    <input type="checkbox" id="syncColorsToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TAB: SKIP -->
                <div class="tab-content" data-tab="skip">
                    <div class="section">
                        <div class="section-title">Forme</div>
                        <select class="select" id="skipShapeSelect">
                            <option value="circle">🔵 Cercle</option>
                            <option value="square">🟦 Carré</option>
                        </select>
                    </div>

                    <div class="section">
                        <div class="section-title">Taille</div>
                        <div class="slider-label">
                            <span>Taille</span>
                            <span class="slider-value" id="skipSizeValue">100px</span>
                        </div>
                        <input type="range" class="slider" id="skipSize" min="60" max="250" value="100">
                    </div>

                    <div class="section">
                        <div class="section-title">Raccourci clavier</div>
                        <button class="btn btn-secondary" id="changeKeyBtn">
                            <span id="currentKey">Espace</span>
                        </button>
                        <div class="info-box" id="keyInfo" style="display: none; margin-top: 8px;">
                            ⌨️ Appuyez sur une touche...
                        </div>
                    </div>
                </div>

                <!-- TAB: RÉGLAGES -->
                <div class="tab-content" data-tab="settings">
                    <div class="section">
                        <div class="section-title">Interface</div>
                        <div class="option">
                            <div class="slider-label">
                                <span>Opacité</span>
                                <span class="slider-value" id="opacityValue">95%</span>
                            </div>
                            <input type="range" class="slider" id="opacitySlider" min="50" max="100" value="95">
                        </div>

                        <div class="option">
                            <div class="slider-label">
                                <span>Taille police</span>
                                <span class="slider-value" id="fontSizeValue">13px</span>
                            </div>
                            <input type="range" class="slider" id="fontSizeSlider" min="10" max="16" value="13">
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">📦</span> Mode compact</span>
                                <label class="switch">
                                    <input type="checkbox" id="compactToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Options</div>
                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">⌨️</span> Raccourcis clavier</span>
                                <label class="switch">
                                    <input type="checkbox" id="keyboardToggle" checked>
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div class="option">
                            <div class="option-row">
                                <span class="option-label"><span class="option-icon">📊</span> Afficher FPS</span>
                                <label class="switch">
                                    <input type="checkbox" id="fpsToggle">
                                    <span class="switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">Actions</div>
                        <button class="btn btn-secondary" id="exportBtn">💾 Exporter config</button>
                        <button class="btn btn-secondary" id="importBtn">📥 Importer config</button>
                        <button class="btn btn-danger" id="resetBtn">🔄 Réinitialiser</button>
                    </div>

                    <div class="info-box">
                        💾 Sauvegarde automatique activée
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(ui);
    }

    // === OVERLAY POUR LES FONDS ===
    function createBackgroundOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'backgroundOverlay';
        document.body.insertBefore(overlay, document.body.firstChild);
    }

    // === BOUTON SKIP ===
    function createSkipButton() {
        const btn = document.createElement('div');
        btn.id = 'skipButton';
        btn.textContent = 'SKIP';
        btn.className = config.skipButtonShape;
        btn.style.left = '20px';
        btn.style.top = '50%';
        document.body.appendChild(btn);

        let isDragging = false;
        let hasMoved = false;
        let startX, startY, offsetX, offsetY;

        btn.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasMoved = false;

            const rect = btn.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            startX = e.clientX;
            startY = e.clientY;

            btn.style.transition = 'none';
            btn.style.animation = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const moveDistance = Math.sqrt(
                    Math.pow(e.clientX - startX, 2) +
                    Math.pow(e.clientY - startY, 2)
                );

                if (moveDistance > 5) hasMoved = true;

                const newLeft = e.clientX - offsetX;
                const newTop = e.clientY - offsetY;

                btn.style.left = newLeft + 'px';
                btn.style.top = newTop + 'px';
                btn.style.transform = 'none';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                btn.style.transition = 'transform 0.1s';
                btn.style.animation = 'pulse-skip 2s infinite';

                saveConfig();

                if (!hasMoved) location.reload();
            }
        });
    }

    // === FPS COUNTER ===
    let fpsCounter = null;
    let lastTime = performance.now();
    let frames = 0;

    function createFPSCounter() {
        if (!fpsCounter) {
            fpsCounter = document.createElement('div');
            fpsCounter.id = 'fpsCounter';
            document.body.appendChild(fpsCounter);
        }

        function updateFPS() {
            frames++;
            const now = performance.now();
            if (now >= lastTime + 1000) {
                fpsCounter.textContent = `${frames} FPS`;
                frames = 0;
                lastTime = now;
            }
            if (config.showFPS) requestAnimationFrame(updateFPS);
        }

        updateFPS();
    }

    function removeFPSCounter() {
        if (fpsCounter) {
            fpsCounter.remove();
            fpsCounter = null;
        }
    }

    // === EFFETS VISUELS ===

    // Particules classiques
    let particlesCanvas = null;
    let particlesCtx = null;
    let particlesArray = [];
    let particlesAnimFrame = null;

    function toggleParticles(enable) {
        if (enable) {
            particlesCanvas = document.createElement('canvas');
            particlesCanvas.id = 'particles-js';
            document.body.appendChild(particlesCanvas);

            particlesCtx = particlesCanvas.getContext('2d');
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;

            const count = Math.floor(config.particlesIntensity * 2); // 10-200 particules
            particlesArray = [];
            for (let i = 0; i < count; i++) {
                particlesArray.push({
                    x: Math.random() * particlesCanvas.width,
                    y: Math.random() * particlesCanvas.height,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    size: Math.random() * 3 + 1
                });
            }

            function animate() {
                particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
                particlesCtx.fillStyle = config.particlesColor;

                particlesArray.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;

                    particlesCtx.beginPath();
                    particlesCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    particlesCtx.fill();
                });

                if (config.particles) particlesAnimFrame = requestAnimationFrame(animate);
            }
            animate();
        } else {
            if (particlesAnimFrame) cancelAnimationFrame(particlesAnimFrame);
            if (particlesCanvas) particlesCanvas.remove();
            particlesCanvas = null;
        }
    }

    // Neige
    let snowCanvas = null;
    let snowCtx = null;
    let snowflakes = [];
    let snowAnimFrame = null;

    function toggleSnow(enable) {
        if (enable) {
            snowCanvas = document.createElement('canvas');
            snowCanvas.id = 'snow-canvas';
            document.body.appendChild(snowCanvas);

            snowCtx = snowCanvas.getContext('2d');
            snowCanvas.width = window.innerWidth;
            snowCanvas.height = window.innerHeight;

            const count = Math.floor(config.snowIntensity * 2); // 20-200 flocons
            snowflakes = [];
            for (let i = 0; i < count; i++) {
                snowflakes.push({
                    x: Math.random() * snowCanvas.width,
                    y: Math.random() * snowCanvas.height,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * (config.snowIntensity / 50) + 0.5,
                    wind: Math.random() * 0.5 - 0.25
                });
            }

            function animate() {
                snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
                snowCtx.fillStyle = 'white';

                snowflakes.forEach(flake => {
                    flake.y += flake.speed;
                    flake.x += flake.wind;

                    if (flake.y > snowCanvas.height) {
                        flake.y = -10;
                        flake.x = Math.random() * snowCanvas.width;
                    }

                    snowCtx.beginPath();
                    snowCtx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                    snowCtx.fill();
                });

                if (config.snow) snowAnimFrame = requestAnimationFrame(animate);
            }
            animate();
        } else {
            if (snowAnimFrame) cancelAnimationFrame(snowAnimFrame);
            if (snowCanvas) snowCanvas.remove();
            snowCanvas = null;
        }
    }

    // Pluie
    let rainCanvas = null;
    let rainCtx = null;
    let raindrops = [];
    let rainAnimFrame = null;

    function toggleRain(enable) {
        if (enable) {
            rainCanvas = document.createElement('canvas');
            rainCanvas.id = 'rain-canvas';
            document.body.appendChild(rainCanvas);

            rainCtx = rainCanvas.getContext('2d');
            rainCanvas.width = window.innerWidth;
            rainCanvas.height = window.innerHeight;

            const count = Math.floor(config.rainIntensity * 3); // 30-300 gouttes
            raindrops = [];
            for (let i = 0; i < count; i++) {
                raindrops.push({
                    x: Math.random() * rainCanvas.width,
                    y: Math.random() * rainCanvas.height,
                    length: Math.random() * 20 + 10,
                    speed: Math.random() * (config.rainIntensity / 10) + 10
                });
            }

            function animate() {
                rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
                rainCtx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
                rainCtx.lineWidth = 2;

                raindrops.forEach(drop => {
                    drop.y += drop.speed;

                    if (drop.y > rainCanvas.height) {
                        drop.y = -drop.length;
                        drop.x = Math.random() * rainCanvas.width;
                    }

                    rainCtx.beginPath();
                    rainCtx.moveTo(drop.x, drop.y);
                    rainCtx.lineTo(drop.x, drop.y + drop.length);
                    rainCtx.stroke();
                });

                if (config.rain) rainAnimFrame = requestAnimationFrame(animate);
            }
            animate();
        } else {
            if (rainAnimFrame) cancelAnimationFrame(rainAnimFrame);
            if (rainCanvas) rainCanvas.remove();
            rainCanvas = null;
        }
    }

    // Matrix
    let matrixCanvas = null;
    let matrixCtx = null;
    let matrixColumns = [];
    let matrixAnimFrame = null;

    function toggleMatrix(enable) {
        if (enable) {
            matrixCanvas = document.createElement('canvas');
            matrixCanvas.id = 'matrix-canvas';
            document.body.appendChild(matrixCanvas);

            matrixCtx = matrixCanvas.getContext('2d');
            matrixCanvas.width = window.innerWidth;
            matrixCanvas.height = window.innerHeight;

            const fontSize = 16;
            const columns = matrixCanvas.width / fontSize;
            matrixColumns = [];
            for (let i = 0; i < columns; i++) {
                matrixColumns[i] = 1;
            }

            const speed = 1 + (config.matrixIntensity / 100);

            function animate() {
                matrixCtx.fillStyle = `rgba(0, 0, 0, ${0.03 + (config.matrixIntensity / 2000)})`;
                matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

                matrixCtx.fillStyle = '#0F0';
                matrixCtx.font = fontSize + 'px monospace';

                for (let i = 0; i < matrixColumns.length; i++) {
                    const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                    matrixCtx.fillText(text, i * fontSize, matrixColumns[i] * fontSize);

                    if (matrixColumns[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                        matrixColumns[i] = 0;
                    }
                    matrixColumns[i] += speed;
                }

                if (config.matrix) matrixAnimFrame = requestAnimationFrame(animate);
            }
            animate();
        } else {
            if (matrixAnimFrame) cancelAnimationFrame(matrixAnimFrame);
            if (matrixCanvas) matrixCanvas.remove();
            matrixCanvas = null;
        }
    }

    // Étoiles
    let starsCanvas = null;
    let starsCtx = null;
    let stars = [];
    let starsAnimFrame = null;

    function toggleStars(enable) {
        if (enable) {
            starsCanvas = document.createElement('canvas');
            starsCanvas.id = 'stars-canvas';
            document.body.appendChild(starsCanvas);

            starsCtx = starsCanvas.getContext('2d');
            starsCanvas.width = window.innerWidth;
            starsCanvas.height = window.innerHeight;

            const count = Math.floor(config.starsIntensity * 4); // 40-400 étoiles
            stars = [];
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * starsCanvas.width,
                    y: Math.random() * starsCanvas.height,
                    radius: Math.random() * 2,
                    alpha: Math.random(),
                    alphaChange: Math.random() * (config.starsIntensity / 1000) + 0.01
                });
            }

            function animate() {
                starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

                stars.forEach(star => {
                    star.alpha += star.alphaChange;
                    if (star.alpha <= 0 || star.alpha >= 1) {
                        star.alphaChange *= -1;
                    }

                    starsCtx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                    starsCtx.beginPath();
                    starsCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    starsCtx.fill();
                });

                if (config.stars) starsAnimFrame = requestAnimationFrame(animate);
            }
            animate();
        } else {
            if (starsAnimFrame) cancelAnimationFrame(starsAnimFrame);
            if (starsCanvas) starsCanvas.remove();
            starsCanvas = null;
        }
    }

    // Bulles
    let bubblesCanvas = null;
    let bubblesCtx = null;
    let bubbles = [];
    let bubblesAnimFrame = null;

    function toggleBubbles(enable) {
        if (enable) {
            bubblesCanvas = document.createElement('canvas');
            bubblesCanvas.id = 'bubbles-canvas';
            document.body.appendChild(bubblesCanvas);

            bubblesCtx = bubblesCanvas.getContext('2d');
            bubblesCanvas.width = window.innerWidth;
            bubblesCanvas.height = window.innerHeight;

            const count = Math.floor(config.bubblesIntensity / 2) + 10; // 15-60 bulles
            bubbles = [];
            for (let i = 0; i < count; i++) {
                bubbles.push({
                    x: Math.random() * bubblesCanvas.width,
                    y: bubblesCanvas.height + Math.random() * 200,
                    radius: Math.random() * 30 + 10,
                    speed: Math.random() * (config.bubblesIntensity / 50) + 1
                });
            }

            function animate() {
                bubblesCtx.clearRect(0, 0, bubblesCanvas.width, bubblesCanvas.height);

                bubbles.forEach(bubble => {
                    bubble.y -= bubble.speed;

                    if (bubble.y + bubble.radius < 0) {
                        bubble.y = bubblesCanvas.height + bubble.radius;
                        bubble.x = Math.random() * bubblesCanvas.width;
                    }

                    bubblesCtx.beginPath();
                    bubblesCtx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                    bubblesCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                    bubblesCtx.fill();
                    bubblesCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    bubblesCtx.lineWidth = 2;
                    bubblesCtx.stroke();
                });

                if (config.bubbles) bubblesAnimFrame = requestAnimationFrame(animate);
            }
            animate();
        } else {
            if (bubblesAnimFrame) cancelAnimationFrame(bubblesAnimFrame);
            if (bubblesCanvas) bubblesCanvas.remove();
            bubblesCanvas = null;
        }
    }

    // Glitch
    function toggleGlitch(enable) {
        if (enable) {
            const intensity = config.glitchIntensity / 100;
            const style = document.createElement('style');
            style.id = 'glitchStyle';
            style.textContent = `
                @keyframes glitch {
                    0% { transform: translate(0); }
                    20% { transform: translate(${-2 * intensity}px, ${2 * intensity}px); }
                    40% { transform: translate(${-2 * intensity}px, ${-2 * intensity}px); }
                    60% { transform: translate(${2 * intensity}px, ${2 * intensity}px); }
                    80% { transform: translate(${2 * intensity}px, ${-2 * intensity}px); }
                    100% { transform: translate(0); }
                }
                body.glitch-effect {
                    animation: glitch ${0.5 / intensity}s infinite;
                }
            `;
            const old = document.getElementById('glitchStyle');
            if (old) old.remove();
            document.head.appendChild(style);

            document.body.classList.add('glitch-effect');
        } else {
            document.body.classList.remove('glitch-effect');
            const old = document.getElementById('glitchStyle');
            if (old) old.remove();
        }
    }

    // Rainbow
    function toggleRainbow(enable) {
        if (enable) {
            document.body.classList.add('rainbow-effect');
        } else {
            document.body.classList.remove('rainbow-effect');
        }
    }

    // Background
    function changeBackground(type) {
        const overlay = document.getElementById('backgroundOverlay');
        const customOption = document.getElementById('customColorOption');

        // Retirer toutes les classes d'animation
        overlay.classList.remove('active', 'rainbow-bg', 'disco', 'gradient-animated');

        if (type === 'none') {
            overlay.style.background = '';
            customOption.style.display = 'none';
        } else if (type === 'custom') {
            customOption.style.display = 'block';
            overlay.style.background = `linear-gradient(135deg, ${config.backgroundCustomColor} 0%, ${adjustColor(config.backgroundCustomColor, -30)} 100%)`;
            overlay.classList.add('active');
        } else {
            customOption.style.display = 'none';
            const gradients = {
                'gradient-1': 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                'gradient-2': 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                'gradient-3': 'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
                'gradient-4': 'linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)',
                'gradient-5': 'linear-gradient(45deg, #fa709a 0%, #fee140 100%)'
            };

            overlay.style.background = gradients[type];
            overlay.classList.add('active');
        }

        // Réappliquer les effets actifs
        if (config.backgroundRainbow) overlay.classList.add('rainbow-bg');
        if (config.disco) overlay.classList.add('disco');
        if (config.gradientAnimation) overlay.classList.add('gradient-animated');

        // Appliquer le blur
        overlay.style.filter = `blur(${config.backgroundBlur}px)`;

        config.backgroundEffect = type;
        saveConfig();
    }

    function toggleBackgroundRainbow(enable) {
        const overlay = document.getElementById('backgroundOverlay');
        if (enable) {
            // Activer l'overlay si pas déjà actif
            if (!overlay.classList.contains('active')) {
                overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                overlay.classList.add('active');
            }
            overlay.classList.add('rainbow-bg');
        } else {
            overlay.classList.remove('rainbow-bg');
            // Si aucun fond n'est sélectionné, désactiver l'overlay
            if (config.backgroundEffect === 'none' && !config.disco && !config.gradientAnimation) {
                overlay.classList.remove('active');
                overlay.style.background = '';
            }
        }
    }

    function toggleDisco(enable) {
        const overlay = document.getElementById('backgroundOverlay');
        if (enable) {
            overlay.classList.add('disco');
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('disco');
        }
    }

    function toggleGradientAnimation(enable) {
        const overlay = document.getElementById('backgroundOverlay');
        if (enable) {
            overlay.classList.add('gradient-animated');
        } else {
            overlay.classList.remove('gradient-animated');
        }
    }

    function updateBackgroundBlur(value) {
        const overlay = document.getElementById('backgroundOverlay');
        overlay.style.filter = `blur(${value}px)`;
        config.backgroundBlur = value;
        saveConfig();
    }

    // Update UI Colors
    function updateUIColors() {
        const style = document.createElement('style');
        style.id = 'dynamicColors';
        style.textContent = `
            #azarUI { border-color: ${config.uiColor} !important; box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${config.uiColor}4D !important; }
            .ui-header { border-bottom-color: ${config.uiColor}33 !important; }
            .ui-header h2 { color: ${config.uiColor} !important; }
            .section-title { color: ${config.uiColor} !important; border-bottom-color: ${config.uiColor}33 !important; }
            .slider-value { color: ${config.uiColor} !important; }
            input:checked + .switch-slider { background: ${config.uiColor} !important; border-color: ${config.uiColor} !important; }
            .slider::-webkit-slider-thumb { background: ${config.uiColor} !important; box-shadow: 0 0 8px ${config.uiColor}B3 !important; }
            .ui-content::-webkit-scrollbar-thumb { background: ${config.uiColor} !important; }
            .tab.active { color: ${config.uiColor} !important; border-bottom-color: ${config.uiColor} !important; background: ${config.uiColor}1A !important; }
            .select:focus, .color-input:focus, .text-input:focus { border-color: ${config.uiColor} !important; }
            .theme-preset.active { border-color: ${config.uiColor} !important; box-shadow: 0 0 15px ${config.uiColor}4D !important; }
            .info-box { background: ${config.uiColor}1A !important; border-color: ${config.uiColor}4D !important; color: ${config.uiColor} !important; }
            #fpsCounter { color: ${config.uiColor} !important; border-color: ${config.uiColor} !important; }
        `;
        const old = document.getElementById('dynamicColors');
        if (old) old.remove();
        document.head.appendChild(style);
    }

    // Update Skip Button
    function updateSkipButton() {
        const btn = document.getElementById('skipButton');
        if (btn) {
            btn.style.width = config.skipButtonSize + 'px';
            btn.style.height = config.skipButtonSize + 'px';
            btn.style.fontSize = (config.skipButtonSize / 5) + 'px';
            btn.style.background = `linear-gradient(135deg, ${config.skipButtonColor} 0%, ${adjustColor(config.skipButtonColor, -20)} 100%)`;
            btn.style.boxShadow = `0 10px 40px ${config.skipButtonColor}99`;

            // Appliquer la forme
            btn.className = config.skipButtonShape;

            const style = document.createElement('style');
            style.id = 'skipButtonAnim';
            style.textContent = `
                @keyframes pulse-skip {
                    0%, 100% { box-shadow: 0 10px 40px ${config.skipButtonColor}99; }
                    50% { box-shadow: 0 15px 60px ${config.skipButtonColor}FF; }
                }
            `;
            const old = document.getElementById('skipButtonAnim');
            if (old) old.remove();
            document.head.appendChild(style);
        }
    }

    function adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    // Apply Theme Preset
    function applyThemePreset(theme) {
        const themes = {
            neon: { ui: '#51f59b', skip: '#00d4ff' },
            sunset: { ui: '#fa709a', skip: '#fee140' },
            ocean: { ui: '#4facfe', skip: '#00f2fe' },
            fire: { ui: '#ff6b6b', skip: '#feca57' },
            purple: { ui: '#a29bfe', skip: '#6c5ce7' },
            mint: { ui: '#00b894', skip: '#00cec9' }
        };

        if (themes[theme]) {
            config.uiColor = themes[theme].ui;
            config.skipButtonColor = themes[theme].skip;

            document.getElementById('uiColorPicker').value = config.uiColor;
            document.getElementById('skipColorPicker').value = config.skipButtonColor;

            updateUIColors();
            updateSkipButton();
            saveConfig();

            // Update active state
            document.querySelectorAll('.theme-preset').forEach(el => el.classList.remove('active'));
            document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
        }
    }

    // === ÉVÉNEMENTS ===
    function attachEvents() {
        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                tab.classList.add('active');
                document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
            });
        });

        // Minimize
        document.getElementById('minimizeBtn').addEventListener('click', () => {
            const ui = document.getElementById('azarUI');
            ui.classList.add('minimized');
        });

        // Click sur l'icône pour agrandir
        document.getElementById('drag-handle-mini').addEventListener('click', (e) => {
            // Ne pas agrandir si on est en train de drag
            if (!e.target.closest('#drag-handle-mini').dataset.dragging) {
                const ui = document.getElementById('azarUI');
                ui.classList.remove('minimized');
            }
        });

        // Theme toggle
        document.getElementById('themeBtn').addEventListener('click', () => {
            const ui = document.getElementById('azarUI');
            if (config.uiTheme === 'dark') {
                config.uiTheme = 'light';
                ui.classList.add('light');
                document.getElementById('themeBtn').textContent = '🌙';
            } else {
                config.uiTheme = 'dark';
                ui.classList.remove('light');
                document.getElementById('themeBtn').textContent = '🌓';
            }
            saveConfig();
        });

        // Effets
        document.getElementById('particlesToggle').addEventListener('change', (e) => {
            config.particles = e.target.checked;
            toggleParticles(e.target.checked);
            saveConfig();
        });

        document.getElementById('particlesColor').addEventListener('input', (e) => {
            config.particlesColor = e.target.value;
            if (config.particles) {
                toggleParticles(false);
                toggleParticles(true);
            }
            saveConfig();
        });

        document.getElementById('particlesIntensity').addEventListener('input', (e) => {
            config.particlesIntensity = parseInt(e.target.value);
            document.getElementById('particlesIntensityValue').textContent = e.target.value;
            if (config.particles) {
                toggleParticles(false);
                toggleParticles(true);
            }
            saveConfig();
        });

        document.getElementById('snowToggle').addEventListener('change', (e) => {
            config.snow = e.target.checked;
            toggleSnow(e.target.checked);
            saveConfig();
        });

        document.getElementById('snowIntensity').addEventListener('input', (e) => {
            config.snowIntensity = parseInt(e.target.value);
            document.getElementById('snowIntensityValue').textContent = e.target.value;
            if (config.snow) {
                toggleSnow(false);
                toggleSnow(true);
            }
            saveConfig();
        });

        document.getElementById('rainToggle').addEventListener('change', (e) => {
            config.rain = e.target.checked;
            toggleRain(e.target.checked);
            saveConfig();
        });

        document.getElementById('rainIntensity').addEventListener('input', (e) => {
            config.rainIntensity = parseInt(e.target.value);
            document.getElementById('rainIntensityValue').textContent = e.target.value;
            if (config.rain) {
                toggleRain(false);
                toggleRain(true);
            }
            saveConfig();
        });

        document.getElementById('matrixToggle').addEventListener('change', (e) => {
            config.matrix = e.target.checked;
            toggleMatrix(e.target.checked);
            saveConfig();
        });

        document.getElementById('matrixIntensity').addEventListener('input', (e) => {
            config.matrixIntensity = parseInt(e.target.value);
            document.getElementById('matrixIntensityValue').textContent = e.target.value;
            if (config.matrix) {
                toggleMatrix(false);
                toggleMatrix(true);
            }
            saveConfig();
        });

        document.getElementById('starsToggle').addEventListener('change', (e) => {
            config.stars = e.target.checked;
            toggleStars(e.target.checked);
            saveConfig();
        });

        document.getElementById('starsIntensity').addEventListener('input', (e) => {
            config.starsIntensity = parseInt(e.target.value);
            document.getElementById('starsIntensityValue').textContent = e.target.value;
            if (config.stars) {
                toggleStars(false);
                toggleStars(true);
            }
            saveConfig();
        });

        document.getElementById('bubblesToggle').addEventListener('change', (e) => {
            config.bubbles = e.target.checked;
            toggleBubbles(e.target.checked);
            saveConfig();
        });

        document.getElementById('bubblesIntensity').addEventListener('input', (e) => {
            config.bubblesIntensity = parseInt(e.target.value);
            document.getElementById('bubblesIntensityValue').textContent = e.target.value;
            if (config.bubbles) {
                toggleBubbles(false);
                toggleBubbles(true);
            }
            saveConfig();
        });

        document.getElementById('rainbowToggle').addEventListener('change', (e) => {
            config.rainbow = e.target.checked;
            toggleRainbow(e.target.checked);
            saveConfig();
        });

        document.getElementById('glitchToggle').addEventListener('change', (e) => {
            config.glitch = e.target.checked;
            toggleGlitch(e.target.checked);
            saveConfig();
        });

        document.getElementById('glitchIntensity').addEventListener('input', (e) => {
            config.glitchIntensity = parseInt(e.target.value);
            document.getElementById('glitchIntensityValue').textContent = e.target.value;
            if (config.glitch) {
                toggleGlitch(false);
                toggleGlitch(true);
            }
            saveConfig();
        });

        // Background
        document.getElementById('backgroundSelect').addEventListener('change', (e) => {
            changeBackground(e.target.value);
        });

        document.getElementById('backgroundColorPicker').addEventListener('input', (e) => {
            config.backgroundCustomColor = e.target.value;
            if (config.backgroundEffect === 'custom') {
                changeBackground('custom');
            }
            saveConfig();
        });

        document.getElementById('backgroundRainbowToggle').addEventListener('change', (e) => {
            config.backgroundRainbow = e.target.checked;
            toggleBackgroundRainbow(e.target.checked);
            saveConfig();
        });

        document.getElementById('discoToggle').addEventListener('change', (e) => {
            config.disco = e.target.checked;
            toggleDisco(e.target.checked);
            saveConfig();
        });

        document.getElementById('gradientAnimToggle').addEventListener('change', (e) => {
            config.gradientAnimation = e.target.checked;
            toggleGradientAnimation(e.target.checked);
            saveConfig();
        });

        document.getElementById('blurSlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('blurValue').textContent = value + 'px';
            updateBackgroundBlur(value);
        });

        // Colors
        document.getElementById('uiColorPicker').addEventListener('input', (e) => {
            config.uiColor = e.target.value;
            updateUIColors();
            if (config.syncColors) {
                config.skipButtonColor = e.target.value;
                document.getElementById('skipColorPicker').value = e.target.value;
                updateSkipButton();
            }
            saveConfig();
        });

        document.getElementById('skipColorPicker').addEventListener('input', (e) => {
            config.skipButtonColor = e.target.value;
            updateSkipButton();
            saveConfig();
        });

        document.getElementById('syncColorsToggle').addEventListener('change', (e) => {
            config.syncColors = e.target.checked;
            if (e.target.checked) {
                config.skipButtonColor = config.uiColor;
                document.getElementById('skipColorPicker').value = config.uiColor;
                updateSkipButton();
            }
            saveConfig();
        });

        // Theme presets
        document.querySelectorAll('.theme-preset').forEach(preset => {
            preset.addEventListener('click', () => {
                applyThemePreset(preset.dataset.theme);
            });
        });

        // Skip
        document.getElementById('skipShapeSelect').addEventListener('change', (e) => {
            config.skipButtonShape = e.target.value;
            updateSkipButton();
            saveConfig();
        });

        document.getElementById('skipSize').addEventListener('input', (e) => {
            config.skipButtonSize = parseInt(e.target.value);
            document.getElementById('skipSizeValue').textContent = e.target.value + 'px';
            updateSkipButton();
            saveConfig();
        });

        // Changement de touche de raccourci
        let isListeningForKey = false;

        document.getElementById('changeKeyBtn').addEventListener('click', () => {
            if (isListeningForKey) return;

            isListeningForKey = true;
            document.getElementById('keyInfo').style.display = 'block';
            document.getElementById('changeKeyBtn').style.opacity = '0.5';
            document.getElementById('changeKeyBtn').style.pointerEvents = 'none';
        });

        document.addEventListener('keydown', (e) => {
            if (isListeningForKey) {
                e.preventDefault();

                config.skipKey = e.code;

                // Convertir le code en texte lisible
                let keyText = e.code.replace('Key', '').replace('Digit', '').replace('Arrow', '↑');
                if (e.code === 'Space') keyText = 'Espace';

                document.getElementById('currentKey').textContent = keyText;
                document.getElementById('keyInfo').style.display = 'none';
                document.getElementById('changeKeyBtn').style.opacity = '1';
                document.getElementById('changeKeyBtn').style.pointerEvents = 'auto';

                isListeningForKey = false;
                saveConfig();
            }
        });

        // Settings
        document.getElementById('opacitySlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('opacityValue').textContent = value + '%';
            config.uiOpacity = value;
            document.getElementById('azarUI').style.opacity = value / 100;
            saveConfig();
        });

        document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = value + 'px';
            config.uiFontSize = value;
            document.getElementById('azarUI').style.fontSize = value + 'px';
            saveConfig();
        });

        document.getElementById('compactToggle').addEventListener('change', (e) => {
            config.uiCompact = e.target.checked;
            const ui = document.getElementById('azarUI');
            if (e.target.checked) {
                ui.classList.add('compact');
            } else {
                ui.classList.remove('compact');
            }
            saveConfig();
        });

        document.getElementById('keyboardToggle').addEventListener('change', (e) => {
            config.keyboardShortcuts = e.target.checked;
            saveConfig();
        });

        document.getElementById('fpsToggle').addEventListener('change', (e) => {
            config.showFPS = e.target.checked;
            if (e.target.checked) {
                createFPSCounter();
            } else {
                removeFPSCounter();
            }
            saveConfig();
        });

        // Export/Import/Reset
        document.getElementById('exportBtn').addEventListener('click', () => {
            const dataStr = JSON.stringify(config, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'azar-visual-config.json';
            link.click();
            URL.revokeObjectURL(url);
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        Object.assign(config, imported);
                        saveConfig();
                        location.reload();
                    } catch (err) {
                        alert('Erreur lors de l\'importation de la configuration');
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Réinitialiser tous les paramètres ?')) {
                localStorage.removeItem('azarVisualConfig');
                location.reload();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!config.keyboardShortcuts) return;

            if (e.code === config.skipKey && !e.target.matches('input, textarea') && !isListeningForKey) {
                e.preventDefault();
                location.reload();
            }
        });
    }

    // === DRAG & DROP INTERFACE ===
    function makeDraggable() {
        const ui = document.getElementById('azarUI');
        const header = document.getElementById('uiHeader');
        const miniIcon = document.getElementById('drag-handle-mini');

        let isDragging = false;
        let offsetX, offsetY;
        let startX, startY;
        let hasMoved = false;

        const startDrag = (e) => {
            // Ne pas permettre le drag si on clique sur les boutons
            if (e.target.closest('.minimize-btn, .theme-btn')) return;

            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;

            const rect = ui.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            e.preventDefault();
        };

        const doDrag = (e) => {
            if (isDragging) {
                const moveDistance = Math.sqrt(
                    Math.pow(e.clientX - startX, 2) +
                    Math.pow(e.clientY - startY, 2)
                );

                if (moveDistance > 5) {
                    hasMoved = true;
                    miniIcon.dataset.dragging = 'true';
                }

                ui.style.left = (e.clientX - offsetX) + 'px';
                ui.style.top = (e.clientY - offsetY) + 'px';
                ui.style.right = 'auto';
            }
        };

        const stopDrag = () => {
            isDragging = false;
            setTimeout(() => {
                delete miniIcon.dataset.dragging;
            }, 100);
        };

        header.addEventListener('mousedown', startDrag);
        miniIcon.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    }

    // === RESTAURER LES PARAMÈTRES ===
    function restoreSettings() {
        const ui = document.getElementById('azarUI');

        // Appliquer thème
        if (config.uiTheme === 'light') {
            ui.classList.add('light');
            document.getElementById('themeBtn').textContent = '🌙';
        }

        // Appliquer compact
        if (config.uiCompact) ui.classList.add('compact');

        // Appliquer opacité et taille police
        ui.style.opacity = config.uiOpacity / 100;
        ui.style.fontSize = config.uiFontSize + 'px';

        // Restaurer les toggles
        document.getElementById('particlesToggle').checked = config.particles;
        document.getElementById('snowToggle').checked = config.snow;
        document.getElementById('rainToggle').checked = config.rain;
        document.getElementById('matrixToggle').checked = config.matrix;
        document.getElementById('starsToggle').checked = config.stars;
        document.getElementById('bubblesToggle').checked = config.bubbles;
        document.getElementById('rainbowToggle').checked = config.rainbow;
        document.getElementById('glitchToggle').checked = config.glitch;
        document.getElementById('backgroundRainbowToggle').checked = config.backgroundRainbow;
        document.getElementById('discoToggle').checked = config.disco;
        document.getElementById('gradientAnimToggle').checked = config.gradientAnimation;
        document.getElementById('syncColorsToggle').checked = config.syncColors;
        document.getElementById('compactToggle').checked = config.uiCompact;
        document.getElementById('keyboardToggle').checked = config.keyboardShortcuts;
        document.getElementById('fpsToggle').checked = config.showFPS;

        // Restaurer les couleurs
        document.getElementById('particlesColor').value = config.particlesColor;
        document.getElementById('backgroundColorPicker').value = config.backgroundCustomColor;
        document.getElementById('uiColorPicker').value = config.uiColor;
        document.getElementById('skipColorPicker').value = config.skipButtonColor;

        // Restaurer les sliders
        document.getElementById('particlesIntensity').value = config.particlesIntensity;
        document.getElementById('particlesIntensityValue').textContent = config.particlesIntensity;
        document.getElementById('snowIntensity').value = config.snowIntensity;
        document.getElementById('snowIntensityValue').textContent = config.snowIntensity;
        document.getElementById('rainIntensity').value = config.rainIntensity;
        document.getElementById('rainIntensityValue').textContent = config.rainIntensity;
        document.getElementById('matrixIntensity').value = config.matrixIntensity;
        document.getElementById('matrixIntensityValue').textContent = config.matrixIntensity;
        document.getElementById('starsIntensity').value = config.starsIntensity;
        document.getElementById('starsIntensityValue').textContent = config.starsIntensity;
        document.getElementById('bubblesIntensity').value = config.bubblesIntensity;
        document.getElementById('bubblesIntensityValue').textContent = config.bubblesIntensity;
        document.getElementById('glitchIntensity').value = config.glitchIntensity;
        document.getElementById('glitchIntensityValue').textContent = config.glitchIntensity;
        document.getElementById('blurSlider').value = config.backgroundBlur;
        document.getElementById('blurValue').textContent = config.backgroundBlur + 'px';
        document.getElementById('skipSize').value = config.skipButtonSize;
        document.getElementById('skipSizeValue').textContent = config.skipButtonSize + 'px';
        document.getElementById('opacitySlider').value = config.uiOpacity;
        document.getElementById('opacityValue').textContent = config.uiOpacity + '%';
        document.getElementById('fontSizeSlider').value = config.uiFontSize;
        document.getElementById('fontSizeValue').textContent = config.uiFontSize + 'px';

        // Restaurer la touche de raccourci
        let keyText = config.skipKey.replace('Key', '').replace('Digit', '').replace('Arrow', '↑');
        if (config.skipKey === 'Space') keyText = 'Espace';
        document.getElementById('currentKey').textContent = keyText;

        // Restaurer les selects
        document.getElementById('backgroundSelect').value = config.backgroundEffect;
        document.getElementById('skipShapeSelect').value = config.skipButtonShape;

        // Appliquer les effets
        if (config.particles) toggleParticles(true);
        if (config.snow) toggleSnow(true);
        if (config.rain) toggleRain(true);
        if (config.matrix) toggleMatrix(true);
        if (config.stars) toggleStars(true);
        if (config.bubbles) toggleBubbles(true);
        if (config.rainbow) toggleRainbow(true);
        if (config.glitch) toggleGlitch(true);
        if (config.showFPS) createFPSCounter();

        changeBackground(config.backgroundEffect);
        if (config.backgroundRainbow) toggleBackgroundRainbow(true);
        if (config.disco) toggleDisco(true);
        if (config.gradientAnimation) toggleGradientAnimation(true);
        updateBackgroundBlur(config.backgroundBlur);

        updateUIColors();
        updateSkipButton();
    }

    // === AUTO-CLICK ===
    function autoClickStart() {
        const interval = setInterval(() => {
            const buttons = document.querySelectorAll('button');
            for (let btn of buttons) {
                const text = btn.textContent.toLowerCase();
                if (text.includes('lancer') || text.includes('chat') || text.includes('start')) {
                    btn.click();
                    clearInterval(interval);
                    break;
                }
            }
        }, 500);
        setTimeout(() => clearInterval(interval), 10000);
    }

    // === INIT ===
    function init() {
        createBackgroundOverlay();
        createInterface();
        createSkipButton();
        attachEvents();
        makeDraggable();
        restoreSettings();
        autoClickStart();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
