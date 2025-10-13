.edit-mode-control {
    background: rgba(255,255,255,0.9);
    padding: 10px;
    border-radius: 8px;
    border: 2px solid #8B4513;
}

.edit-toggle-btn, .load-btn, .clear-btn {
    background: #8B4513;
    color: white;
    border: none;
    padding: 8px 12px;
    margin: 2px;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Georgia', serif;
}

.edit-toggle-btn:hover { background: #A0522D; }
.load-btn { background: #2E8B57; }
.load-btn:hover { background: #3CB371; }
.clear-btn { background: #8B0000; }
.clear-btn:hover { background: #B22222; }

.edit-controls {
    background: rgba(255,255,255,0.95);
    padding: 15px;
    border-radius: 10px;
    border: 3px solid #8B0000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.edit-header {
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 2px solid #8B4513;
}

.edit-info {
    margin: 10px 0;
    font-weight: bold;
    color: #2F1B0A;
}

.edit-buttons {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.edit-btn {
    padding: 6px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-family: 'Georgia', serif;
    font-size: 12px;
}

.finish-btn { background: #2E8B57; color: white; }
.cancel-btn { background: #8B0000; color: white; }
.exit-btn { background: #696969; color: white; }

.point-info {
    margin-top: 8px;
    padding: 5px;
    background: rgba(139, 69, 19, 0.1);
    border-radius: 3px;
    display: none;
}

.editing-polygon {
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% { opacity: 0.7; }
    50% { opacity: 0.4; }
    100% { opacity: 0.7; }
}
