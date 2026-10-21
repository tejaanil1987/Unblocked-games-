import React, { useState } from 'react';
import { X, Code2, PlusCircle, AlertCircle } from 'lucide-react';
import { gameService } from '../services/gameService.js';

export const AddGameModal = ({
  isOpen,
  onClose,
  onGameAdded,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [iframeInput, setIframeInput] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [desktopControls, setDesktopControls] = useState('Arrow Keys / Mouse');
  const [mobileControls, setMobileControls] = useState('Touch and drag');
  const [tagsInput, setTagsInput] = useState('Custom, Arcade, Web');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeInput.trim()) {
      setError('Please provide an <iframe> embed snippet or direct game URL.');
      return;
    }

    const parsed = gameService.parseIframeString(iframeInput);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'custom-game';

    const newGame = gameService.addCustomGame({
      title: title.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category,
      description: description.trim() || 'Custom added web arcade game.',
      instructions: instructions.trim() || 'Follow on-screen instructions.',
      controls: {
        desktop: desktopControls.trim() || 'Keyboard and mouse controls',
        mobile: mobileControls.trim() || 'Touchscreen gestures',
      },
      tags: tags.length ? tags : ['Custom', category],
      accentColor: 'indigo',
      iframeCode: parsed.rawIframe,
      iframeUrl: parsed.url,
      iframeSrcDoc: parsed.srcdoc,
    });

    onGameAdded(newGame);
    onClose();
  };

  const handleLoadSample = () => {
    setTitle('Cyber Particle Dodge');
    setCategory('Arcade');
    setIframeInput(`<iframe srcdoc="<!DOCTYPE html><html><body style='margin:0;background:#090d16;color:#38bdf8;font-family:sans-serif;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden'><canvas id='c' width='400' height='400' style='background:#0f172a;border:2px solid #38bdf8;border-radius:12px'></canvas><p style='font-size:12px;margin-top:8px'>Move mouse to dodge red particles! Score: <b id='s'>0</b></p><script>const c=document.getElementById('c'),ctx=c.getContext('2d');let p={x:200,y:200},enemies=[],s=0,over=false;window.onmousemove=e=>{const r=c.getBoundingClientRect();p.x=e.clientX-r.left;p.y=e.clientY-r.top};setInterval(()=>{if(over)return;enemies.push({x:Math.random()*400,y:0,vy:Math.random()*3+2});s++;document.getElementById('s').innerText=s},80);function step(){ctx.clearRect(0,0,400,400);ctx.fillStyle='#38bdf8';ctx.beginPath();ctx.arc(p.x,p.y,10,0,7);ctx.fill();ctx.fillStyle='#ef4444';for(let e of enemies){e.y+=e.vy;ctx.fillRect(e.x,e.y,8,8);if(Math.hypot(e.x-p.x,e.y-p.y)<14){over=true;alert('Game Over! Score: '+s);location.reload()}}if(!over)requestAnimationFrame(step)}step();</script></body></html>" width="100%" height="100%" frameborder="0"></iframe>`);
    setDescription('Maneuver your cyber orb to dodge cascading radioactive particle streams.');
    setInstructions('Move mouse to guide your particle. Avoid red collision hazard squares.');
    setDesktopControls('Mouse movement to guide orb');
    setMobileControls('Drag finger across canvas');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Code2 className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold">Add Game via IFRAME</h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
          Store any web game into your local catalog as a responsive iframe tag or direct embed URL. It runs seamlessly inside the sandbox player.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Game Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Retro Space Dodge"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Arcade">Arcade</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Action">Action</option>
                <option value="Classic">Classic</option>
                <option value="Strategy">Strategy</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                IFRAME Code or Web URL *
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] text-amber-500 hover:underline font-semibold cursor-pointer"
              >
                Insert Working Sample
              </button>
            </div>
            <textarea
              rows={4}
              value={iframeInput}
              onChange={(e) => setIframeInput(e.target.value)}
              placeholder='<iframe src="https://example.com/game" width="100%" height="100%"></iframe> or https://...'
              className="w-full font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-[11px]"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of the game..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Desktop Controls
              </label>
              <input
                type="text"
                value={desktopControls}
                onChange={(e) => setDesktopControls(e.target.value)}
                placeholder="e.g. WASD / Spacebar"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Mobile Controls
              </label>
              <input
                type="text"
                value={mobileControls}
                onChange={(e) => setMobileControls(e.target.value)}
                placeholder="e.g. Tap / Swipe"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Save to Catalog</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
