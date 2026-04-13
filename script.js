// ─── Image Preloading Logic ───
const preloadImages = () => {
    const images = Array.from(document.querySelectorAll('img'));
    // Include Slide 1 background image
    const bgImage = new Image();
    bgImage.src = 'assets/images/slide 1.png';
    const allMedia = [bgImage, ...images];
    
    let loadedCount = 0;
    const totalMedia = allMedia.length;
    const loadingBar = document.getElementById('loadingBar');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');

    const updateProgress = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / totalMedia) * 100);
        loadingBar.style.width = `${progress}%`;
        loadingText.innerText = `Preloading Assets... ${progress}%`;

        if (loadedCount >= totalMedia) {
            setTimeout(() => {
                loadingOverlay.classList.add('fade-out');
                // Refresh ScrollTrigger to ensure correct heights
                ScrollTrigger.refresh();
            }, 500);
        }
    };

    allMedia.forEach(img => {
        if (img.complete) {
            updateProgress();
        } else {
            img.onload = updateProgress;
            img.onerror = updateProgress; // Continue even if one fails
        }
    });
};

// Start preloading after DOM is ready
window.addEventListener('load', preloadImages);

// ─── Register GSAP Plugins ───
if (typeof SplitText !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, SplitText);
} else {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── Lenis Smooth Scrolling ───
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    lerp: 0.08,
    wheelMultiplier: 0.8,
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ─── Global Elements ───
const slides = gsap.utils.toArray('.slide');
const totalSlides = slides.length;
const progressBar = document.getElementById('progressBar');
const slideIndicator = document.getElementById('slideIndicator');

// ─── SplitText Preparation ───
const splitInstances = [];
if (typeof SplitText !== "undefined") {
    slides.forEach(slide => {
        const textTargets = slide.querySelectorAll(
            '.text-block h2, .text-block p, .full-content h1, .full-content h2, .full-content p'
        );
        textTargets.forEach(el => {
            const split = new SplitText(el, { type: "lines", linesClass: "split-line" });
            splitInstances.push(split);
            split.lines.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.classList.add('line-mask');
                wrapper.style.overflow = 'hidden';
                wrapper.style.display = 'block';
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });
        });
    });
} else {
    console.warn("SplitText plugin not found.");
    gsap.set('.text-block h2, .text-block p, .full-content h1, .full-content h2, .full-content p', { opacity: 1, y: 0 });
}

// ─── Initial States ───
gsap.set(slides, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 1, visibility: 'visible' });
gsap.set(slides.slice(1), { yPercent: 100 });

// Force main content visibility in case of CSS or SplitText issues
gsap.set('.content-grid, .full-content, .text-block', { opacity: 1, visibility: 'visible' });

if (typeof SplitText !== "undefined") {
    gsap.set('.split-line', { yPercent: 110, opacity: 0 });
    const firstSlideLines = slides[0].querySelectorAll('.split-line');
    if (firstSlideLines.length) {
        gsap.set(firstSlideLines, { yPercent: 0, opacity: 1 });
    } else {
        // Fallback: if lines weren't created, ensure parents are visible
        gsap.set('.full-content h1, .full-content p, .full-content .supertitle, .full-content .tagline', { opacity: 1, y: 0 });
    }
} else {
    console.warn("SplitText plugin not found or trial version issue.");
    gsap.set('.text-block h2, .text-block p, .full-content h1, .full-content h2, .full-content p', { opacity: 1, y: 0 });
}

const slide3El = slides[2];
const slide3ImageStack = slide3El.querySelector('.image-stack-grid');
const slide3TextBlock = slide3El.querySelector('.text-block');
const slide3Images = slide3El.querySelectorAll('.image-stack-grid .image-container');

gsap.set(slide3El, { yPercent: 100, opacity: 1 }); 
if (slide3ImageStack) gsap.set(slide3ImageStack, { xPercent: 100, opacity: 1, gap: '0px' });
if (slide3Images.length) gsap.set(slide3Images[0], { scale: 1, opacity: 1 });
if (slide3Images.length > 1) gsap.set(slide3Images[1], { scaleY: 0, transformOrigin: 'top center', opacity: 0 });
if (slide3TextBlock) gsap.set(slide3TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 });

const firstSlideCards = slides[0].querySelectorAll('.list-item, .challenge-card, .storyboard-item');
gsap.set(firstSlideCards, { y: 0, opacity: 1 });

slides.slice(1).forEach(slide => {
    const cards = slide.querySelectorAll('.list-item, .challenge-card, .storyboard-item');
    gsap.set(cards, { y: 50, opacity: 0 });
});

// ─── Master Timeline with Variable Speed ───
const scrollPerSlide = 100; 
const transitionDurations = slides.slice(0, -1).map((_, i) => (i === 3 ? 3.0 : (i === 7 || i === 8 || i === 17) ? 4.0 : (i === 23) ? 12.0 : 1.0));
const totalDuration = transitionDurations.reduce((a, b) => a + b, 0);

const accumulatedTimes = [0];
let currentTotal = 0;
transitionDurations.forEach(d => {
    currentTotal += d;
    accumulatedTimes.push(currentTotal);
});

