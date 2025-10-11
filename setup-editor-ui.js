(function () {
  const make = (tag, attrs = {}, children = []) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v; else if (k === 'html') el.innerHTML = v; else el.id = k;
    });
    children.forEach(c => el.appendChild(c));
    return el;
  };

  // Editor containers
  const editor = make('div', { editorContainer: 'editor-container' });
  editor.id = 'editor-container';
  const grid = make('div', { gridContainer: 'grid-container' });
  grid.id = 'grid-container';
  document.body.appendChild(editor); editor.appendChild(grid);

  // Toggle buttons
  const toggleLeft = make('button', { toggleMenu: 'toggle-menu', html: '<span class=\"menu-arrow\"></span>' });
  toggleLeft.id = 'toggle-menu';
  const toggleRight = make('button', { toggleRightMenu: 'toggle-right-menu', html: '<span class=\"right-menu-arrow\"></span>' });
  toggleRight.id = 'toggle-right-menu';
  const toggleBottom = make('button', { toggleBottomMenu: 'toggle-bottom-menu', html: '<span class=\"bottom-menu-arrow\"></span>' });
  toggleBottom.id = 'toggle-bottom-menu';
  document.body.append(toggleLeft, toggleRight, toggleBottom);

  // Toolbars
  const leftTB = make('div', { toolbar: 'toolbar' });
  leftTB.id = 'toolbar';
  const rightTB = make('div', { rightToolbar: 'right-toolbar' });
  rightTB.id = 'right-toolbar';
  const bottomTB = make('div', { bottomToolbar: 'bottom-toolbar' });
  bottomTB.id = 'bottom-toolbar';
  document.body.append(leftTB, rightTB, bottomTB);

  const section = (title) => {
    const hdr = make('div', { class: 'section-header', html: `<h3>${title}</h3><span class=\"section-toggle\"></span>` });
    const cnt = make('div', { class: 'section-content' });
    cnt.classList.add('expanded');
    leftTB.append(hdr, cnt); return cnt;
  };

  // Block Tools
  {
    const cnt = section('Tools');
    ['place-block','remove-block','select-tool','color-dropper','drag-mode','move-mode','rotation-mode','place-asset','undo-action','redo-action','cheatsheet-btn']
      .forEach(id => { const b = make('button', { [id]: id }); b.id = id; b.className = 'tool-button'; b.textContent = id.replace('-', ' '); cnt.appendChild(b); });
  }

  // Block Settings
  {
    const cnt = section('Block Settings');
    const color = make('input', { blockColor: 'block-color' });
    color.id = 'block-color';
    color.type = 'color';
    cnt.appendChild(color);
    const type = make('select', { blockType: 'block-type' });
    type.id = 'block-type';
    ['half','full','stair'].forEach(v => { const o = document.createElement('option'); o.value=v; o.textContent=v; type.appendChild(o); });
    cnt.appendChild(type);
    const orient = make('select', { blockOrientation: 'block-orientation' });
    orient.id = 'block-orientation';
    ['north','east','south','west'].forEach(v => { const o = document.createElement('option'); o.value=v; o.textContent=v; orient.appendChild(o); });
    cnt.appendChild(orient);
    ['block-type-half','block-type-full','block-type-stair','orient-north','orient-east','orient-south','orient-west']
      .forEach(id => { const b = make('button', { [id]: id }); b.id=id; b.className='icon-toggle'; b.textContent=id.split('-').pop(); cnt.appendChild(b); });
    const list = make('div', { placedBlocksList: 'placed-blocks-list' });
    list.id='placed-blocks-list';
    cnt.appendChild(list);
  }

  // Fill Mode
  {
    const cnt = section('Fill Mode');
    const fillChk = make('input', { fillMode: 'fill-mode' });
    fillChk.id='fill-mode';
    fillChk.type='checkbox';
    cnt.appendChild(fillChk);
    const fc = make('div', { fillControls: 'fill-controls' });
    fc.id='fill-controls';
    ['fill-width','fill-height','fill-depth'].forEach(id => { const input = document.createElement('input'); input.id=id; input.type='number'; input.min='1'; input.max='32'; input.value='1'; fc.appendChild(input); });
    cnt.appendChild(fc);
  }

  // World Settings
  {
    const cnt = section('World Settings');
    const w = make('input', { worldWidth: 'world-width' });
    w.id='world-width';
    w.type='number';
    w.value='32';
    const h = make('input', { worldHeight: 'world-height' });
    h.id='world-height';
    h.type='number';
    h.value='32';
    const apply = make('button', { applyWorldSize: 'apply-world-size' });
    apply.id='apply-world-size';
    apply.textContent='Apply Size';
    const sizeInfo = make('div', { worldSizeDisplay: 'world-size-display' });
    sizeInfo.id='world-size-display';
    const sizeWarn = make('div', { worldSizeWarning: 'world-size-warning' });
    sizeWarn.id='world-size-warning';
    sizeWarn.style.display='none';
    cnt.append(w, h, apply, sizeInfo, sizeWarn);
  }

  // Mobile Controls
  {
    const cnt = section('Mobile Controls');
    const ttp = make('input', { mobileTapToPlace: 'mobile-tap-to-place' });
    ttp.id='mobile-tap-to-place';
    ttp.type='checkbox';
    ttp.checked=true;
    const msp = make('input', { mobileShowPreview: 'mobile-show-preview' });
    msp.id='mobile-show-preview';
    msp.type='checkbox';
    msp.checked=true;
    const vib = make('input', { mobileVibrate: 'mobile-vibrate' });
    vib.id='mobile-vibrate';
    vib.type='checkbox';
    const placeBtn = make('button', { mobilePlaceBlocks: 'mobile-place-blocks' });
    placeBtn.id='mobile-place-blocks';
    placeBtn.textContent='Place Blocks';
    const rotCtl = make('div', { mobileRotationControl: 'mobile-rotation-control' });
    rotCtl.id='mobile-rotation-control';
    rotCtl.style.cssText='position:fixed;bottom:10px;right:10px;width:120px;height:120px;background:#222;border-radius:8px;';
    cnt.append(ttp, msp, vib, placeBtn); document.body.appendChild(rotCtl);
  }

  // Action History
  { const cnt = section('Action History'); const hist = make('div', { actionHistory: 'action-history' }); hist.id='action-history'; cnt.appendChild(hist); }

  // RIGHT TOOLBAR SECTIONS
  const rSection = (title) => { const hdr = make('div',{class:'section-header',html:`<h3>${title}</h3><span class=\"section-toggle\"></span>`}); const cnt = make('div',{class:'section-content'}); cnt.classList.add('expanded'); rightTB.append(hdr,cnt); return cnt; };

  // Assets
  {
    const cnt = rSection('Assets');
    const modelInput = make('input', { modelInput: 'model-input' });
    modelInput.id='model-input';
    modelInput.type='file';
    modelInput.accept='.gltf,.glb';
    const assetList = make('div', { assetList: 'asset-list' });
    assetList.id='asset-list';
    const placedAssetsList = make('div', { placedAssetsList: 'placed-assets-list' });
    placedAssetsList.id='placed-assets-list';
    cnt.append(modelInput, assetList, placedAssetsList);
  }

  // Textures
  {
    const cnt = rSection('Textures');
    const texInput = make('input', { textureInput: 'texture-input' });
    texInput.id='texture-input';
    texInput.type='file';
    texInput.accept='image/*,.hdr,.exr';
    const loadBtn = make('button', { loadTexture: 'load-texture' });
    loadBtn.id='load-texture';
    loadBtn.textContent='Load Texture';
    const removeBtn = make('button', { removeTexture: 'remove-texture' });
    removeBtn.id='remove-texture';
    removeBtn.textContent='Remove Texture';
    const rmGroundBtn = make('button', { removeGroundTexture: 'remove-ground-texture' });
    rmGroundBtn.id='remove-ground-texture';
    rmGroundBtn.textContent='Remove Ground Texture';
    const genBtn = make('button', { generateTexture: 'generate-texture' });
    genBtn.id='generate-texture';
    genBtn.textContent='Generate Texture';
    const list = make('div', { texturesList: 'textures-list' });
    list.id='textures-list';
    cnt.append(texInput, loadBtn, removeBtn, rmGroundBtn, genBtn, list);
  }

  // Lighting
  {
    const cnt = rSection('Lighting');
    const amb = make('input', { ambientIntensity: 'ambient-intensity' });
    amb.id='ambient-intensity';
    amb.type='range';
    amb.min='0';
    amb.max='2';
    amb.step='0.1';
    amb.value='0.6';
    const ambVal = make('span', { ambientValue: 'ambient-value' });
    ambVal.id='ambient-value';
    ambVal.textContent='0.6';
    const dir = make('input', { directionalIntensity: 'directional-intensity' });
    dir.id='directional-intensity';
    dir.type='range';
    dir.min='0';
    dir.max='2';
    dir.step='0.1';
    dir.value='0.8';
    const dirVal = make('span', { directionalValue: 'directional-value' });
    dirVal.id='directional-value';
    dirVal.textContent='0.8';
    const sq = make('select', { shadowQuality: 'shadow-quality' });
    sq.id='shadow-quality';
    [512,1024,2048].forEach(v=>{const o=document.createElement('option'); o.value=v; o.textContent=v; sq.appendChild(o);});
    sq.value='2048';
    const sd = make('input', { shadowDistance: 'shadow-distance' });
    sd.id='shadow-distance';
    sd.type='range';
    sd.min='10';
    sd.max='200';
    sd.step='1';
    sd.value='80';
    const sdVal = make('span', { shadowDistanceValue: 'shadow-distance-value' });
    sdVal.id='shadow-distance-value';
    sdVal.textContent='80';
    const en = make('input', { enableShadows: 'enable-shadows' });
    en.id='enable-shadows';
    en.type='checkbox';
    en.checked=true;
    const lx = make('input', { lightX: 'light-x' });
    lx.id='light-x';
    lx.type='range';
    const ly = make('input', { lightY: 'light-y' });
    ly.id='light-y';
    ly.type='range';
    const lz = make('input', { lightZ: 'light-z' });
    lz.id='light-z';
    lz.type='range';
    const lxv = make('span', { lightXValue: 'light-x-value' });
    lxv.id='light-x-value';
    const lyv = make('span', { lightYValue: 'light-y-value' });
    lyv.id='light-y-value';
    const lzv = make('span', { lightZValue: 'light-z-value' });
    lzv.id='light-z-value';
    cnt.append(amb, ambVal, dir, dirVal, sq, sd, sdVal, en, lx, ly, lz, lxv, lyv, lzv);
  }

  // Background
  {
    const cnt = rSection('Background');
    const bgIn = make('input', { backgroundInput: 'background-input' });
    bgIn.id='background-input';
    bgIn.type='file';
    const up = make('button', { uploadBackground: 'upload-background' });
    up.id='upload-background';
    up.textContent='Upload Background';
    const rm = make('button', { removeBackground: 'remove-background' });
    rm.id='remove-background';
    rm.textContent='Remove Background';
    const info = make('div', { currentBackgroundInfo: 'current-background-info' });
    info.id='current-background-info';
    info.textContent='No background set';
    cnt.append(bgIn, up, rm, info);
  }

  // Import/Export
  {
    const cnt = rSection('Import/Export');
    const impFile = make('input', { importInput: 'import-input' });
    impFile.id='import-input';
    impFile.type='file';
    impFile.accept='application/json';
    const expBtn = make('button', { exportJson: 'export-json' });
    expBtn.id='export-json';
    expBtn.textContent='Export JSON';
    const impBtn = make('button', { importJson: 'import-json' });
    impBtn.id='import-json';
    impBtn.textContent='Import JSON';
    cnt.append(impFile, expBtn, impBtn);
  }

  // BOTTOM TOOLBAR
  const bSection = (title) => { const hdr = make('div',{class:'section-header',html:`<h3>${title}</h3><span class=\"section-toggle\"></span>`}); const cnt = make('div',{class:'section-content'}); cnt.classList.add('expanded'); bottomTB.append(hdr,cnt); return cnt; };

  // Chat
  {
    const cnt = bSection('Chat');
    const wrap = make('div', { chatWrapper: 'chat-wrapper' });
    wrap.id='chat-wrapper';
    const msgs = make('div', { chatMessages: 'chat-messages' });
    msgs.id='chat-messages';
    const inputC = make('div', { chatInputContainer: 'chat-input-container' });
    inputC.id='chat-input-container';
    const inp = make('input', { chatInput: 'chat-input' });
    inp.id='chat-input';
    inp.type='text';
    inp.placeholder='Type a message...';
    const send = make('button', { chatSend: 'chat-send' });
    send.id='chat-send';
    send.textContent='Send';
    const share = make('button', { shareWorldBtn: 'share-world-btn' });
    share.id='share-world-btn';
    share.textContent='Share World';
    inputC.append(inp, send, share);
    wrap.append(msgs, inputC);
    cnt.appendChild(wrap);
  }

  // Online users
  { const cnt = bSection('Online Users'); const users = make('div', { onlineUsers: 'online-users' }); users.id='online-users'; cnt.appendChild(users); }

  // Debug console
  { const dbg = make('div', { debugConsole: 'debug-console', html: `<div class=\"debug-header\">Debug</div><pre id=\"debug-content\"></pre>` }); dbg.id='debug-console'; document.body.appendChild(dbg); }
})();