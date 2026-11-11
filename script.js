const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

// Ambient starfield: lightweight, decorative and responsive.
const canvas = $("#starfield");
const ctx = canvas.getContext("2d");
let stars = [], width = 0, height = 0, raf;
function resizeStars(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth; height = window.innerHeight;
  canvas.width = width*dpr; canvas.height = height*dpr;
  canvas.style.width = width+"px"; canvas.style.height = height+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.min(115, Math.floor(width*height/10500))}, () => ({
    x:Math.random()*width, y:Math.random()*height, r:Math.random()*1.3+.25,
    a:Math.random()*.55+.12, v:Math.random()*.22+.04, phase:Math.random()*6
  }));
}
function drawStars(t=0){
  ctx.clearRect(0,0,width,height);
  for(const s of stars){
    s.y -= s.v;
    if(s.y < -3){s.y=height+3;s.x=Math.random()*width}
    const alpha=s.a*(.7+.3*Math.sin(t*.001+s.phase));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,190,220,${alpha})`;ctx.fill();
  }
  raf=requestAnimationFrame(drawStars);
}
resizeStars(); drawStars();
window.addEventListener("resize",resizeStars);

// Gentle pointer glow.
const glow=$("#cursorGlow");
window.addEventListener("pointermove",e=>{
  glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";
},{passive:true});

// Reveal sections as they enter the viewport.
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

// Mobile navigation.
$("#menuToggle").addEventListener("click",()=>$("#nav").classList.toggle("open"));
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#nav").classList.remove("open")));


// Cyber Arcade: switch between project worlds while reusing the existing case-study modal.
const arcadeProjects = {
  edumatch: {
    level:"LEVEL 01 / 03", category:"EDUCATION / WEB PLATFORM", status:"IN DEVELOPMENT",
    title:"EduMatch", description:"Helping students in El Salvador discover universities and technical programs that fit their goals, location, and preferred study format.",
    tags:["WEB DEVELOPMENT","UI / UX","EDTECH"], hint:"PRESS PLAY TO EXPLORE", modal:"edumatch"
  },
  modakids: {
    level:"LEVEL 02 / 03", category:"FASHION / WEB + ML", status:"STUDENT PROJECT",
    title:"ModaKids", description:"A children’s clothing website where kids can show a clothing item to the camera and use an image-classification model trained with Teachable Machine to identify the type of garment.",
    tags:["HTML / CSS","TEACHABLE MACHINE","IMAGE CLASSIFICATION"], hint:"ENTER THE STYLE LAB", modal:"modakids"
  },
  hush: {
    level:"LEVEL 03 / 03", category:"FASHION / DIGITAL ADVERTISING", status:"CREATIVE PROJECT",
    title:"Hush", description:"A fashion website concept featuring recognized clothing brands and products, created as a digital space for visual promotion and advertising.",
    tags:["WEB DESIGN","FASHION","DIGITAL MARKETING"], hint:"ENTER THE HUSH STUDIO", modal:"hush"
  }
};
let activeArcade = "edumatch";
function selectArcade(id){
  const project = arcadeProjects[id];
  if(!project) return;
  activeArcade = id;
  const stage = $("#arcadeStage");
  stage.dataset.world = id;
  // Restart the entrance animation each time a world is selected.
  stage.querySelectorAll(".world").forEach(world=>{
    world.style.animation = "none";
    void world.offsetWidth;
    world.style.animation = "";
  });
  $("#arcadeLevel").textContent = project.level;
  $("#arcadeCategory").textContent = project.category;
  $("#arcadeStatus").textContent = project.status;
  $("#arcadeTitle").textContent = project.title;
  $("#arcadeDescription").textContent = project.description;
  $("#arcadeScreenHint").textContent = project.hint;
  $("#arcadeTech").innerHTML = project.tags.map(tag=>`<span>${tag}</span>`).join("");
  $$(".arcade-slot").forEach(button=>{
    const selected = button.dataset.arcade === id;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}
$$(".arcade-slot").forEach((button,index,buttons)=>{
  button.addEventListener("click",()=>selectArcade(button.dataset.arcade));
  button.addEventListener("keydown",event=>{
    if(event.key!=="ArrowRight" && event.key!=="ArrowLeft") return;
    event.preventDefault();
    const next=(index+(event.key==="ArrowRight"?1:-1)+buttons.length)%buttons.length;
    buttons[next].focus();
    selectArcade(buttons[next].dataset.arcade);
  });
});
$("#arcadePlay").addEventListener("click",()=>openCase(arcadeProjects[activeArcade].modal));
selectArcade("edumatch");

// Project filters.


// Editable case-study content. Replace bracketed prompts with verified details.
const projects={
 edumatch:{
  code:"CASE STUDY / 001",title:"EduMatch",website:"https://profound-scone-1b07c2.netlify.app",repo:"https://github.com/MoratayaSam/EduMatch-JS.git",
  intro:"An educational discovery website that helps students explore universities and technical programs and find options that fit their goals.",
  tech:"Education technology · Web development · Student guidance",
  gallery:["assets/projects/edumatch-1.png","assets/projects/edumatch-2.png","assets/projects/edumatch-3.png","assets/projects/edumatch-4.png"],
  challenge:{heading:"THE PURPOSE",body:"EduMatch brings information about educational opportunities together in one place, making it easier for students to explore possible academic paths.",bullets:["Designed around students exploring university and technical education options.","Presents study categories and educational information in a clear visual format."]},
  process:{heading:"THE WEBSITE",body:"The supplied screenshots show the homepage, study-category selection, and education-subcategory pages.",bullets:["Homepage with an introduction to the platform.","Category cards for areas such as degrees, engineering, and technical programs.","Subcategory browsing for different educational options."]},
  solution:{heading:"EXPLORE EDUMATCH",body:"The live website and the project repository are linked below. Screenshots supplied for the portfolio are shown here.",bullets:["Live website: EduMatch", "GitHub repository: EduMatch-JS" ]}
 },
 modakids:{
  code:"CASE STUDY / 002",title:"ModaKids",website:"https://bucolic-naiad-9b1ef1.netlify.app",repo:"",
  intro:"A children’s clothing website that uses a Teachable Machine image-classification model. Children can show a garment to the camera and the AI model helps identify the type of clothing.",
  tech:"Teachable Machine · AI image classification · Camera interaction · Web development",
  gallery:[],
  challenge:{heading:"THE IDEA",body:"Make clothing discovery more interactive for children by combining a clothing website with an AI-powered garment recognition experience.",bullets:["A child-friendly clothing website.","A camera-based experience for showing a clothing item to the model."]},
  process:{heading:"AI-POWERED IDENTIFICATION",body:"The project uses Teachable Machine for image classification. A camera image is presented to the model so it can identify the garment category it has learned.",bullets:["AI tool: Teachable Machine.","Interaction: show a clothing item using the camera.","Purpose: identify the type of garment shown."]},
  solution:{heading:"TRY MODAKIDS",body:"The published ModaKids website is available below. A separate GitHub repository link and project screenshots were not included in the supplied materials.",bullets:["Live website: ModaKids on Netlify.","AI feature: camera-based clothing identification with Teachable Machine."]}
 },
 hush:{
  code:"CASE STUDY / 003",title:"Hush",website:"https://alissonrivas.github.io/HUSH/",repo:"https://github.com/ariannaasosa/HUSH_homepage.git",
  intro:"A fashion website showcasing clothing from recognized brands in a polished digital space created for visual promotion and advertising.",
  tech:"Fashion · Web design · Digital advertising",
  gallery:["assets/projects/hush-1.png","assets/projects/hush-2.png","assets/projects/hush-3.png"],
  challenge:{heading:"THE CREATIVE GOAL",body:"Present clothing and fashion brands in an attractive, organized website that supports product promotion and visual storytelling.",bullets:["Fashion-focused presentation.","A visual experience designed to highlight clothing and brand identity."]},
  process:{heading:"THE HUSH EXPERIENCE",body:"The supplied screenshots show the homepage, a clothing collection page, and a promotional story section.",bullets:["Homepage introducing the Hush fashion experience.","Product browsing with clothing categories and product cards.","Promotional content designed around fashion and personal style."]},
  solution:{heading:"EXPLORE HUSH",body:"The live website, GitHub repository, and supplied website screenshots are available below.",bullets:["Live website: Hush", "GitHub repository: HUSH_homepage"]}
 }
};
let activeProject=null,activeTab="challenge";
const backdrop=$("#modalBackdrop");
function renderTab(){
 const data=projects[activeProject][activeTab];
 const bullets=data.bullets.map(x=>`<li>${x}</li>`).join("");
 const gallery=activeTab==="solution" && projects[activeProject].gallery.length
   ? `<div class="case-gallery">${projects[activeProject].gallery.map((src,i)=>`<figure><img src="${src}" alt="${projects[activeProject].title} website screenshot ${i+1}" loading="lazy"><figcaption>PROJECT PREVIEW / 0${i+1}</figcaption></figure>`).join("")}</div>` : "";
 $("#modalContent").innerHTML=`<h4>${data.heading}</h4><p>${data.body}</p><ul>${bullets}</ul>${gallery}`;
 $$(".modal-tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===activeTab));
}
function openCase(id){
 activeProject=id;activeTab="challenge";
 const p=projects[id];
 $("#modalCode").textContent=p.code;$("#modalTitle").textContent=p.title;$("#modalIntro").textContent=p.intro;
 $("#modalTech").textContent=p.tech;
 const repo=$("#modalGithub"), website=$("#modalWebsite");
 repo.href=p.repo || "#";repo.textContent=p.repo ? "GITHUB REPOSITORY ↗" : "GITHUB REPOSITORY NOT PROVIDED";repo.style.display="inline-flex";repo.classList.toggle("is-placeholder",!p.repo);repo.onclick=e=>{if(!p.repo)e.preventDefault()};
 website.href=p.website;website.textContent="LIVE WEBSITE ↗";website.style.display="inline-flex";
 renderTab();backdrop.classList.add("open");backdrop.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeCase(){backdrop.classList.remove("open");backdrop.setAttribute("aria-hidden","true");document.body.style.overflow=""}
$$("[data-open]").forEach(button=>button.addEventListener("click",()=>openCase(button.dataset.open)));
$$(".modal-tab").forEach(button=>button.addEventListener("click",()=>{activeTab=button.dataset.tab;renderTab()}));
$("#modalClose").addEventListener("click",closeCase);
backdrop.addEventListener("click",e=>{if(e.target===backdrop)closeCase()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCase()});

// Mascot reacts to a click.
$("#mascot").addEventListener("click",()=>{
  $("#mascot").animate([{transform:"translateY(0) rotate(0)"},{transform:"translateY(-24px) rotate(12deg)"},{transform:"translateY(0) rotate(-5deg)"}],{duration:650,easing:"ease-out"});
  const toast=$("#toast");toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1700);
});

