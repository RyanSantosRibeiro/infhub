import { strToU8, zipSync } from "fflate";
import { escapeHtml, type Brief, type Plan } from "./commerce";

type PackageInput = { plan: Plan; brief: Brief; templateId?: string | null; background?: Uint8Array };

function palette(brief: Brief, plan: Plan, templateId?: string | null) {
  const style = `${brief.style} ${templateId || ""}`.toLowerCase();
  const defaults = /cozy|pastel|sakura|soft/.test(style) ? ["#edaac7", "#9bbabe"]
    : /minimal|clean|mono/.test(style) ? ["#dae6dd", "#a4b5a9"]
    : /retro|sunset|arcade/.test(style) ? ["#ff9270", "#d578f2"] : ["#a3ff6b", "#6ee7e8"];
  return plan !== "ready" && brief.colors?.length ? [brief.colors[0], brief.colors[1] || defaults[1]] : defaults;
}

export function buildOverlayPackage(input: PackageInput): Uint8Array {
  const { brief, plan } = input;
  const [accent, secondary] = palette(brief, plan, input.templateId);
  const name = escapeHtml(brief.name);
  const handle = escapeHtml(brief.handle || brief.name);
  const files: Record<string, Uint8Array> = {};
  if (input.background) files["assets/background.png"] = input.background;

  for (const vertical of [false, true]) {
    const width = vertical ? 1080 : 1920;
    const height = vertical ? 1920 : 1080;
    const dir = vertical ? "vertical-9x16" : "horizontal-16x9";
    const art = input.background ? "linear-gradient(180deg,#080b1680,#080b16d9),url('../assets/background.png') center/cover" : `radial-gradient(ellipse at 85% 10%,${accent}30,transparent 55%),radial-gradient(ellipse at 10% 90%,${secondary}30,transparent 50%),#0c1019`;
    const css = `*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;font-family:Arial,sans-serif;color:#f5f6f9;background:transparent}.canvas{position:relative;width:${width}px;height:${height}px;overflow:hidden}.art{background:${art}}.grid{position:absolute;inset:0;background-image:linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px);background-size:80px 80px}.orb{position:absolute;width:580px;height:580px;border:1px solid ${accent}40;border-radius:50%;right:-80px;top:-80px;box-shadow:0 0 120px ${accent}12,inset 0 0 110px ${accent}10;animation:breathe 7s ease-in-out infinite alternate}.topline{position:absolute;left:64px;right:64px;top:52px;display:flex;justify-content:space-between;align-items:center;font-size:22px;letter-spacing:4px}.brand{font-size:30px;font-weight:bold;letter-spacing:1px}.dot{display:inline-block;background:${accent};width:10px;height:10px;border-radius:50%;margin-right:14px}.main{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:80px}.eyebrow{color:${accent};font-size:22px;letter-spacing:8px;text-transform:uppercase}.title{font-size:${vertical ? 100 : 142}px;line-height:.96;max-width:${vertical ? 840 : 1400}px;font-weight:900;margin:40px 0;letter-spacing:-6px}.sub{font-size:26px;color:#c5cad5;letter-spacing:2px}.footer{position:absolute;bottom:55px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;font-size:23px;color:#c5cad5}.pill{padding:17px 24px;border:1px solid ${accent}66;border-radius:10px;color:${accent};font-size:19px;letter-spacing:2px}.line{height:4px;width:120px;background:${accent};margin:0 0 30px}.frame{position:absolute;border:3px solid ${accent};border-radius:20px;box-shadow:0 0 22px ${accent}25;background:transparent}.frame:after{content:'';position:absolute;bottom:-3px;left:25%;height:7px;width:50%;background:${secondary};border-radius:8px}.tag{position:absolute;left:24px;bottom:-20px;background:#0c1019;border:1px solid ${accent};padding:10px 22px;font-size:20px;border-radius:8px}.chat-label{position:absolute;top:24px;left:24px;font-size:20px;color:${accent};letter-spacing:5px}.lower{position:absolute;bottom:80px;left:80px;border-left:6px solid ${accent};padding:23px 38px;background:#0c1019ef;border-radius:0 12px 12px 0;min-width:420px}.lower b{font-size:42px;display:block;margin-bottom:9px}.lower span{font-size:23px;color:${accent}}@keyframes breathe{to{transform:translate(-25px,20px) scale(1.08);opacity:.65}}@media(prefers-reduced-motion:reduce){*{animation:none!important}}`;
    const wrap = (title: string, content: string, opaque = false, extraCss = "") => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=${width},initial-scale=1"><title>${escapeHtml(title)} · ${name}</title><style>${css}${extraCss}</style></head><body><div class="canvas${opaque ? " art" : ""}">${content}</div></body></html>`;
    const chrome = `<div class="grid"></div><div class="orb"></div><div class="topline"><span class="brand">${name}</span><span><i class="dot"></i>${escapeHtml(brief.category).toUpperCase()}</span></div>`;
    const footer = `<div class="footer"><span>${handle}</span><span class="pill">FEITO PARA ESTAR AO VIVO</span></div>`;
    const scenes = [
      ["starting-soon", "A LIVE JÁ VAI COMEÇAR", "Starting<br>soon.", "Pega seu lugar. A gente começa já já."],
      ["brb", "UMA PAUSA RÁPIDA", "Já<br>volto.", "Não sai daí. Daqui a pouco tem mais."],
      ["stream-ending", "POR HOJE É ISSO", "Até a<br>próxima.", "Valeu por fazer parte dessa live."],
    ];
    for (const [slug, eyebrow, title, subtitle] of scenes) {
      files[`${dir}/${slug}.html`] = strToU8(wrap(eyebrow, `${chrome}<main class="main"><div class="line"></div><span class="eyebrow">${eyebrow}</span><h1 class="title">${title}</h1><p class="sub">${subtitle}</p></main>${footer}`, true));
    }
    const webcam = vertical
      ? `<div class="frame" style="left:55px;top:80px;width:970px;height:546px"><span class="tag">${name}</span></div>`
      : `<div class="frame" style="right:52px;bottom:100px;width:480px;height:270px"><span class="tag">${name}</span></div>`;
    files[`${dir}/live.html`] = strToU8(wrap("Live / PC + webcam", `${webcam}<div class="footer"><span>${name}</span><span>${handle}</span></div>`));
    files[`${dir}/webcam.html`] = strToU8(wrap("Moldura de webcam", webcam));
    files[`${dir}/just-chatting.html`] = strToU8(wrap("Just Chatting", `<div class="frame" style="left:55px;top:75px;width:${vertical ? 970 : 1250}px;height:${vertical ? 900 : 850}px"><span class="tag">${name}</span></div><div class="frame" style="left:${vertical ? 55 : 1370}px;top:${vertical ? 1060 : 75}px;width:${vertical ? 970 : 490}px;height:${vertical ? 730 : 850}px"><span class="chat-label">CHAT</span></div>${footer}`));
    files[`${dir}/chat-box.html`] = strToU8(wrap("Chat box", `<div class="frame" style="left:50px;top:50px;width:${vertical ? 980 : 500}px;height:${vertical ? 1780 : 940}px"><span class="chat-label">CHAT</span></div>`));
    files[`${dir}/social-bar.html`] = strToU8(wrap("Redes sociais", `<div class="lower"><span>${handle}</span></div>`));
    files[`${dir}/lower-third.html`] = strToU8(wrap("Nome do canal", `<div class="lower"><b>${name}</b><span>${handle}</span></div>`));
    files[`${dir}/alert-frame.html`] = strToU8(wrap("Moldura para alertas", `<div class="frame" style="width:740px;height:150px;left:${(width - 740) / 2}px;top:70px"></div>`));
    files[`${dir}/transition-browser.html`] = strToU8(wrap("Transição Browser Source", `<div class="wipe"><b>${name}</b></div>`, false, `.wipe{position:absolute;inset:0;background:${accent};color:#101612;display:flex;align-items:center;justify-content:center;font-size:100px;animation:wipe 1.4s both}@keyframes wipe{0%{transform:translateX(-100%)}40%,60%{transform:translateX(0)}100%{transform:translateX(100%)}}`));
    files[`${dir}/webcam-frame.svg`] = strToU8(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect x="3" y="3" width="954" height="534" rx="20" fill="none" stroke="${accent}" stroke-width="6"/><path d="M300 537H660" stroke="${secondary}" stroke-width="6"/></svg>`);
  }
  files["LEIA-ME.txt"] = strToU8(`SEU PACOTE DE OVERLAYS\nCanal: ${brief.name}\nPacote: ${plan}\n\nCOMO INSTALAR NO OBS\n1. Extraia o ZIP inteiro para uma pasta permanente. Não mova a pasta assets separadamente.\n2. Crie uma cena no OBS. Em Fontes, clique + > Navegador > Criar nova.\n3. Marque Arquivo local e escolha um HTML da pasta horizontal-16x9.\n4. Configure Largura 1920 e Altura 1080 (vertical-9x16: 1080 x 1920).\n5. Para live e just-chatting, coloque a captura de jogo/tela e webcam ABAIXO do overlay na lista de fontes. Ajuste a imagem da webcam ao recorte.\n6. Crie cenas para starting-soon, live, just-chatting, brb e stream-ending.\n7. webcam-frame.svg também pode ser usado como fonte de Imagem, em 960 x 540.\n\nCHAT E ALERTAS\nchat-box.html e alert-frame.html são molduras visuais. Adicione sua URL de widget StreamElements/Streamlabs como uma fonte Navegador separada por cima. Este pacote não lê eventos Twitch/YouTube, mensagens ou doações automaticamente.\n\nTRANSIÇÃO\ntransition-browser.html é uma animação CSS de 1,4 segundo para fonte Navegador. Ative "Atualizar o navegador quando a cena se tornar ativa" para reproduzir. Não é um arquivo de vídeo WebM para a função Stinger nativa do OBS.\n\nPERSONALIZAÇÃO\nTextos e cores estão nos HTMLs e podem ser editados em um editor de texto. Fonte Arial instalada no sistema, sem fontes ou scripts remotos.\n\nARTE\n${input.background ? "Fundo criado com IA a partir do briefing; textos e layouts montados programaticamente para manter legibilidade." : "Design criado a partir de templates vetoriais. Este pacote não foi gerado por IA."}\nO layout vertical reaproveita a arte com recorte.\n\nENTREGA\nO link de download expira em 5 minutos. A página do pedido permite gerar um novo link. Guarde seu link privado de confirmação.\n`);
  files["manifest.json"] = strToU8(JSON.stringify({ version: 1, plan, template: input.templateId || null, category: brief.category, style: brief.style, formats: ["1920x1080", "1080x1920"], aiBackground: plan === "ai" && Boolean(input.background), files: Object.keys(files) }, null, 2));
  return zipSync(files, { level: 6 });
}
