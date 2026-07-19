const quizState = {
    currentStep: 1,
    answers: {
        ageRange: '',
        calistheniaExperience: '',
        mainGoal: '',
        additionalGoals: [],
        bodyZones: [],
        targetZones: [],
        bodyType: '',
        dreamBody: '',
        fitnessHistory: '',
        limitations: [],
        comfortLevel: '',
        height: 160,
        heightUnit: 'cm',
        currentWeight: 70,
        currentWeightUnit: 'kg',
        targetWeight: 60,
        targetWeightUnit: 'kg',
        exactAge: 30,
        lifestyle: '',
        energyLevel: '',
        waterIntake: '',
        sleepDuration: '',
        mealPreferences: [],
        habits: [],
        lifeEvents: [],
        motivationReal: '',
        commitmentLevel: '',
        email: ''
    }
};

const STEPS = 24;
let offerTimer = null;

window.toggleFaq = function(id) {
    const element = document.getElementById('faq-' + id);
    if (!element) return;
    const isHidden = element.style.display === 'none';
    element.style.display = isHidden ? 'block' : 'none';
    const icon = document.getElementById('faq-icon-' + id);
    if (icon) {
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
};

// Save UTM parameters
function saveUTM() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.toString()) {
        localStorage.setItem("utm_querystring", urlParams.toString());
    }
}

function getUTM() {
    return localStorage.getItem("utm_querystring") || "";
}

function updateURLHash(step) {
    try {
        history.pushState(null, null, `#step-${step}`);
    } catch (e) {
        window.location.hash = `step-${step}`;
    }
}