const masterTl = gsap.timeline({
    scrollTrigger: {
        trigger: '.slides-wrapper',
        start: 'top top',
        end: `+=${totalDuration * scrollPerSlide}%`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
            progressBar.style.width = `${self.progress * 100}%`;
            const currentTime = self.progress * totalDuration;
            let currentIdx = 0;
            for (let j = 0; j < accumulatedTimes.length; j++) {
                if (currentTime >= accumulatedTimes[j] - 0.01) currentIdx = j;
            }
            slideIndicator.innerText = `${String(currentIdx + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
        }
    }
});

// ─── Build Slide Transitions ───
slides.forEach((slide, i) => {
    if (i === totalSlides - 1) return;

    const nextSlide = slides[i + 1];
    const duration = transitionDurations[i];
    const startTime = accumulatedTimes[i];
    const rel = (offset) => startTime + (offset * duration);

    // CUSTOM TRANSITION: Slide 2 → Slide 3
    if (i === 1) {
        const s2TextBlock = slide.querySelector('.text-block'), s2Image = slide.querySelector('.img-card'), s2Lines = slide.querySelectorAll('.split-line'), s2Cards = slide.querySelectorAll('.list-item');
        const s3 = nextSlide, s3ImgStack = s3.querySelector('.image-stack-grid'), s3Imgs = s3.querySelectorAll('.image-stack-grid .image-container'), s3TextBlock = s3.querySelector('.text-block'), s3Lines = s3.querySelectorAll('.split-line'), s3Cards = s3.querySelectorAll('.list-item');

        masterTl.to(s2TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s2Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, stagger: 0.01 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s2Cards, { opacity: 0, duration: 0.25 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s2Image, { xPercent: -100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0));
        masterTl.to(s3, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s3ImgStack, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0));
        masterTl.to(s2Image, { opacity: 0, duration: 0.1 * duration }, rel(0.4));
        masterTl.to(s3ImgStack, { gap: '0.75rem', duration: 0.4 * duration, ease: 'power3.out' }, rel(0.35));
        masterTl.to(s3Imgs[1], { scaleY: 1, opacity: 1, duration: 0.4 * duration, ease: 'power3.out' }, rel(0.35));
        masterTl.fromTo(s3TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s3Lines.length) masterTl.fromTo(s3Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s3Cards.length) masterTl.fromTo(s3Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(slide, { opacity: 0, visibility: 'hidden', duration: 0.1 * duration }, rel(0.7));
        return;
    }

    // CUSTOM TRANSITION: Slide 3 → Slide 4
    if (i === 2) {
        const s3 = slide, s4 = nextSlide, s4Cards = s4.querySelectorAll('.challenge-card'), s4Lines = s4.querySelectorAll('.split-line');
        masterTl.to(s3, { scale: 0.85, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s3, { visibility: 'hidden', duration: 0.1 * duration }, rel(0.5));
        masterTl.fromTo(s4, { yPercent: 100 }, { yPercent: 0, duration: 0.7 * duration, ease: 'power3.inOut' }, rel(0.15));
        masterTl.fromTo(s4Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        masterTl.fromTo(s4Cards[0], { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5 * duration, ease: 'back.out(1.2)' }, rel(0.7));
        return;
    }

    // CUSTOM TRANSITION: Slide 4 → Slide 5
    if (i === 3) {
        const s4 = slide, s5 = nextSlide, s4Cards = s4.querySelectorAll('.challenge-card');
        masterTl.fromTo(s4Cards[1], { y: 150, opacity: 0, rotation: 5, scale: 0.9 }, { y: 15, x: 15, opacity: 1, rotation: -2, scale: 1, duration: 0.2 * duration, ease: 'power2.out' }, rel(0.05));
        masterTl.fromTo(s4Cards[2], { y: 150, opacity: 0, rotation: -5, scale: 0.9 }, { y: 30, x: -10, opacity: 1, rotation: 3, scale: 1, duration: 0.2 * duration, ease: 'power2.out' }, rel(0.3));
        masterTl.fromTo(s4Cards[3], { y: 150, opacity: 0, rotation: 10, scale: 0.9 }, { y: 45, x: 5, opacity: 1, rotation: -1, scale: 1, duration: 0.2 * duration, ease: 'power2.out' }, rel(0.55));
        masterTl.to(s4, { scale: 0.8, opacity: 0, duration: 0.2 * duration, ease: 'power2.in' }, rel(0.8));
        masterTl.to(s4, { visibility: 'hidden', duration: 0.1 * duration }, rel(0.95));
        masterTl.fromTo(s5, { yPercent: 100 }, { yPercent: 0, duration: 0.2 * duration, ease: 'power3.inOut' }, rel(0.8));
        const s5Lines = s5.querySelectorAll('.split-line');
        if (s5Lines.length) masterTl.fromTo(s5Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.15 * duration, stagger: 0.02 * duration, ease: 'power3.out' }, rel(0.9));
        return;
    }

    // CUSTOM TRANSITION: Slide 5 → Slide 6
    if (i === 4) {
        const s5 = slide, s6 = nextSlide, s5Inner = s5.querySelector('.full-content'), s6Inner = s6.querySelector('.full-content'), s6Lines = s6.querySelectorAll('.split-line');
        gsap.set(s6, { yPercent: 0, xPercent: 100, opacity: 1 });
        gsap.set(s6Inner, { x: '-50vw', scale: 0.75 }); 
        masterTl.to(s5, { xPercent: -50, duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0));
        masterTl.to(s5Inner, { x: '25vw', scale: 0.75, duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0));
        masterTl.to(s6, { xPercent: 50, duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0));
        masterTl.to(s6Inner, { x: '-25vw', duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0));
        if (s6Lines.length) masterTl.fromTo(s6Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.1));
        masterTl.to(s5, { xPercent: -100, duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0.55));
        masterTl.to(s5Inner, { x: '50vw', duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0.55));
        masterTl.to(s6, { xPercent: 0, duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0.55));
        masterTl.to(s6Inner, { x: '0vw', scale: 1, duration: 0.45 * duration, ease: 'power2.inOut' }, rel(0.55));
        masterTl.to(s5, { opacity: 0, visibility: 'hidden', duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 7 → Slide 8 (i = 6)
    if (i === 6) {
        const s7 = slide, s7TextBlock = s7.querySelector('.text-block'), s7ImgStack = s7.querySelector('.image-stack-grid'), s7Lines = s7.querySelectorAll('.split-line'), s7Cards = s7.querySelectorAll('.list-item');
        const s8 = nextSlide, s8CycleCard = s8.querySelector('.cycle-card'), s8TextBlock = s8.querySelector('.text-block'), s8Lines = s8.querySelectorAll('.split-line'), s8Cards = s8.querySelectorAll('.list-item');
        const cycleItems = s8.querySelectorAll('.cycle-item');

        // Slide 7 exits
        masterTl.to(s7TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s7Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, stagger: 0.01 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s7Cards, { opacity: 0, duration: 0.25 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s7ImgStack, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0));

        // Slide 8 enters
        masterTl.to(s8, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.fromTo(s8CycleCard, { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0));
        
        // Reset and initialize Slide 8 cycle items
        gsap.set(cycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
        masterTl.set(cycleItems[0], { opacity: 1, y: 0, visibility: 'visible' }, rel(0.4));

        masterTl.fromTo(s8TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s8Lines.length) masterTl.fromTo(s8Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s8Cards.length) masterTl.fromTo(s8Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        
        masterTl.to(s7, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.7));
        return;
    }

    // CUSTOM TRANSITION: Slide 8 Cycle (i = 7)
    if (i === 7) {
        const s8 = slide, s9 = nextSlide;
        const s8CycleCard = s8.querySelector('.cycle-card'), s8TextBlock = s8.querySelector('.text-block'), s8Lines = s8.querySelectorAll('.split-line'), s8Cards = s8.querySelectorAll('.list-item');
        const s9CycleCard = s9.querySelector('.cycle-card'), s9TextBlock = s9.querySelector('.text-block'), s9Lines = s9.querySelectorAll('.split-line'), s9Cards = s9.querySelectorAll('.list-item');
        
        const s8CycleItems = s8.querySelectorAll('.cycle-item');
        const s9CycleItems = s9.querySelectorAll('.cycle-item');
        
        // Ensure initial states for s8 and s9
        gsap.set(s8CycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
        gsap.set(s8CycleItems[0], { opacity: 1, y: 0, visibility: 'visible' });
        
        if (s9CycleItems.length) {
            gsap.set(s9CycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
            gsap.set(s9CycleItems[0], { opacity: 1, y: 0, visibility: 'visible' });
            gsap.set(s9CycleCard, { xPercent: 100 });
        }
        
        // Initial states for subsequent card-grid slides
        const s11 = slides[10], s12 = slides[11], s13 = slides[12], s14 = slides[13], s15 = slides[14], s16 = slides[15], s17 = slides[16], s18 = slides[17], s19 = slides[18], s20 = slides[19], s21 = slides[20], s22 = slides[21], s23 = slides[22], s24 = slides[23];
        if (s11) gsap.set(s11.querySelector('.img-card'), { xPercent: 100 });
        if (s12) gsap.set(s12.querySelector('.img-card'), { xPercent: -100 });
        if (s13) gsap.set(s13.querySelector('.image-stack-grid'), { xPercent: 100 });
        if (s14) gsap.set(s14.querySelector('.image-stack-grid'), { xPercent: -100 });
        if (s15) gsap.set(s15.querySelector('.image-stack-grid'), { xPercent: 100 });
        if (s16) gsap.set(s16.querySelector('.image-stack-grid'), { xPercent: -100 });
        if (s17) gsap.set(s17.querySelector('.img-card'), { xPercent: 100 });
        if (s18) gsap.set(s18.querySelector('.cycle-card'), { xPercent: -100 });
        if (s19) gsap.set(s19.querySelector('.img-card'), { xPercent: 100 });
        if (s20) gsap.set(s20.querySelector('.img-card'), { xPercent: -100 });
        if (s21) gsap.set(s21.querySelector('.img-card'), { xPercent: 100 });
        if (s22) gsap.set(s22.querySelector('.full-content'), { yPercent: 100 });
        if (s23) gsap.set(s23.querySelector('.full-content'), { yPercent: 100 });
        if (s24) gsap.set(s24.querySelector('.cycle-card'), { xPercent: 100 });

        // --- PART 1: Slide 8 internal cycling ---
        const stepStarts = [0, 0.25, 0.5];
        s8CycleItems.forEach((item, idx) => {
            if (idx === 0) return;
            const prevItem = s8CycleItems[idx - 1];
            const start = stepStarts[idx];
            
            masterTl.to(prevItem, { opacity: 0, y: -30, duration: 0.15 * duration }, rel(start));
            masterTl.set(prevItem, { visibility: 'hidden' }, rel(start + 0.15));
            
            masterTl.set(item, { visibility: 'visible' }, rel(start + 0.05));
            masterTl.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 * duration }, rel(start + 0.05));
        });

        // --- PART 2: Transition from 8 to 9 ---
        const tStart = 0.75;
        const tDur = 0.25;

        // Slide 8 exits
        masterTl.to(s8TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s8Lines, { yPercent: -40, opacity: 0, duration: 0.3 * tDur * duration, stagger: 0.01 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s8Cards, { opacity: 0, duration: 0.25 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s8CycleCard, { xPercent: -100, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart));
        
        // Slide 9 enters
        masterTl.to(s9, { yPercent: 0, opacity: 1, duration: 0.1 * tDur * duration }, rel(tStart + 0.1 * tDur));
        masterTl.to(s9CycleCard, { xPercent: 0, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart));
        
        masterTl.to(s8CycleCard, { opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.4 * tDur));
        masterTl.fromTo(s9TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.25 * tDur));
        
        if (s9Lines.length) masterTl.fromTo(s9Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * tDur * duration, stagger: 0.03 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.5 * tDur));
        if (s9Cards.length) masterTl.fromTo(s9Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * tDur * duration, stagger: 0.04 * tDur * duration, ease: 'power2.out' }, rel(tStart + 0.6 * tDur));
        
        masterTl.to(s8, { visibility: 'hidden', opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.7 * tDur));

        return;
    }

    // CUSTOM TRANSITION: Slide 9 Cycle (i = 8)
    if (i === 8) {
        const s9 = slide, s10 = nextSlide;
        const s9CycleCard = s9.querySelector('.cycle-card'), s9TextBlock = s9.querySelector('.text-block'), s9Lines = s9.querySelectorAll('.split-line'), s9Cards = s9.querySelectorAll('.list-item');
        const s10Card = s10.querySelector('.image-stack-grid'), s10TextBlock = s10.querySelector('.text-block'), s10Lines = s10.querySelectorAll('.split-line'), s10Cards = s10.querySelectorAll('.list-item');
        
        const s9CycleItems = s9.querySelectorAll('.cycle-item');
        
        // Ensure initial states
        gsap.set(s9CycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
        gsap.set(s9CycleItems[0], { opacity: 1, y: 0, visibility: 'visible' });
        
        if (s10Card) {
            gsap.set(s10Card, { xPercent: -100 }); // Comes from Left
        }

        // --- PART 1: Slide 9 internal cycling ---
        const stepStarts = [0, 0.25, 0.5];
        s9CycleItems.forEach((item, idx) => {
            if (idx === 0) return;
            const prevItem = s9CycleItems[idx - 1];
            const start = stepStarts[idx];
            
            masterTl.to(prevItem, { opacity: 0, y: -30, duration: 0.15 * duration }, rel(start));
            masterTl.set(prevItem, { visibility: 'hidden' }, rel(start + 0.15));
            
            masterTl.set(item, { visibility: 'visible' }, rel(start + 0.05));
            masterTl.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 * duration }, rel(start + 0.05));
        });

        // --- PART 2: Transition from 9 to 10 ---
        const tStart = 0.75;
        const tDur = 0.25;

        // Slide 9 exits
        masterTl.to(s9TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s9Lines, { yPercent: -40, opacity: 0, duration: 0.3 * tDur * duration, stagger: 0.01 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s9Cards, { opacity: 0, duration: 0.25 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s9CycleCard, { xPercent: 100, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart)); // Slides Right
        
        // Slide 10 enters
        masterTl.to(s10, { yPercent: 0, opacity: 1, duration: 0.1 * tDur * duration }, rel(tStart + 0.1 * tDur));
        masterTl.to(s10Card, { xPercent: 0, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart)); // Slides from Left
        
        masterTl.to(s9CycleCard, { opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.4 * tDur));
        masterTl.fromTo(s10TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.25 * tDur));
        
        if (s10Lines.length) masterTl.fromTo(s10Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * tDur * duration, stagger: 0.03 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.5 * tDur));
        if (s10Cards.length) masterTl.fromTo(s10Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * tDur * duration, stagger: 0.04 * tDur * duration, ease: 'power2.out' }, rel(tStart + 0.6 * tDur));
        
        masterTl.to(s9, { visibility: 'hidden', opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.7 * tDur));

        return;
    }

    // CUSTOM TRANSITION: Slide 10 → Slide 11 (i = 9)
    if (i === 9) {
        const s10 = slide, s11 = nextSlide;
        const s10Card = s10.querySelector('.image-stack-grid'), s10TextBlock = s10.querySelector('.text-block'), s10Lines = s10.querySelectorAll('.split-line'), s10Cards = s10.querySelectorAll('.list-item');
        const s11Card = s11.querySelector('.img-card'), s11TextBlock = s11.querySelector('.text-block'), s11Lines = s11.querySelectorAll('.split-line'), s11Cards = s11.querySelectorAll('.list-item');

        masterTl.to(s10TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s10Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s10Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s10Card, { xPercent: -100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Left
        
        masterTl.to(s11, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s11Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Right
        
        masterTl.fromTo(s11TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s11Lines.length) masterTl.fromTo(s11Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s11Cards.length) masterTl.fromTo(s11Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s10, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 11 → Slide 12 (i = 10)
    if (i === 10) {
        const s11 = slide, s12 = nextSlide;
        const s11Card = s11.querySelector('.img-card'), s11TextBlock = s11.querySelector('.text-block'), s11Lines = s11.querySelectorAll('.split-line'), s11Cards = s11.querySelectorAll('.list-item');
        const s12Card = s12.querySelector('.img-card'), s12TextBlock = s12.querySelector('.text-block'), s12Lines = s12.querySelectorAll('.split-line'), s12Cards = s12.querySelectorAll('.list-item');

        masterTl.to(s11TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s11Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s11Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s11Card, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Right
        
        masterTl.to(s12, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s12Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Left
        
        masterTl.fromTo(s12TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s12Lines.length) masterTl.fromTo(s12Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s12Cards.length) masterTl.fromTo(s12Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s11, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 12 → Slide 13 (i = 11)
    if (i === 11) {
        const s12 = slide, s13 = nextSlide;
        const s12Card = s12.querySelector('.img-card'), s12TextBlock = s12.querySelector('.text-block'), s12Lines = s12.querySelectorAll('.split-line'), s12Cards = s12.querySelectorAll('.list-item');
        const s13Card = s13.querySelector('.image-stack-grid'), s13TextBlock = s13.querySelector('.text-block'), s13Lines = s13.querySelectorAll('.split-line'), s13Cards = s13.querySelectorAll('.list-item');

        masterTl.to(s12TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s12Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s12Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s12Card, { xPercent: -100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Left
        
        masterTl.to(s13, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s13Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Right
        
        masterTl.fromTo(s13TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s13Lines.length) masterTl.fromTo(s13Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s13Cards.length) masterTl.fromTo(s13Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s12, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 13 → Slide 14 (i = 12)
    if (i === 12) {
        const s13 = slide, s14 = nextSlide;
        const s13Card = s13.querySelector('.image-stack-grid'), s13TextBlock = s13.querySelector('.text-block'), s13Lines = s13.querySelectorAll('.split-line'), s13Cards = s13.querySelectorAll('.list-item');
        const s14Card = s14.querySelector('.image-stack-grid'), s14TextBlock = s14.querySelector('.text-block'), s14Lines = s14.querySelectorAll('.split-line'), s14Cards = s14.querySelectorAll('.list-item');

        masterTl.to(s13TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s13Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s13Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s13Card, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Right
        
        masterTl.to(s14, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s14Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Left
        
        masterTl.fromTo(s14TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s14Lines.length) masterTl.fromTo(s14Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s14Cards.length) masterTl.fromTo(s14Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s13, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 14 → Slide 15 (i = 13)
    if (i === 13) {
        const s14 = slide, s15 = nextSlide;
        const s14Card = s14.querySelector('.image-stack-grid'), s14TextBlock = s14.querySelector('.text-block'), s14Lines = s14.querySelectorAll('.split-line'), s14Cards = s14.querySelectorAll('.list-item');
        const s15Card = s15.querySelector('.image-stack-grid'), s15TextBlock = s15.querySelector('.text-block'), s15Lines = s15.querySelectorAll('.split-line'), s15Cards = s15.querySelectorAll('.list-item');

        masterTl.to(s14TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s14Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s14Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s14Card, { xPercent: -100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Left
        
        masterTl.to(s15, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s15Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Right
        
        masterTl.fromTo(s15TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s15Lines.length) masterTl.fromTo(s15Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s15Cards.length) masterTl.fromTo(s15Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s14, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 15 → Slide 16 (i = 14)
    if (i === 14) {
        const s15 = slide, s16 = nextSlide;
        const s15Card = s15.querySelector('.image-stack-grid'), s15TextBlock = s15.querySelector('.text-block'), s15Lines = s15.querySelectorAll('.split-line'), s15Cards = s15.querySelectorAll('.list-item');
        const s16Card = s16.querySelector('.image-stack-grid'), s16TextBlock = s16.querySelector('.text-block'), s16Lines = s16.querySelectorAll('.split-line'), s16Cards = s16.querySelectorAll('.list-item');

        masterTl.to(s15TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s15Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s15Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s15Card, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Right
        
        masterTl.to(s16, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s16Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Left
        
        masterTl.fromTo(s16TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s16Lines.length) masterTl.fromTo(s16Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s16Cards.length) masterTl.fromTo(s16Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s15, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 16 → Slide 17 (i = 15)
    if (i === 15) {
        const s16 = slide, s17 = nextSlide;
        const s16Card = s16.querySelector('.image-stack-grid'), s16TextBlock = s16.querySelector('.text-block'), s16Lines = s16.querySelectorAll('.split-line'), s16Cards = s16.querySelectorAll('.list-item');
        const s17Card = s17.querySelector('.img-card'), s17TextBlock = s17.querySelector('.text-block'), s17Lines = s17.querySelectorAll('.split-line'), s17Cards = s17.querySelectorAll('.list-item');

        masterTl.to(s16TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s16Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s16Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s16Card, { xPercent: -100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Left
        
        masterTl.to(s17, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s17Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Right
        
        masterTl.fromTo(s17TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s17Lines.length) masterTl.fromTo(s17Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s17Cards.length) masterTl.fromTo(s17Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s16, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 17 → Slide 18 (i = 16)
    if (i === 16) {
        const s17 = slide, s18 = nextSlide;
        const s17Card = s17.querySelector('.img-card'), s17TextBlock = s17.querySelector('.text-block'), s17Lines = s17.querySelectorAll('.split-line'), s17Cards = s17.querySelectorAll('.list-item');
        const s18CycleCard = s18.querySelector('.cycle-card'), s18TextBlock = s18.querySelector('.text-block'), s18Lines = s18.querySelectorAll('.split-line'), s18Cards = s18.querySelectorAll('.list-item');
        const s18CycleItems = s18.querySelectorAll('.cycle-item');

        masterTl.to(s17TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s17Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s17Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s17Card, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Right
        
        masterTl.to(s18, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.fromTo(s18CycleCard, { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Left
        
        // Reset and initialize Slide 18 cycle items
        gsap.set(s18CycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
        masterTl.set(s18CycleItems[0], { opacity: 1, y: 0, visibility: 'visible' }, rel(0.4));

        masterTl.fromTo(s18TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s18Lines.length) masterTl.fromTo(s18Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s18Cards.length) masterTl.fromTo(s18Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s17, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 18 Cycle (i = 17)
    if (i === 17) {
        const s18 = slide, s19 = nextSlide;
        const s18CycleCard = s18.querySelector('.cycle-card'), s18TextBlock = s18.querySelector('.text-block'), s18Lines = s18.querySelectorAll('.split-line'), s18Cards = s18.querySelectorAll('.list-item');
        const s19Card = s19.querySelector('.img-card'), s19TextBlock = s19.querySelector('.text-block'), s19Lines = s19.querySelectorAll('.split-line'), s19Cards = s19.querySelectorAll('.list-item');
        
        const s18CycleItems = s18.querySelectorAll('.cycle-item');
        
        // Ensure initial states
        gsap.set(s18CycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
        gsap.set(s18CycleItems[0], { opacity: 1, y: 0, visibility: 'visible' });
        
        if (s19Card) {
            gsap.set(s19Card, { xPercent: 100 }); // Enter from Right
        }

        // --- PART 1: Slide 18 internal cycling ---
        const stepStarts = [0, 0.25, 0.5];
        s18CycleItems.forEach((item, idx) => {
            if (idx === 0) return;
            const prevItem = s18CycleItems[idx - 1];
            const start = stepStarts[idx];
            
            masterTl.to(prevItem, { opacity: 0, y: -30, duration: 0.15 * duration }, rel(start));
            masterTl.set(prevItem, { visibility: 'hidden' }, rel(start + 0.15));
            
            masterTl.set(item, { visibility: 'visible' }, rel(start + 0.05));
            masterTl.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 * duration }, rel(start + 0.05));
        });

        // --- PART 2: Transition from 18 to 19 ---
        const tStart = 0.75;
        const tDur = 0.25;

        // Slide 18 exits
        masterTl.to(s18TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s18Lines, { yPercent: -40, opacity: 0, duration: 0.3 * tDur * duration, stagger: 0.01 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s18Cards, { opacity: 0, duration: 0.25 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s18CycleCard, { xPercent: -100, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart)); // Exit Left
        
        // Slide 19 enters
        masterTl.to(s19, { yPercent: 0, opacity: 1, duration: 0.1 * tDur * duration }, rel(tStart + 0.1 * tDur));
        masterTl.to(s19Card, { xPercent: 0, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart)); 
        
        masterTl.to(s18CycleCard, { opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.4 * tDur));
        masterTl.fromTo(s19TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.25 * tDur));
        
        if (s19Lines.length) masterTl.fromTo(s19Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * tDur * duration, stagger: 0.03 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.5 * tDur));
        if (s19Cards.length) masterTl.fromTo(s19Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * tDur * duration, stagger: 0.04 * tDur * duration, ease: 'power2.out' }, rel(tStart + 0.6 * tDur));
        
        masterTl.to(s18, { visibility: 'hidden', opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.7 * tDur));

        return;
    }

    if (i === 18) {
        const s19 = slide, s20 = nextSlide;
        const s19Card = s19.querySelector('.img-card'), s19TextBlock = s19.querySelector('.text-block'), s19Lines = s19.querySelectorAll('.split-line'), s19Cards = s19.querySelectorAll('.list-item');
        const s20Card = s20.querySelector('.img-card'), s20TextBlock = s20.querySelector('.text-block'), s20Lines = s20.querySelectorAll('.split-line'), s20Cards = s20.querySelectorAll('.list-item');

        masterTl.to(s19TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s19Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s19Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s19Card, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Right
        
        masterTl.to(s20, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s20Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Left
        
        masterTl.fromTo(s20TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s20Lines.length) masterTl.fromTo(s20Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s20Cards.length) masterTl.fromTo(s20Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s19, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    if (i === 19) {
        const s20 = slide, s21 = nextSlide;
        const s20Card = s20.querySelector('.img-card'), s20TextBlock = s20.querySelector('.text-block'), s20Lines = s20.querySelectorAll('.split-line'), s20Cards = s20.querySelectorAll('.list-item');
        const s21Card = s21.querySelector('.img-card'), s21TextBlock = s21.querySelector('.text-block'), s21Lines = s21.querySelectorAll('.split-line'), s21Cards = s21.querySelectorAll('.list-item');

        masterTl.to(s20TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s20Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s20Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s20Card, { xPercent: -100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Left
        
        masterTl.to(s21, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.to(s21Card, { xPercent: 0, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Right
        
        masterTl.fromTo(s21TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s21Lines.length) masterTl.fromTo(s21Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s21Cards.length) masterTl.fromTo(s21Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s20, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    if (i === 20) {
        const s21 = slide, s22 = nextSlide;
        const s21Card = s21.querySelector('.img-card'), s21TextBlock = s21.querySelector('.text-block'), s21Lines = s21.querySelectorAll('.split-line'), s21Cards = s21.querySelectorAll('.list-item');
        const s22Full = s22.querySelector('.full-content'), s22Lines = s22.querySelectorAll('.split-line'), s22Cards = s22.querySelectorAll('.challenge-card');

        masterTl.to(s21TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s21Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s21Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s21Card, { xPercent: 100, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Exit Right
        
        masterTl.to(s22, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.fromTo(s22Full, { yPercent: 100 }, { yPercent: 0, duration: 0.7 * duration, ease: 'power3.inOut' }, rel(0.15));
        
        if (s22Lines.length) masterTl.fromTo(s22Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.55));
        if (s22Cards.length) masterTl.fromTo(s22Cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.65));
        masterTl.to(s21, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    if (i === 21) {
        const s22 = slide, s23 = nextSlide;
        const s22Full = s22.querySelector('.full-content'), s22Lines = s22.querySelectorAll('.split-line'), s22Cards = s22.querySelectorAll('.challenge-card');
        const s23Full = s23.querySelector('.full-content'), s23Lines = s23.querySelectorAll('.split-line'), s23Cards = s23.querySelectorAll('.list-item');

        masterTl.to(s22Full, { y: -100, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s22Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s22Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        
        masterTl.to(s23, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.fromTo(s23Full, { yPercent: 100 }, { yPercent: 0, duration: 0.7 * duration, ease: 'power3.inOut' }, rel(0.15));
        
        if (s23Lines.length) masterTl.fromTo(s23Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.55));
        if (s23Cards.length) masterTl.fromTo(s23Cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.65));
        masterTl.to(s22, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    if (i === 22) {
        const s23 = slide, s24 = nextSlide;
        const s23Full = s23.querySelector('.full-content'), s23Lines = s23.querySelectorAll('.split-line'), s23Cards = s23.querySelectorAll('.list-item');
        const s24CycleCard = s24.querySelector('.cycle-card'), s24ImgCard = s24.querySelector('.img-card'), s24TextBlock = s24.querySelector('.text-block'), s24Lines = s24.querySelectorAll('.split-line'), s24Cards = s24.querySelectorAll('.list-item');

        masterTl.to(s23Full, { scale: 0.8, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s23Lines, { yPercent: -40, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        masterTl.to(s23Cards, { y: -20, opacity: 0, duration: 0.3 * duration, ease: 'power2.in' }, rel(0));
        
        masterTl.to(s24, { yPercent: 0, opacity: 1, duration: 0.1 * duration }, rel(0.1));
        masterTl.fromTo(s24CycleCard, { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0)); // Enter from Left
        masterTl.fromTo(s24ImgCard, { xPercent: 100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.65 * duration, ease: 'power2.inOut' }, rel(0.05)); // Enter from Right
        
        masterTl.fromTo(s24TextBlock, { yPercent: 100, opacity: 0, scale: 0.95 }, { yPercent: 0, opacity: 1, scale: 1, duration: 0.6 * duration, ease: 'power3.out' }, rel(0.25));
        if (s24Lines.length) masterTl.fromTo(s24Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.5));
        if (s24Cards.length) masterTl.fromTo(s24Cards, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.6));
        masterTl.to(s23, { visibility: 'hidden', opacity: 0, duration: 0.1 * duration }, rel(0.95));
        return;
    }

    // CUSTOM TRANSITION: Slide 24 Cycle (i = 23)
    if (i === 23) {
        const s24 = slide, s25 = nextSlide;
        const s24CycleCard = s24.querySelector('.cycle-card'), s24ImgCard = s24.querySelector('.img-card'), s24TextBlock = s24.querySelector('.text-block'), s24Lines = s24.querySelectorAll('.split-line'), s24Cards = s24.querySelectorAll('.list-item');
        const s24CycleItems = s24.querySelectorAll('.cycle-item');
        
        gsap.set(s24CycleItems, { opacity: 0, y: 30, visibility: 'hidden' });
        gsap.set(s24CycleItems[0], { opacity: 1, y: 0, visibility: 'visible' });

        // --- PART 1: Slide 24 internal cycling ---
        const stepCount = s24CycleItems.length;
        const cycleDuration = 0.8; 
        const stepGap = cycleDuration / stepCount;
        
        s24CycleItems.forEach((item, idx) => {
            if (idx === 0) return;
            const prevItem = s24CycleItems[idx - 1];
            const start = idx * stepGap;
            const swapDur = 0.06; // Duration of the swap animation (proportion of duration)
            
            masterTl.to(prevItem, { opacity: 0, y: -30, duration: swapDur * duration }, rel(start));
            masterTl.set(prevItem, { visibility: 'hidden' }, rel(start + swapDur));
            
            masterTl.set(item, { visibility: 'visible' }, rel(start + 0.02));
            masterTl.fromTo(item, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: swapDur * duration }, rel(start + 0.02));
        });

        // --- PART 2: Transition from 24 to 25 ---
        const tStart = 0.85; 
        const tDur = 0.15;

        masterTl.to(s24TextBlock, { scale: 0.7, opacity: 0, duration: 0.5 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s24Lines, { yPercent: -40, opacity: 0, duration: 0.3 * tDur * duration, stagger: 0.01 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s24Cards, { opacity: 0, duration: 0.25 * tDur * duration, ease: 'power2.in' }, rel(tStart));
        masterTl.to(s24CycleCard, { xPercent: -100, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart)); // Exit Left
        masterTl.to(s24ImgCard, { xPercent: 100, duration: 0.65 * tDur * duration, ease: 'power2.inOut' }, rel(tStart + 0.05)); // Exit Right
        
        masterTl.to(s25, { yPercent: 0, opacity: 1, duration: 0.1 * tDur * duration }, rel(tStart + 0.1 * tDur));
        masterTl.fromTo(s25, { yPercent: 100 }, { yPercent: 0, duration: 0.7 * tDur * duration, ease: 'power3.inOut' }, rel(tStart));
        
        const s25TextBlock = s25.querySelector('.text-block'), s25Lines = s25.querySelectorAll('.split-line'), s25Cards = s25.querySelectorAll('.challenge-card');
        if (s25Lines.length) masterTl.fromTo(s25Lines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * tDur * duration, stagger: 0.03 * tDur * duration, ease: 'power3.out' }, rel(tStart + 0.5 * tDur));
        if (s25Cards.length) masterTl.fromTo(s25Cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 * tDur * duration, stagger: 0.04 * tDur * duration, ease: 'power2.out' }, rel(tStart + 0.65 * tDur));
        
        masterTl.to(s24, { visibility: 'hidden', opacity: 0, duration: 0.1 * tDur * duration }, rel(tStart + 0.7 * tDur));

        return;
    }

    // DEFAULT TRANSITION
    const currentContent = slide.querySelector('.content-grid, .full-content'), currentLines = slide.querySelectorAll('.split-line'), currentCards = slide.querySelectorAll('.list-item, .challenge-card, .storyboard-item');
    const nextLines = nextSlide.querySelectorAll('.split-line'), nextCards = nextSlide.querySelectorAll('.list-item, .challenge-card, .storyboard-item'), nextImg = nextSlide.querySelector('.image-container, .image-stack-grid, .img-card'), nextImgInner = nextSlide.querySelectorAll('.image-container img, .img-card img');

    masterTl.to(slide, { scale: 0.88, opacity: 0, duration: 0.5 * duration, ease: 'power2.in' }, rel(0));
    masterTl.to(slide, { visibility: 'hidden', duration: 0.1 * duration }, rel(0.5));
    if (currentContent) masterTl.to(currentContent, { y: -80, duration: 0.4 * duration, ease: 'power2.in' }, rel(0));
    if (currentLines.length) masterTl.to(currentLines, { yPercent: -120, opacity: 0, duration: 0.35 * duration, stagger: 0.02 * duration, ease: 'power2.in' }, rel(0));
    if (currentCards.length) masterTl.to(currentCards, { y: -40, opacity: 0, duration: 0.3 * duration, stagger: 0.02 * duration, ease: 'power2.in' }, rel(0));
    masterTl.fromTo(nextSlide, { yPercent: 100, visibility: 'visible', opacity: 1 }, { yPercent: 0, duration: 0.7 * duration, ease: 'power3.inOut' }, rel(0.15));
    if (nextLines.length) masterTl.fromTo(nextLines, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4 * duration, stagger: 0.03 * duration, ease: 'power3.out' }, rel(0.55));
    if (nextCards.length) masterTl.fromTo(nextCards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 * duration, stagger: 0.04 * duration, ease: 'power2.out' }, rel(0.65));
    if (nextImg) {
        masterTl.fromTo(nextImg, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5 * duration, ease: 'power3.inOut' }, rel(0.45));
        if (nextImgInner.length) masterTl.fromTo(nextImgInner, { scale: 1.3, y: 40 }, { scale: 1, y: 0, duration: 0.6 * duration, ease: 'power2.out' }, rel(0.45));
    }
});

slideIndicator.addEventListener('click', () => {
    const target = prompt(`Enter slide number (1-${totalSlides}):`, '1');
    if (target !== null) {
        const num = parseInt(target, 10);
        if (!isNaN(num) && num >= 1 && num <= totalSlides) {
            const progress = accumulatedTimes[num - 1] / totalDuration;
            lenis.scrollTo(progress * ScrollTrigger.maxScroll(window), { duration: 2, easing: (t) => 1 - Math.pow(1 - t, 4) });
        }
    }
});

const lightbox = document.getElementById('lightbox'), lightboxImg = document.getElementById('lightboxImg'), closeLightboxBtn = document.getElementById('closeLightbox');
document.querySelectorAll('.image-container img, .storyboard-item img').forEach(img => {
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        lenis.stop();
    });
});
const hideLightbox = () => { lightbox.classList.remove('active'); lenis.start(); };
closeLightboxBtn.addEventListener('click', hideLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) hideLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hideLightbox(); });

// ─── Auto Scroll Logic ───
let isAutoScrolling = false;
let currentSpeedMultiplier = 3;
let lastTickTime = performance.now();

const autoScrollToggle = document.getElementById('autoScrollToggle');
const speedBtns = document.querySelectorAll('.speed-btn');

function updateAutoScrollUI() {
    if (isAutoScrolling) {
        autoScrollToggle.classList.add('playing');
    } else {
        autoScrollToggle.classList.remove('playing');
    }
}

function setAutoScrollSpeed(speed) {
    currentSpeedMultiplier = parseFloat(speed);
    speedBtns.forEach(btn => {
        if (btn.dataset.speed === speed) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function autoScrollTick(currentTime) {
    if (!isAutoScrolling) {
        lastTickTime = currentTime;
        return;
    }

    const deltaTime = currentTime - lastTickTime;
    lastTickTime = currentTime;

    // Base speed: 60 pixels per second at 1x multiplier
    const baseSpeed = 60; 
    const scrollAmount = (baseSpeed * currentSpeedMultiplier * deltaTime) / 1000;

    if (scrollAmount > 0) {
        // We use window.scrollBy because Lenis listens to native scroll events.
        // If we use lenis.scrollTo here, it might fight with itself or feel jittery in a loop.
        window.scrollBy(0, scrollAmount);
    }

    if (isAutoScrolling) {
        requestAnimationFrame(autoScrollTick);
    }
}

autoScrollToggle.addEventListener('click', () => {
    isAutoScrolling = !isAutoScrolling;
    updateAutoScrollUI();
    if (isAutoScrolling) {
        lastTickTime = performance.now();
        requestAnimationFrame(autoScrollTick);
    }
});

speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setAutoScrollSpeed(btn.dataset.speed);
    });
});

// Keyboard shortcut: 'P' to toggle auto-scroll
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'p') {
        autoScrollToggle.click();
    }
});