window.addEventListener('popstate', (e) => {
    const hash = window.location.hash;
    const match = hash.match(/#step-(\d+)/);
    if (match) {
        const step = parseInt(match[1]);
        if (step > 0 && step <= STEPS) {
            quizState.currentStep = step;
            renderStep(step);
        }
    }
});

function calculateBMI() {
    let weight = quizState.answers.currentWeight;
    let height = quizState.answers.height / 100;
    
    if (quizState.answers.currentWeightUnit === 'lb') {
        weight = weight * 0.453592;
    }
    if (quizState.answers.heightUnit === 'pol') {
        height = quizState.answers.height * 0.0254;
    }
    
    return (weight / (height * height)).toFixed(1);
}

function nextStep() {
    if (quizState.currentStep < STEPS) {
        quizState.currentStep++;
        updateURLHash(quizState.currentStep);
        renderStep(quizState.currentStep);
    }
}

function prevStep() {
    if (quizState.currentStep > 1 && quizState.currentStep < STEPS) {
        quizState.currentStep--;
        updateURLHash(quizState.currentStep);
        renderStep(quizState.currentStep);
    }
}

function setAnswer(field, value, isMulti = false, toggleValue = null) {
    if (isMulti) {
        if (!quizState.answers[field]) quizState.answers[field] = [];
        
        if (toggleValue) {
            if (toggleValue === 'Nenhum deles' || toggleValue === 'Nenhuma das opções acima' || toggleValue === 'Nenhuma das acima') {
                quizState.answers[field] = [toggleValue];
            } else {
                quizState.answers[field] = quizState.answers[field].filter(v => v !== 'Nenhum deles' && v !== 'Nenhuma das opções acima' && v !== 'Nenhuma das acima');
                
                const index = quizState.answers[field].indexOf(toggleValue);
                if (index > -1) {
                    quizState.answers[field].splice(index, 1);
                } else {
                    quizState.answers[field].push(toggleValue);
                }
            }
        }
    } else {
        quizState.answers[field] = value;
        nextStep(); // Auto-advance for single choice
    }
}

function renderStep(stepNumber) {
    const container = document.getElementById('step-container');
    const progressBar = document.getElementById('progress-bar');
    const backBtn = document.getElementById('back-btn');
    
    if (!container) return;

    // Fade out
    container.style.opacity = 0;
    
    setTimeout(() => {
        container.innerHTML = '';
        
        // Hide/Show Header (hide on loader/sales page steps >= 32)
        const headerElement = document.getElementById('quizHeader');
        if (headerElement) {
            headerElement.style.display = stepNumber >= 20 ? 'none' : 'flex';
        }
        const progressContainer = document.getElementById('progressBarContainer');
        if (progressContainer) {
            progressContainer.style.display = stepNumber === 1 ? 'none' : 'block';
        }

        // Update Progress Bar width
        if (progressBar) {
            const progress = (stepNumber / STEPS) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.style.display = stepNumber >= 20 ? 'none' : 'block';
        }

        // Back button visibility
        if (backBtn) {
            const hideBackOn = [1, 20, 22, 23, 24];
            backBtn.style.display = hideBackOn.includes(stepNumber) ? 'none' : 'block';
        }

        let html = '';

        switch (stepNumber) {
            case 1:
                html = `
                    <div class="step-content" style="max-width: 100%; position: relative; min-height: 480px; display: flex; flex-direction: column; justify-content: flex-start; text-align: center; padding-top: 15px; overflow: visible;">
                        <!-- Centered Header elements -->
                        <h1 style="font-family: 'Poppins', sans-serif; font-size: 2.1rem; font-weight: 800; line-height: 1.15; color: #1e293b; margin: 0 0 5px; letter-spacing: -0.5px; text-align: center; width: 100%;">
                            Programa de Calistenia<br>Asiática <span style="color: #d64d7a;">para Mulheres</span>
                        </h1>
                        <p style="font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; margin-bottom: 25px; text-transform: uppercase; text-align: center; font-family: 'Poppins', sans-serif; width: 100%;">
                            TESTE DE 1 MINUTO
                        </p>
                        
                        <h2 style="font-size: 16px; font-weight: 800; color: #0f172a; margin-bottom: 25px; font-family: 'Poppins', sans-serif; text-align: center; width: 100%;">
                            Quantos anos você tem?
                        </h2>
                        
                        <!-- Split content area below headings -->
                        <div style="position: relative; width: 100%; min-height: 320px; overflow: visible; display: flex; align-items: flex-end; justify-content: flex-start;">
                            <!-- Left side: Options -->
                            <div class="options-list" style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 240px; z-index: 2; position: relative;">
                                ${['23 – 29', '29 – 39', '39 – 45', '46 – 50', '51 – 60', '60+'].map(opt => `
                                    <button class="option-btn" onclick="setAnswer('ageRange', '${opt}')" style="display: flex; justify-content: space-between; align-items: center; width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 18px; font-size: 14px; font-weight: 700; color: #1e293b; text-align: left; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02); font-family: 'Poppins', sans-serif;">
                                        <span>${opt}</span>
                                        <span style="color: #94a3b8; font-size: 14px; font-weight: bold;">→</span>
                                    </button>
                                `).join('')}
                            </div>
                            
                            <!-- Right side: Trainer Image Background (Absolute positioned, larger width) -->
                            <div style="position: absolute; right: -130px; bottom: -20px; width: 400px; height: 100%; pointer-events: none; z-index: 1; display: flex; align-items: flex-end; justify-content: flex-end; overflow: visible;">
                                <img src="assets/treinadora-fundo.png" alt="Calistenia Trainer" style="width: 100%; max-height: 600px; object-fit: contain; object-position: bottom right; mask-image: linear-gradient(to top, transparent 0%, black 15%); -webkit-mask-image: linear-gradient(to top, transparent 0%, black 15%);" />
                            </div>
                        </div>
                    </div>`;
                break;
            case 2:
                html = `
                    <div class="splash-screen" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <h2 style="font-family: 'Poppins', sans-serif; font-size: 1.5rem; font-weight: 800; color: #1e293b; line-height: 1.3; margin-bottom: 8px;">Elas conseguiram e você também pode</h2>
                        <p style="font-size: 13.5px; color: #64748b; margin-bottom: 15px; font-family: 'Poppins', sans-serif;">Mais de 27 milhões de mulheres já transformaram suas vidas com a Calistenia Asiática</p>
                        
                        <!-- 1080x1080 Square Image -->
                        <div style="width: 100%; max-width: 380px; aspect-ratio: 1 / 1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;">
                            <img src="assets/hero-bg.jpg" alt="Transformação" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        
                        <button class="primary-btn" onclick="nextStep()" style="width: 100%; max-width: 320px;">Continuar</button>
                    </div>`;
                break;
            case 3:
                html = `
                    <div class="step-content" style="max-width: 100%; position: relative; min-height: 480px; display: flex; flex-direction: column; justify-content: flex-start; text-align: left; padding-top: 15px; overflow: visible;">
                        <!-- Centered Heading at the top -->
                        <h2 style="font-family: 'Poppins', sans-serif; font-size: 1.45rem; font-weight: 800; color: #1e293b; line-height: 1.3; margin-bottom: 30px; text-align: center; width: 100%;">
                            Você já experimentou exercícios de calistenia?
                        </h2>
                        
                        <!-- Content Area -->
                        <div style="z-index: 2; position: relative; width: 100%; padding-right: 150px; box-sizing: border-box;">
                            <div class="options-list" style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 240px;">
                                <button class="option-btn" onclick="setAnswer('calistheniaExperience', 'sim')" style="display: block; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px 24px; font-size: 15px; font-weight: 700; color: #1e293b; text-align: left; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.03); font-family: 'Poppins', sans-serif;">
                                    Sim
                                </button>
                                <button class="option-btn" onclick="setAnswer('calistheniaExperience', 'nao')" style="display: block; width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 22px 24px; font-size: 15px; font-weight: 700; color: #1e293b; text-align: left; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.03); font-family: 'Poppins', sans-serif;">
                                    Não
                                </button>
                            </div>
                        </div>
                        
                        <!-- Trainer Image Background -->
                        <div style="position: absolute; right: -50px; bottom: -20px; width: 380px; height: calc(100% - 60px); pointer-events: none; z-index: 1; display: flex; align-items: flex-end; justify-content: flex-end; overflow: visible;">
                            <img src="assets/modelo-calistenia.png" alt="Calistenia Trainer" style="width: 100%; max-height: 570px; object-fit: contain; object-position: bottom right; mask-image: linear-gradient(to top, transparent 0%, black 15%); -webkit-mask-image: linear-gradient(to top, transparent 0%, black 15%);" />
                        </div>
                    </div>`;
                break;
            case 4:
                const isSim = quizState.answers.calistheniaExperience === 'sim';
                const heading4 = isSim 
                    ? "Você já tem a base, mas a Calistenia Asiática é diferente da calistenia comum."
                    : "Não se preocupe, a Calistenia Asiática é perfeita para quem está começando do zero!";
                const text4 = isSim
                    ? "Enquanto o método tradicional foca apenas em força externa, nossa técnica ativa as fibras profundas, agindo na musculatura interna, onde eliminamos a gordura mais difícil de queimar e destravamos o seu metabolismo de forma definitiva."
                    : "Calistenia significa usar apenas o peso do seu corpo, e nossa técnica simplifica tudo ao focar na ativação das fibras profundas. É o caminho mais rápido para você destravar o metabolismo e secar a barriga sem o esforço exaustivo da academia.";
                
                html = `
                    <div class="splash-screen conditional-splash" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <h2 style="font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 800; color: #1e293b; line-height: 1.3; margin-bottom: 8px;">${heading4}</h2>
                        <p style="font-size: 13.5px; color: #64748b; margin-bottom: 15px; font-family: 'Poppins', sans-serif; line-height: 1.4;">${text4}</p>
                        
                        <!-- Couch Exercise Image -->
                        <div style="width: 100%; max-width: 380px; aspect-ratio: 1 / 1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;">
                            <img src="assets/exercicio-sofa.jpg" alt="Exercício Calistenia" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        
                        <button class="primary-btn" onclick="nextStep()" style="width: 100%; max-width: 320px;">Continuar</button>
                    </div>`;
                break;
            case 5:
                const goals = [
                    { t: 'Perder peso', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m8 3 4 2 4-2"/><path d="M12 5v13"/><path d="M5 22h14"/><path d="M19 16c0-1.7-1.3-3-3-3H8c-1.7 0-3 1.3-3 3Z"/></svg>` },
                    { t: 'Desenvolver músculos', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>` },
                    { t: 'Manter o peso e ficar em forma', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>` },
                    { t: 'Melhorar a aptidão física', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>` }
                ];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-goals.jpg" alt="Objetivo" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Qual é seu principal objetivo?</h2>
                        <div class="options-list icon-list">
                            ${goals.map(opt => 
                                `<button class="option-btn" onclick="setAnswer('mainGoal', '${opt.t}')"><span class="icon" style="display:inline-block; vertical-align:middle; margin-right:8px; width:20px; height:20px; color:#d64d7a;">${opt.i}</span> ${opt.t}</button>`
                            ).join('')}
                        </div>
                    </div>`;
                break;

            case 6:
                const targetIcons = {
                    'Barriga': '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fce4ec"/><path d="M14 14c0 0 1-2 6-2s6 2 6 2v8c0 4-2.5 7-6 7s-6-3-6-7z" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/><path d="M17 19c0 0 1.5 2 3 2s3-2 3-2" fill="none" stroke="#c48b76" stroke-width="0.6"/><line x1="20" y1="14" x2="20" y2="22" stroke="#c48b76" stroke-width="0.5"/></svg>',
                    'Bunda': '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fce4ec"/><path d="M13 15c0 0 0 12 7 12s7-12 7-12" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/><path d="M20 15c0 0 0 12 7 12" fill="none" stroke="#c48b76" stroke-width="0.6"/><path d="M20 15c0 0 0 12-7 12" fill="none" stroke="#c48b76" stroke-width="0.6"/></svg>',
                    'Pernas': '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fce4ec"/><path d="M15 10v18c0 1 0 2 1 2h2v-2l2-8v10h2v-10l2 8v2h2c1 0 1-1 1-2V10" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/></svg>',
                    'Peito': '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fce4ec"/><ellipse cx="16" cy="20" rx="4.5" ry="3.5" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/><ellipse cx="24" cy="20" rx="4.5" ry="3.5" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/><path d="M12 16c2-3 6-4 8-4s6 1 8 4" fill="none" stroke="#c48b76" stroke-width="0.7"/></svg>',
                    'Braços': '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fce4ec"/><path d="M14 12c0 0-2 6-2 10s1 6 3 6c1.5 0 2-1.5 2-3v-5l3 5c1 2 3 3 4.5 3s3-2 3-6c0-4-2-10-2-10" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/></svg>',
                    'Costas': '<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#fce4ec"/><path d="M14 12h12v16c0 0-2 2-6 2s-6-2-6-2z" fill="#d4a08a" stroke="#c48b76" stroke-width="0.8"/><line x1="20" y1="12" x2="20" y2="28" stroke="#c48b76" stroke-width="0.6"/><path d="M15 16h10M15 20h10M16 24h8" fill="none" stroke="#c48b76" stroke-width="0.4" opacity="0.5"/></svg>'
                };
                const targets = ['Barriga', 'Bunda', 'Pernas', 'Peito', 'Braços', 'Costas'];
                html = `
                    <div class="step-content">
                        <h2 class="question">Quais são as suas zonas alvo?</h2>
                        <p class="description">Escolha todas as opções aplicáveis</p>
                        <div class="options-list multi-select">
                            ${targets.map(opt => {
                                const selected = quizState.answers.targetZones.includes(opt) ? 'selected' : '';
                                return `<button class="option-btn ${selected}" onclick="toggleMulti('targetZones', '${opt}', this)" style="display: flex; align-items: center; gap: 14px; padding: 14px 18px;">
                                    <span style="flex-shrink: 0; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">${targetIcons[opt]}</span>
                                    <span style="font-weight: 700; font-size: 15px;">${opt}</span>
                                </button>`
                            }).join('')}
                        </div>
                        <button class="primary-btn mt-4" onclick="nextStep()">Próximo passo</button>
                    </div>`;
                break;
            case 7:
                html = `
                    <div class="splash-screen edu-splash" style="text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <h2 style="font-family: 'Poppins', sans-serif; font-size: 1.4rem; font-weight: 800; color: #1e293b; line-height: 1.35; margin-bottom: 8px;">
                            Apenas 7 minutos por dia — transformarão seu corpo e <span style="color: #d64d7a;">destravarão o seu metabolismo</span> sem o esforço exaustivo da academia!
                        </h2>
                        <p style="font-size: 13.5px; color: #64748b; margin-bottom: 15px; font-family: 'Poppins', sans-serif; line-height: 1.45;">
                            O Protocolo de Calistenia Asiática utiliza ativações de fibras profundas para derreter a gordura acumulada e chapar a barriga, agindo onde os exercícios comuns de academia não conseguem chegar, de forma simples e definitiva...
                        </p>
                        
                        <!-- Trainer OK Image -->
                        <div style="width: 100%; max-width: 380px; aspect-ratio: 1 / 1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); margin-bottom: 20px;">
                            <img src="assets/ok-treinadora.jpg" alt="Treinadora Calistenia" style="width: 100%; height: 100%; object-fit: cover;" />
                        </div>
                        
                        <button class="primary-btn" onclick="nextStep()" style="width: 100%; max-width: 320px;">Continuar</button>
                    </div>`;
                break;
            case 8:
                const bTypes = ['Magra', 'Falsa Magra', 'Acima do peso', 'Sobrepeso'];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-bodytype.jpg" alt="Tipo de corpo" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Como você descreveria o seu corpo atualmente?</h2>
                        <div class="options-list">
                            ${bTypes.map(opt => `<button class="option-btn" onclick="setAnswer('bodyType', '${opt}')">${opt}</button>`).join('')}
                        </div>
                    </div>`;
                break;

            case 9:
                const limits = ['Costas sensíveis', 'Joelhos sensíveis', 'Quadril sensível', 'Ombros e braços', 'Panturrilhas e tornozelos', 'Nenhuma das opções acima'];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-limitations.jpg" alt="Limitações" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Você tem dificuldades com algum dos seguintes itens?</h2>
                        <p class="description">Por favor, selecione todas as opções aplicáveis</p>
                        <div class="options-list multi-select">
                            ${limits.map(opt => {
                                const selected = quizState.answers.limitations.includes(opt) ? 'selected' : '';
                                return `<button class="option-btn ${selected}" onclick="toggleMulti('limitations', '${opt}', this)">${opt}</button>`
                            }).join('')}
                        </div>
                        <button class="primary-btn mt-4" onclick="nextStep()">Próximo passo</button>
                    </div>`;
                break;
            case 10:
                const comforts = [
                    { t: 'Sinto dor/Desconforto', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`, v: 'dor' },
                    { t: 'Sinto alguma dificuldade', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" x2="16" y1="15" y2="15"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`, v: 'dificuldade' },
                    { t: 'Sinto-me confortável', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>`, v: 'confortavel' }
                ];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-comfort.jpg" alt="Conforto" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Você se sente confortável ao se exercitar?</h2>
                        <div class="options-list">
                            ${comforts.map(opt => `<button class="option-btn" onclick="setAnswer('comfortLevel', '${opt.v}')"><span class="icon" style="display:inline-block; vertical-align:middle; margin-right:8px; width:20px; height:20px; color:#d64d7a;">${opt.i}</span> ${opt.t}</button>`).join('')}
                        </div>
                    </div>`;
                break;
            case 11:
                const isBad = quizState.answers.comfortLevel === 'dor' || quizState.answers.comfortLevel === 'dificuldade';
                const h15 = isBad ? "Nós cuidamos de você!" : "Isso é ótimo!";
                const t15 = isBad 
                    ? "A dor não vai te impedir. Adaptaremos seu programa para promover movimentos seguros e suaves."
                    : "Você está pronta para seguir em frente - prepare-se para a transformação com a Calistenia Asiática.";
                html = `
                    <div class="splash-screen" style="text-align: center; display: flex; flex-direction: column; align-items: center; padding-top: 10px;">
                        <!-- Rounded Card Image -->
                        <div style="width: 100%; max-width: 380px; aspect-ratio: 1.3 / 1; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.06); margin-bottom: 20px;">
                            <img src="assets/treinadora-joinha.jpg" alt="Treinadora Calistenia" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
                        </div>
                        
                        <h2 style="font-family: 'Poppins', sans-serif; font-size: 1.55rem; font-weight: 800; color: #1e293b; margin-bottom: 12px; text-align: center; width: 100%;">
                            ${h15}
                        </h2>
                        
                        <p style="font-size: 13.5px; color: #64748b; line-height: 1.5; margin-bottom: 25px; text-align: center; max-width: 340px; margin-left: auto; margin-right: auto; font-family: 'Poppins', sans-serif;">
                            ${t15}
                        </p>
                        
                        <button class="primary-btn" onclick="nextStep()" style="width: 100%; max-width: 320px; margin: 0 auto; display: block;">
                            Continuar
                        </button>
                    </div>`;
                break;
            case 12: // Height
                html = `
                    <div class="step-content picker-step">
                        <h2 class="question">Qual a sua altura?</h2>
                        <div class="unit-toggle">
                            <span class="${quizState.answers.heightUnit === 'cm' ? 'active' : ''}" onclick="toggleUnit('height', 'cm')">cm</span>
                            <span class="${quizState.answers.heightUnit === 'pol' ? 'active' : ''}" onclick="toggleUnit('height', 'pol')">in</span>
                        </div>
                        <div class="value-display"><span id="height-val">${quizState.answers.height}</span> ${quizState.answers.heightUnit}</div>
                        <input type="range" class="custom-range" min="120" max="220" value="${quizState.answers.height}" oninput="updateSlider('height', this.value)">
                        <button class="primary-btn mt-4" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;
            case 13: // Current Weight
                html = `
                    <div class="step-content picker-step">
                        <h2 class="question">Qual o seu peso atual?</h2>
                        <div class="unit-toggle">
                            <span class="${quizState.answers.currentWeightUnit === 'kg' ? 'active' : ''}" onclick="toggleUnit('currentWeight', 'kg')">kg</span>
                            <span class="${quizState.answers.currentWeightUnit === 'lb' ? 'active' : ''}" onclick="toggleUnit('currentWeight', 'lb')">lb</span>
                        </div>
                        <div class="value-display"><span id="currentWeight-val">${quizState.answers.currentWeight}</span> ${quizState.answers.currentWeightUnit}</div>
                        <input type="range" class="custom-range" min="30" max="200" value="${quizState.answers.currentWeight}" oninput="updateSlider('currentWeight', this.value)">
                        <button class="primary-btn mt-4" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;
            case 14: // Target Weight
                html = `
                    <div class="step-content picker-step">
                        <h2 class="question">Qual o seu peso alvo?</h2>
                        <div class="unit-toggle">
                            <span class="${quizState.answers.targetWeightUnit === 'kg' ? 'active' : ''}" onclick="toggleUnit('targetWeight', 'kg')">kg</span>
                            <span class="${quizState.answers.targetWeightUnit === 'lb' ? 'active' : ''}" onclick="toggleUnit('targetWeight', 'lb')">lb</span>
                        </div>
                        <div class="value-display"><span id="targetWeight-val">${quizState.answers.targetWeight}</span> ${quizState.answers.targetWeightUnit}</div>
                        <input type="range" class="custom-range" min="30" max="200" value="${quizState.answers.targetWeight}" oninput="updateSlider('targetWeight', this.value)">
                        <button class="primary-btn mt-4" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;

            case 15: // Lifestyle
                const lifestyles = [
                    { t: 'Sedentário', d: 'Eu passo a maior parte do dia sentado', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 20v-2"/></svg>` },
                    { t: 'Atividade moderada', d: 'Eu faço pausas ativas', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 5.88 9.85 6 7.07l.02-1.22C6.04 4.85 7.25 4 8.5 4s2.46.85 2.48 1.85l.02 1.22c.12 2.78 2 4.43 2 6.55V16"/><path d="M15 16h6M3 16h6"/></svg>` },
                    { t: 'Eu sou imparável', d: 'Estou de pé o dia todo', i: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="15" cy="5" r="1"/><path d="m12 18-3.5-5 3.5-3.5-1-1.5L6 12v6"/><path d="m19 19-3-6-1.5-2.5"/></svg>` }
                ];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-lifestyle.jpg" alt="Estilo de vida" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Como você descreveria seu dia típico?</h2>
                        <div class="options-list">
                            ${lifestyles.map(opt => `
                                <button class="option-btn" onclick="setAnswer('lifestyle', '${opt.t}')" style="display: flex; align-items: center; gap: 14px; padding: 16px 18px; text-align: left;">
                                    <span style="flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; background: #fce4ec; display: flex; align-items: center; justify-content: center; color: #d64d7a;">${opt.i}</span>
                                    <div style="display: flex; flex-direction: column; gap: 2px;">
                                        <span style="font-weight: 700; font-size: 15px; color: #1e293b;">${opt.t}</span>
                                        <span style="font-size: 12.5px; color: #94a3b8; font-weight: 400;">${opt.d}</span>
                                    </div>
                                </button>
                            `).join('')}
                        </div>
                    </div>`;
                break;

            case 16: // Sleep
                const sleep = ['Menos de 5 horas', '5-6 horas', '7-8 horas', 'Mais de 8 horas'];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-sleep.jpg" alt="Sono" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Quantas horas você costuma dormir?</h2>
                        <div class="options-list">
                            ${sleep.map(opt => `<button class="option-btn" onclick="setAnswer('sleepDuration', '${opt}')">${opt}</button>`).join('')}
                        </div>
                    </div>`;
                break;
            case 17: // Meal Pref
                const meals = [
                    { t: 'Eu sou vegetariana', d: 'Verduras, grãos, mas sem carne animal' },
                    { t: 'Eu sou vegana', d: 'Puramente à base de plantas...' },
                    { t: 'Não contém glúten', d: 'Exclua produtos de grãos...' },
                    { t: 'Sem lactose', d: 'Excluir produtos lácteos' },
                    { t: 'Sem restrições', d: 'Aberto a todos os alimentos' }
                ];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-meals.jpg" alt="Alimentação" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Quais são suas preferências de refeição?</h2>
                        <div class="options-list multi-select">
                            ${meals.map(opt => {
                                const selected = quizState.answers.mealPreferences.includes(opt.t) ? 'selected' : '';
                                return `
                                <button class="option-btn ${selected}" onclick="toggleMulti('mealPreferences', '${opt.t}', this)" style="display: flex; flex-direction: column; align-items: flex-start; gap: 4px; padding: 16px 18px; text-align: left;">
                                    <span style="font-weight: 700; font-size: 15px; color: #1e293b;">${opt.t}</span>
                                    <span style="font-size: 12.5px; color: #94a3b8; font-weight: 400;">${opt.d}</span>
                                </button>
                                `
                            }).join('')}
                        </div>
                        <button class="primary-btn mt-4" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;

            case 18: // Life Events
                const events = ['Casamento ou relacionamento', 'Gravidez', 'Trabalho agitado ou vida familiar', 'Estresse ou saúde mental', 'Medicamento ou distúrbio hormonal', 'Nenhuma das acima'];
                html = `
                    <div class="step-content">
                        <div style="width: 100%; max-width: 120px; margin: 0 auto 16px auto; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                            <img src="assets/step-wellness.jpg" alt="Eventos de vida" style="width: 100%; height: auto; display: block;" />
                        </div>
                        <h2 class="question">Algum dos eventos abaixo te levou a ganhar peso nos últimos anos?</h2>
                        <div class="options-list multi-select">
                            ${events.map(opt => {
                                const selected = quizState.answers.lifeEvents.includes(opt) ? 'selected' : '';
                                return `<button class="option-btn ${selected}" onclick="toggleMulti('lifeEvents', '${opt}', this)">${opt}</button>`
                            }).join('')}
                        </div>
                        <button class="primary-btn mt-4" onclick="nextStep()">Próximo passo</button>
                    </div>`;
                break;

            case 19: // Weight Curve SVG
                html = `
                    <div class="splash-screen chart-screen">
                        <h2>É assim que a transformação da sua vida se parece</h2>
                        <div class="svg-container" style="background:#f4f4f4; border-radius:10px; padding:20px; margin:20px 0;">
                            <svg viewBox="0 0 100 50" width="100%" height="200px">
                                <path d="M0,40 Q25,10 50,20 T100,5" fill="none" stroke="#e01a4f" stroke-width="2" />
                                <circle cx="0" cy="40" r="2" fill="#e01a4f"/>
                                <circle cx="100" cy="5" r="2" fill="#e01a4f"/>
                                <text x="0" y="48" font-size="4">Hoje</text>
                                <text x="80" y="12" font-size="4">Objetivo</text>
                            </svg>
                        </div>
                        <button class="primary-btn mt-4" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;
            case 20: // Loading
                html = `
                    <div class="loading-screen">
                        <h2>Criando seu plano personalizado</h2>
                        <div class="loader-bar-bg mt-4" style="background:#ddd; height:20px; border-radius:10px; overflow:hidden;">
                            <div id="inner-loader" style="width:0%; background:#e01a4f; height:100%; transition: width 0.1s linear;"></div>
                        </div>
                        <p id="loader-msg" class="mt-3">Analisando suas respostas...</p>
                    </div>`;
                break;
            case 21: // Final Weight Projection SVG
                html = `
                    <div class="splash-screen chart-screen">
                        <h2>O último plano que você precisará</h2>
                        <p>Projeção de perda de peso de ${quizState.answers.currentWeight}${quizState.answers.currentWeightUnit} para ${quizState.answers.targetWeight}${quizState.answers.targetWeightUnit}</p>
                        <div class="svg-container" style="background:#f4f4f4; border-radius:10px; padding:20px; margin:20px 0;">
                            <svg viewBox="0 0 100 50" width="100%" height="200px">
                                <path d="M0,5 L100,45" fill="none" stroke="#28a745" stroke-width="2" stroke-dasharray="4" />
                            </svg>
                        </div>
                        <button class="primary-btn mt-4" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;
            case 22: // Profile Ready BMI
                const bmi = calculateBMI();
                const bmiPercent = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);
                
                let bmiCategory = "";
                let bmiColor = "";
                let warningTitle = "";
                let warningDesc = "";
                
                if (bmi < 18.5) {
                    bmiCategory = "ABAIXO DO PESO";
                    bmiColor = "#60a5fa";
                    warningTitle = "Alerta de Fragilidade Metabólica:";
                    warningDesc = "Embora seu peso seja baixo, seu metabolismo está desequilibrado. A falta de estímulo nas fibras profundas causa perda de tônus e fragilidade interna. O Protocolo Asiático é essencial para fortalecer sua base e garantir um corpo firme, saudável e funcional.";
                } else if (bmi < 25) {
                    bmiCategory = "NORMAL";
                    bmiColor = "#22c55e";
                    warningTitle = "Alerta de Estagnação:";
                    warningDesc = 'Cuidado com o efeito "falsa magra". Seu peso está normal, mas seu metabolismo está estagnado. Sem a ativação das fibras profundas, o corpo acumula gordura visceral e perde a definição. Você precisa destravar sua queima natural agora para evitar a flacidez e o envelhecimento metabólico.';
                } else if (bmi < 30) {
                    bmiCategory = "SOBREPESO";
                    bmiColor = "#facc15";
                    warningTitle = "Alerta de Bloqueio:";
                    warningDesc = "Seu metabolismo entrou em modo de resistência. O excesso de peso está sobrecarregando suas articulações e travando sua energia diária. O segredo para voltar a secar é a ativação rítmica das fibras profundas, que derrete a gordura mais difícil sem o esforço exaustivo da academia.";
                } else {
                    bmiCategory = "OBESO";
                    bmiColor = "#ef4444";
                    warningTitle = "Alerta de Risco Urgente:";
                    warningDesc = 'Seu metabolismo está em "modo de sobrevivência", travando a queima e gerando inflamação. Isso causa fadiga crônica e riscos sérios à sua saúde. A Calistenia Asiática é a única via segura para destravar seu sistema e eliminar gordura de forma rápida, sem impacto e sem exaustão.';
                }

                html = `
                    <div class="step-content bmi-step">
                        <h2 class="step-title">Seu perfil está pronto</h2>
                        
                        <!-- BMI Card -->
                        <div class="bmi-card" style="background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); margin-bottom:15px; border:1px solid #eee;">
                            <p style="font-size:0.875rem; font-weight:600; color:#555; margin-bottom:25px; text-align:left;">Índice de Massa Corporal (IMC)</p>
                            
                            <div style="position:relative; margin-bottom:15px;">
                                <div style="position:absolute; top:-25px; left:${bmiPercent}%; transform:translateX(-50%); background:#1e293b; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px; font-weight:700; white-space:nowrap; z-index:10;">
                                    Você - ${bmi}
                                    <div style="position:absolute; top:100%; left:50%; transform:translateX(-50%); width:0; height:0; border-left:4px solid transparent; border-right:4px solid transparent; border-top:4px solid #1e293b;"></div>
                                </div>
                            </div>
                            
                            <div style="display:flex; justify-content:space-between; font-size:10px; color:#999; margin-bottom:4px;">
                                <span>15</span>
                                <span>18.5</span>
                                <span>25</span>
                                <span>30</span>
                                <span>40</span>
                            </div>
                            
                            <div style="position:relative; height:12px; border-radius:6px; background:linear-gradient(to right, #60a5fa 0%, #22c55e 30%, #facc15 50%, #f97316 70%, #ef4444 100%); margin-bottom:8px;">
                                <div style="position:absolute; top:-3px; left:${bmiPercent}%; width:18px; height:18px; background:#fff; border:3px solid #1e293b; border-radius:50%; transform:translateX(-50%); box-shadow:0 2px 4px rgba(0,0,0,0.2);"></div>
                            </div>
                            
                            <div style="display:flex; justify-content:space-between; font-size:9px; font-weight:700; color:#999;">
                                <span style="${bmi < 18.5 ? 'color:#60a5fa;' : ''}">ABAIXO</span>
                                <span style="${bmi >= 18.5 && bmi < 25 ? 'color:#22c55e;' : ''}">NORMAL</span>
                                <span style="${bmi >= 25 && bmi < 30 ? 'color:#facc15;' : ''}">SOBREPESO</span>
                                <span style="${bmi >= 30 ? 'color:#ef4444;' : ''}">OBESO</span>
                            </div>
                        </div>

                        <!-- Warning Box -->
                        <div style="background:#fef2f2; border:1px solid #fee2e2; border-radius:12px; padding:15px; margin-bottom:15px; text-align:left; display:flex; gap:10px; align-items:flex-start;">
                            <span style="display:inline-block; flex-shrink:0; width:18px; height:18px; color:#ef4444; margin-top:2px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                            </span>
                            <div>
                                <p style="font-size:13px; font-weight:700; color:#991b1b; margin-bottom:4px;">${warningTitle}</p>
                                <p style="font-size:12px; color:#b91c1c; line-height:1.4; margin:0;">${warningDesc}</p>
                            </div>
                        </div>

                        <!-- Summary rows -->
                        <div style="background:#fff; border-radius:12px; padding:15px; border:1px solid #eee; margin-bottom:20px; text-align:left;">
                            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid #f3f4f6; margin-bottom:8px; font-size:13px;">
                                <span style="color:#777;">Estilo de vida</span>
                                <span style="font-weight:700; color:#1e293b;">${quizState.answers.lifestyle || 'Sedentário'}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; padding-bottom:8px; border-bottom:1px solid #f3f4f6; margin-bottom:8px; font-size:13px;">
                                <span style="color:#777;">Nível de condicionamento</span>
                                <span style="font-weight:700; color:#1e293b;">Iniciante</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:13px;">
                                <span style="color:#777;">Metabolismo</span>
                                <span style="font-weight:700; color:#1e293b;">${bmiCategory}</span>
                            </div>
                        </div>

                        <button class="primary-btn" onclick="nextStep()">Continuar</button>
                    </div>`;
                break;
            case 23: // Summary / Plan Summary
                let protocolFocus = "Transformação estética e saúde metabólica.";
                if (quizState.answers.mainGoal === 'Perder peso') {
                    protocolFocus = "Queima acelerada e ativação de fibras profundas.";
                } else if (quizState.answers.mainGoal === 'Desenvolver músculos') {
                    protocolFocus = "Tônus muscular e fortalecimento articular.";
                } else if (quizState.answers.mainGoal === 'Manter o peso e ficar em forma') {
                    protocolFocus = "Manutenção e ganho de mobilidade.";
                }

                html = `
                    <div class="step-content summary-step">
                        <h2 class="step-title">Seu plano de Calistenia está pronto!</h2>
                        
                        <div class="summary-card" style="background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); margin-bottom:15px; border:1px solid #eee; text-align:left;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:15px; text-align:center;">
                                <div style="flex:1;">
                                    <span style="font-size:12px; color:#999; font-weight:600; display:block; margin-bottom:4px;">Agora</span>
                                    <div style="font-size:24px; font-weight:800; color:#e01a4f;">${quizState.answers.currentWeight} ${quizState.answers.currentWeightUnit}</div>
                                    <span style="font-size:11px; color:#e01a4f; background:rgba(224, 26, 79, 0.1); padding:2px 8px; border-radius:12px; font-weight:600;">Acima do ideal</span>
                                </div>
                                <div style="display:flex; align-items:center; justify-content:center; padding:0 10px; font-size:24px; color:#ccc;">
                                    ➔
                                </div>
                                <div style="flex:1;">
                                    <span style="font-size:12px; color:#999; font-weight:600; display:block; margin-bottom:4px;">Seu Objetivo</span>
                                    <div style="font-size:24px; font-weight:800; color:#22c55e;">${quizState.answers.targetWeight} ${quizState.answers.targetWeightUnit}</div>
                                    <span style="font-size:11px; color:#22c55e; background:rgba(34, 197, 94, 0.1); padding:2px 8px; border-radius:12px; font-weight:600;">Peso ideal</span>
                                </div>
                            </div>
                            
                            <div style="border-top:1px solid #f3f4f6; padding-top:15px; margin-top:15px;">
                                <div style="margin-bottom:10px; font-size:13px;">
                                    <span style="color:#777; display:block; margin-bottom:2px;">Foco do Protocolo</span>
                                    <span style="font-weight:700; color:#1e293b;">${protocolFocus}</span>
                                </div>
                                <div style="margin-bottom:10px; font-size:13px;">
                                    <span style="color:#777; display:block; margin-bottom:2px;">Rotina Recomendada</span>
                                    <span style="font-weight:700; color:#1e293b;">Apenas 7 minutos por dia</span>
                                </div>
                                <div style="font-size:13px;">
                                    <span style="color:#777; display:block; margin-bottom:2px;">Método</span>
                                    <span style="font-weight:700; color:#1e293b;">Sem impacto - Seguro para articulações</span>
                                </div>
                            </div>
                        </div>

                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:15px; margin-bottom:20px; text-align:left; font-size:13px; color:#166534; font-weight:500; display:flex; gap:10px; align-items:flex-start;">
                            <span style="display:inline-block; flex-shrink:0; width:16px; height:16px; color:#22c55e; margin-top:2px;">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z"/></svg>
                            </span>
                            <span>De acordo com suas respostas, você tem 98% de chance de atingir sua meta seguindo nosso cronograma de 21 dias.</span>
                        </div>

                        <button class="primary-btn" onclick="nextStep()">CONTINUAR PARA O PLANO</button>
                    </div>`;
                break;
            case 24: // Offer VSL
                const utmParams = getUTM();
                const checkoutLink = `https://syncpay.link/RylsMa${utmParams ? '?' + utmParams : ''}`;
                
                const currentDate = new Date().toLocaleDateString('pt-BR');
                const targetDateObj = new Date();
                targetDateObj.setDate(targetDateObj.getDate() + 21);
                const targetDateFormatted = targetDateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });

                html = `
                    <div class="offer-screen" style="padding-top: 10px;">
                        <!-- Sticky Banner Top -->
                        <div id="sticky-countdown-banner" style="display: none; background: #d64d7a; color: white; padding: 10px; font-weight: bold; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; text-align: center; font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); align-items: center; justify-content: center; gap: 6px;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>A oferta especial expira em: <span id="countdown-timer">10:00</span></span>
                        </div>

                        <h2 class="text-center font-bold" style="color: #d64d7a; font-size: 1.6rem; margin-bottom: 5px;">Seu plano de Calistenia Asiática está pronto!</h2>
                        <p class="text-center text-muted-foreground" style="font-size: 13px; margin-bottom: 20px;">Assista ao vídeo abaixo para entender como funciona...</p>
                        
                        <!-- 9:16 Video Player Wrapper -->
                        <div class="vsl-container" style="margin: 20px auto; background: #000; width: 100%; max-width: 320px; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.2); border: 2px solid #e2e8f0;">
                            <div style="position:relative;padding-top:178.21782178217822%;"><iframe id="panda-79ca83eb-0870-49c5-9792-362896cc7d20" src="https://player-vz-b8de2e87-683.tv.pandavideo.com.br/embed/?v=79ca83eb-0870-49c5-9792-362896cc7d20" style="border:none;position:absolute;top:0;left:0;" allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture" allowfullscreen=true width="100%" height="100%" fetchpriority="high"></iframe></div>
                        </div>

                        <!-- Delayed content (checkout details, testimonials, bonuses) -->
                        <div id="delayed-offer" style="display: none; margin-top: 25px;">
                            <!-- Pulse button -->
                            <a href="${checkoutLink}" target="_blank" class="primary-btn" style="background:#22c55e; color:#fff; text-decoration:none; padding:18px 24px; font-weight:bold; font-size:16px; border-radius:12px; display:block; text-align:center; animation:pulse 2s infinite; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(34, 197, 94, 0.4); margin-bottom: 10px;">Obter meu plano personalizado agora</a>
                            
                            <div style="display:flex; align-items:center; justify-content:center; gap:8px; font-weight:600; color:#ea580c; font-size:12px; margin-bottom:25px;">
                                <span class="pulse-dot" style="display:inline-block; width:8px; height:8px; background:#ea580c; border-radius:50%; animation:pulse 1.5s infinite;"></span>
                                Restam apenas <span id="vagas-count">7</span> vagas com desconto especial
                            </div>

                            <!-- O que você vai receber Card -->
                            <div style="background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border:1px solid #eee; margin-bottom:20px; text-align:left;">
                                <h3 style="font-size:14px; font-weight:800; color:#1e293b; text-align:center; margin-bottom:15px; text-transform:uppercase; letter-spacing:0.5px;">O que você vai receber:</h3>
                                <div style="display:flex; flex-direction:column; gap:12px;">
                                    <div style="display:flex; gap:10px; align-items:flex-start;">
                                        <span style="color:#22c55e; display:inline-block; flex-shrink:0; margin-top:2px; width:16px; height:16px;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </span>
                                        <p style="font-size:13px; margin:0;"><strong style="color:#1e293b;">Ativação das Fibras Profundas</strong>: o segredo asiático para destravar o metabolismo e queimar gordura de verdade, sem precisar se matar na academia.</p>
                                    </div>
                                    <div style="display:flex; gap:10px; align-items:flex-start;">
                                        <span style="color:#22c55e; display:inline-block; flex-shrink:0; margin-top:2px; width:16px; height:16px;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </span>
                                        <p style="font-size:13px; margin:0;"><strong style="color:#1e293b;">Cronograma "Barriga Chapada" em 21 Dias</strong>: um passo a passo diário e direto ao ponto para você saber exatamente o que fazer até o dia ${targetDateFormatted}.</p>
                                    </div>
                                    <div style="display:flex; gap:10px; align-items:flex-start;">
                                        <span style="color:#22c55e; display:inline-block; flex-shrink:0; margin-top:2px; width:16px; height:16px;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </span>
                                        <p style="font-size:13px; margin:0;"><strong style="color:#1e293b;">Guia de Alimentação Metabólica</strong>: receitas práticas e gostosas para acelerar a queima de gordura enquanto você descansa.</p>
                                    </div>
                                    <div style="display:flex; gap:10px; align-items:flex-start;">
                                        <span style="color:#22c55e; display:inline-block; flex-shrink:0; margin-top:2px; width:16px; height:16px;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </span>
                                        <p style="font-size:13px; margin:0;"><strong style="color:#1e293b;">Recuperação e Alívio Articular</strong>: exercícios suaves e sem impacto feitos para fortalecer suas articulações e eliminar dores enquanto você elimina peso.</p>
                                    </div>
                                    <div style="display:flex; gap:10px; align-items:flex-start;">
                                        <span style="color:#22c55e; display:inline-block; flex-shrink:0; margin-top:2px; width:16px; height:16px;">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </span>
                                        <p style="font-size:13px; margin:0;"><strong style="color:#1e293b;">Explosão de Vitalidade</strong>: técnicas de ativação que combatem o cansaço constante e devolvem sua disposição logo nos primeiros dias.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Pricing box -->
                            <div style="background:#fff; border-radius:16px; padding:25px; box-shadow:0 6px 18px rgba(0,0,0,0.06); border:2px solid #d64d7a; margin-bottom:20px; text-align:center;">
                                <div style="display:flex; align-items:center; justify-content:center; gap:8px; font-weight:600; color:#ea580c; font-size:12px; margin-bottom:15px;">
                                    <span style="display:inline-block; flex-shrink:0; width:14px; height:14px; color:#ea580c;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
                                    </span>
                                    <span>Restam apenas <span id="vagas-count-2">7</span> vagas com desconto especial</span>
                                </div>
                                <p style="font-size:16px; color:#666; text-decoration:line-through; margin-bottom:4px;">De R$ 297,00</p>
                                <p style="font-size:16px; color:#333; margin-bottom:8px;">por apenas</p>
                                <p style="font-size:3.5rem; font-weight:900; color:#d64d7a; font-family:'Anton', sans-serif; letter-spacing:1px; line-height:1; margin-bottom:10px;">R$ 37,90</p>
                                <p style="font-size:12px; font-weight:700; color:#d64d7a; background:rgba(214, 77, 122, 0.1); padding:4px 10px; border-radius:20px; width:fit-content; margin:0 auto 15px;">Desconto válido apenas hoje, ${currentDate}</p>
                                <p style="font-size:12px; color:#777; margin-bottom:0;">Pagamento único • Acesso completo ao programa</p>
                                <p style="font-size:11px; color:#aaa; margin-top:10px; display:flex; align-items:center; justify-content:center; gap:4px;">
                                    <span style="display:inline-block; width:12px; height:12px; color:#aaa;">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                    </span>
                                    <span>Compra 100% Segura • 30 Dias de Garantia Incondicional</span>
                                </p>
                            </div>

                            <!-- CTA 2 -->
                            <a href="${checkoutLink}" target="_blank" class="primary-btn" style="background:#22c55e; color:#fff; text-decoration:none; padding:18px 24px; font-weight:bold; font-size:16px; border-radius:12px; display:block; text-align:center; animation:pulse 2s infinite; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(34, 197, 94, 0.4); margin-bottom: 25px;">Obter meu plano personalizado agora</a>

                            <!-- Testimonials section -->
                            <div style="margin-bottom:25px;">
                                <h3 style="font-size:1.2rem; font-weight:800; color:#1e293b; margin-bottom:15px;">Resultados que nos deixam orgulhosos:</h3>
                                
                                <div style="display:flex; flex-direction:column; gap:16px;">
                                    <div style="background:#fff; border-radius:12px; border:1px solid #eee; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.03); text-align:left;">
                                        <img src="assets/resultado-transformacao.jpg" alt="Beatriz" style="width:100%; max-height:220px; object-fit:cover; object-position:center;" />
                                        <div style="padding:15px;">
                                            <p style="font-weight:700; color:#d64d7a; margin-bottom:5px; font-size:13px;">Beatriz: -3kg e Corpo Tonificado em 21 dias</p>
                                            <p style="font-size:12px; color:#555; line-height:1.5; margin:0;">"Eu não estava muito acima do peso, mas meu corpo não tinha forma nenhuma e eu me sentia 'mole'. Com a Calistenia Asiática, a ativação das fibras profundas esculpiu meu corpo. Em 21 dias, perdi 3kg de gordura e minha barriga ficou durinha. Meu corpo finalmente ganhou desenho e me sinto muito mais firme e segura."</p>
                                        </div>
                                    </div>
                                    <div style="background:#fff; border-radius:12px; border:1px solid #eee; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.03); text-align:left;">
                                        <img src="assets/depoimento-1.jpg" alt="Carla" style="width:100%; max-height:220px; object-fit:cover; object-position:center;" />
                                        <div style="padding:15px;">
                                            <p style="font-weight:700; color:#d64d7a; margin-bottom:5px; font-size:13px;">Carla: -13kg em 21 dias</p>
                                            <p style="font-size:12px; color:#555; line-height:1.5; margin:0;">"Eu estava perdida, sem energia e com muita vergonha do meu corpo. Achava que precisaria de horas na academia, mas a Calistenia Asiática mudou tudo. Redescobri minha força treinando no meu próprio quarto. Hoje me sinto empoderada, confiante e 13kg mais leve em apenas 3 semanas. Foi a melhor decisão que tomei!"</p>
                                        </div>
                                    </div>
                                    <div style="background:#fff; border-radius:12px; border:1px solid #eee; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.03); text-align:left;">
                                        <img src="assets/depoimento-2.jpg" alt="Fernanda" style="width:100%; max-height:220px; object-fit:cover; object-position:center;" />
                                        <div style="padding:15px;">
                                            <p style="font-weight:700; color:#d64d7a; margin-bottom:5px; font-size:13px;">Fernanda: -4kg em 14 dias</p>
                                            <p style="font-size:12px; color:#555; line-height:1.5; margin:0;">"Sempre fui desconfiada com promessas rápidas, mas as fotos não mentem. Em apenas duas semanas, a ativação das fibras profundas 'sugou' minha barriga para dentro de um jeito que abdominal nenhum fez. Perdi 4kg muito rápido e o inchaço sumiu. Se em 14 dias estou assim, imagina no final do protocolo!"</p>
                                        </div>
                                    </div>
                                    <div style="background:#fff; border-radius:12px; border:1px solid #eee; overflow:hidden; box-shadow:0 4px 8px rgba(0,0,0,0.03); text-align:left;">
                                        <img src="assets/depoimento-3.jpg" alt="Juliana" style="width:100%; max-height:220px; object-fit:cover; object-position:center;" />
                                        <div style="padding:15px;">
                                            <p style="font-weight:700; color:#d64d7a; margin-bottom:5px; font-size:13px;">Juliana: -8kg em 21 dias (Mãe de 2 filhos)</p>
                                            <p style="font-size:12px; color:#555; line-height:1.5; margin:0;">"Depois da gravidez, essa 'pochete' não saía por nada e minha postura estava horrível. Os movimentos suaves da Calistenia Asiática foram a minha salvação. Recuperei minha postura e eliminei 8kg incondicionalmente em 21 dias. Finalmente estou vendo minha barriga ficar retinha de novo, sem precisar de impacto."</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Bônus Exclusivos -->
                            <div style="background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border:1px solid #eee; margin-bottom:20px; text-align:left;">
                                <h3 style="font-size:1.2rem; font-weight:800; color:#d64d7a; text-align:center; margin-bottom:10px;">+ Bônus Exclusivos</h3>
                                <p style="font-size:12px; color:#777; text-align:center; margin-bottom:20px;">Além de você ter acesso às aulas e ao seu plano personalizado, separamos diversos bônus para te ajudar a acelerar seu emagrecimento rápido:</p>
                                <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
                                    <p style="margin:0;"><strong style="color:#d64d7a;">1. Chá Asiático Anticelulite</strong> - Misture uma planta pouco conhecida com água morna para assistir às celulites sumindo dia após dia.</p>
                                    <p style="margin:0;"><strong style="color:#d64d7a;">2. Dieta 100% Personalizada</strong> - Você terá acesso a diversas receitas para preparar e ver a gordura indo embora muito mais rápido.</p>
                                    <p style="margin:0;"><strong style="color:#d64d7a;">3. Cronograma de Alimentação Inteligente</strong> - O passo a passo completo para manter seu metabolismo acelerado e sua reeducação alimentar.</p>
                                    <p style="margin:0;"><strong style="color:#d64d7a;">4. Suporte 24h Todos os Dias</strong> - Nosso time estará pronto para te ajudar com qualquer dúvida, independente do horário.</p>
                                </div>
                            </div>

                            <!-- Guarantee box -->
                            <div style="background:#fff; border-radius:16px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05); border:1px solid #eee; margin-bottom:25px; text-align:center;">
                                <div style="width:48px; height:48px; margin:0 auto 12px; color:#166534; display:flex; align-items:center; justify-content:center;">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 11 2 2 4-4"/></svg>
                                </div>
                                <h3 style="font-size:1.1rem; font-weight:800; color:#1e293b; margin-bottom:10px;">30 Dias de Garantia Incondicional</h3>
                                <p style="font-size:12px; color:#666; line-height:1.5; margin-bottom:10px;">Nós confiamos tanto nos resultados do Protocolo de Calistenia Asiática que o risco é todo nosso.</p>
                                <p style="font-size:12px; color:#666; line-height:1.5; margin-bottom:10px;">Você tem 30 dias inteiros para testar o aplicativo e todos os bônus. Se por qualquer motivo você não estiver 100% satisfeita, nós devolveremos todo o seu investimento.</p>
                                <p style="font-size:12px; color:#1e293b; font-weight:700; margin:0;">Reembolso total e imediato, sem perguntas e sem complicações.</p>
                            </div>

                            <!-- FAQ Section -->
                            <div style="margin-bottom:25px; text-align:left;">
                                <h3 style="font-size:1.2rem; font-weight:800; color:#1e293b; margin-bottom:15px; text-align:center;">Perguntas frequentes</h3>
                                <div style="display:flex; flex-direction:column; gap:8px;">
                                    <div style="background:#fff; border-radius:10px; border:1px solid #eee; overflow:hidden;">
                                        <button onclick="toggleFaq('1')" style="width:100%; border:none; background:none; padding:15px; font-weight:700; color:#1e293b; font-size:13px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                                            <span>Quais exercícios a Calistenia inclui?</span>
                                            <span id="faq-icon-1" style="transition:transform 0.2s;">▾</span>
                                        </button>
                                        <div id="faq-1" style="display:none; padding:0 15px 15px; font-size:12px; color:#555; line-height:1.5; border-top:1px solid #f9f9f9;">
                                            Os exercícios de Calistenia se concentram em usar o peso do próprio corpo para ganhar força e flexibilidade, incluindo variações de agachamentos, pranchas, flexões adaptadas e movimentos de mobilidade.
                                        </div>
                                    </div>
                                    <div style="background:#fff; border-radius:10px; border:1px solid #eee; overflow:hidden;">
                                        <button onclick="toggleFaq('2')" style="width:100%; border:none; background:none; padding:15px; font-weight:700; color:#1e293b; font-size:13px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                                            <span>Como vou descobrir qual programa é ideal para mim?</span>
                                            <span id="faq-icon-2" style="transition:transform 0.2s;">▾</span>
                                        </button>
                                        <div id="faq-2" style="display:none; padding:0 15px 15px; font-size:12px; color:#555; line-height:1.5; border-top:1px solid #f9f9f9;">
                                            Nosso quiz personalizado analisa suas respostas e cria um programa sob medida para suas necessidades, considerando sua idade, objetivos e limitações físicas.
                                        </div>
                                    </div>
                                    <div style="background:#fff; border-radius:10px; border:1px solid #eee; overflow:hidden;">
                                        <button onclick="toggleFaq('3')" style="width:100%; border:none; background:none; padding:15px; font-weight:700; color:#1e293b; font-size:13px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;">
                                            <span>Como posso acessar meu plano?</span>
                                            <span id="faq-icon-3" style="transition:transform 0.2s;">▾</span>
                                        </button>
                                        <div id="faq-3" style="display:none; padding:0 15px 15px; font-size:12px; color:#555; line-height:1.5; border-top:1px solid #f9f9f9;">
                                            Após a compra, você receberá acesso imediato ao seu plano personalizado através do seu e-mail para baixar nossa plataforma web ou aplicativo.
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CTA 3 -->
                            <a href="${checkoutLink}" target="_blank" class="primary-btn" style="background:#22c55e; color:#fff; text-decoration:none; padding:18px 24px; font-weight:bold; font-size:16px; border-radius:12px; display:block; text-align:center; animation:pulse 2s infinite; text-transform:uppercase; letter-spacing:0.5px; box-shadow:0 4px 15px rgba(34, 197, 94, 0.4); margin-bottom: 20px;">Obter meu plano personalizado agora</a>

                            <div style="display:flex; justify-content:center; gap:15px; font-size:11px; color:#aaa; margin-top:20px;">
                                <a href="#" style="color:#aaa; text-decoration:underline;">Termos de Serviço</a>
                                <a href="#" style="color:#aaa; text-decoration:underline;">Política de Privacidade</a>
                            </div>
                        </div>
                    </div>`;
                
                // Handle delay logic & timers
                setTimeout(() => {
                    const delayedSection = document.getElementById('delayed-offer');
                    const stickyBanner = document.getElementById('sticky-countdown-banner');
                    if (!delayedSection) return;

                    const startOfferTimers = () => {
                        delayedSection.style.display = 'block';
                        if (stickyBanner) stickyBanner.style.display = 'block';

                        // 10 minute countdown timer (persistent)
                        let startTime = localStorage.getItem("offer_timer_start");
                        if (!startTime) {
                            startTime = Date.now().toString();
                            localStorage.setItem("offer_timer_start", startTime);
                        }
                        let elapsedSeconds = Math.floor((Date.now() - parseInt(startTime)) / 1000);
                        let totalSeconds = 600 - elapsedSeconds;
                        
                        if (totalSeconds <= 0) {
                            startTime = Date.now().toString();
                            localStorage.setItem("offer_timer_start", startTime);
                            totalSeconds = 600;
                        }

                        const timerElement = document.getElementById('countdown-timer');
                        const countdownInterval = setInterval(() => {
                            totalSeconds--;
                            if (totalSeconds <= 0) {
                                clearInterval(countdownInterval);
                                if (timerElement) timerElement.innerText = "00:00";
                                localStorage.removeItem("offer_timer_start");
                            } else {
                                const minutes = Math.floor(totalSeconds / 60);
                                const seconds = totalSeconds % 60;
                                if (timerElement) {
                                    timerElement.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
                                }
                            }
                        }, 1000);

                        // Scarcity vacancies countdown
                        let vacancies = 7;
                        const vCount1 = document.getElementById('vagas-count');
                        const vCount2 = document.getElementById('vagas-count-2');
                        const vacanciesInterval = setInterval(() => {
                            if (vacancies > 1) {
                                vacancies--;
                                if (vCount1) vCount1.innerText = vacancies;
                                if (vCount2) vCount2.innerText = vacancies;
                            } else {
                                clearInterval(vacanciesInterval);
                            }
                        }, 45000); // decrease every 45s
                    };

                    if (localStorage.getItem("offer_revealed") === "true") {
                        startOfferTimers();
                    } else {
                        // 4 minutes = 240000ms
                        offerTimer = setTimeout(() => {
                            startOfferTimers();
                            localStorage.setItem("offer_revealed", "true");
                        }, 240000);
                    }
                }, 100);
                break;
        }

        container.innerHTML = html;
        container.style.opacity = 1;

        // Custom JS bindings after render
        if (stepNumber === 20) {
            runLoader();
        }

    }, 300);
}

function toggleMulti(field, value, btnElement) {
    if (!quizState.answers[field]) quizState.answers[field] = [];
    
    // Clear "none" variants if selecting a normal option
    if (value !== 'Nenhum deles' && value !== 'Nenhuma das opções acima' && value !== 'Nenhuma das acima') {
        quizState.answers[field] = quizState.answers[field].filter(v => 
            v !== 'Nenhum deles' && v !== 'Nenhuma das opções acima' && v !== 'Nenhuma das acima'
        );
        
        const idx = quizState.answers[field].indexOf(value);
        if (idx > -1) {
            quizState.answers[field].splice(idx, 1);
            btnElement.classList.remove('selected');
        } else {
            quizState.answers[field].push(value);
            btnElement.classList.add('selected');
        }
        
        // Remove selection from none buttons in UI
        const parent = btnElement.parentElement;
        const btns = parent.querySelectorAll('.option-btn');
        btns.forEach(b => {
            if (b.innerText === 'Nenhum deles' || b.innerText === 'Nenhuma das opções acima' || b.innerText === 'Nenhuma das acima') {
                b.classList.remove('selected');
            }
        });
    } else {
        // Selected "None", clear others
        quizState.answers[field] = [value];
        const parent = btnElement.parentElement;
        const btns = parent.querySelectorAll('.option-btn');
        btns.forEach(b => b.classList.remove('selected'));
        btnElement.classList.add('selected');
    }
}

function toggleMultiAll(field, btnElement) {
    const parent = btnElement.parentElement;
    const btns = parent.querySelectorAll('.option-btn:not(:first-child)');
    
    const allSelected = Array.from(btns).every(b => b.classList.contains('selected'));
    
    if (allSelected) {
        btns.forEach(b => {
            b.classList.remove('selected');
            const val = b.innerText;
            const idx = quizState.answers[field].indexOf(val);
            if (idx > -1) quizState.answers[field].splice(idx, 1);
        });
    } else {
        btns.forEach(b => {
            if (!b.classList.contains('selected')) {
                b.classList.add('selected');
                quizState.answers[field].push(b.innerText);
            }
        });
    }
}

function toggleUnit(field, unit) {
    quizState.answers[field + 'Unit'] = unit;
    renderStep(quizState.currentStep);
}

function updateSlider(field, value) {
    quizState.answers[field] = value;
    document.getElementById(field + '-val').innerText = value;
}

function runLoader() {
    const inner = document.getElementById('inner-loader');
    const msg = document.getElementById('loader-msg');
    const messages = ["Analisando suas respostas...", "Ajustando níveis de metabolismo...", "Calculando projeções de resultados...", "Seu plano está pronto!"];
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += 2;
        if (progress <= 100) {
            inner.style.width = progress + '%';
            
            if (progress === 30) msg.innerText = messages[1];
            if (progress === 60) msg.innerText = messages[2];
            if (progress === 90) msg.innerText = messages[3];
        } else {
            clearInterval(interval);
            setTimeout(() => {
                nextStep();
            }, 500);
        }
    }, 120); // 120 * 50 = 6000ms (6 seconds)
}

document.addEventListener('DOMContentLoaded', () => {
    saveUTM();
    updateURLHash(quizState.currentStep);
    renderStep(quizState.currentStep);
});
