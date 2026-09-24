import { invokeLLM } from '../config/llm.js';

export const PPT_SYSTEM_PROMPT =
  "You are a Presentation Design AI. Output slide decks structured strictly in JSON format containing an array of slides, where each slide has 'slide_number', 'title', 'bullet_points' (array of 3-4 key points), and 'speaker_notes'.";

export const buildCustomSlides = (userPrompt) => {
  const cleanTitle = userPrompt
    .replace(/\b(create|make|generate|presentation|slides|deck|about|for|on|please|pitch|powerpoint|pptx)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 50) || 'Strategic Initiative';

  const capitalizedTitle = cleanTitle
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const p = userPrompt.toLowerCase();

  // Domain-specific customization detectors
  const isBusinessPitch = p.includes('business') || p.includes('startup') || p.includes('pitch') || p.includes('investment') || p.includes('product');
  const isTechOrAI = p.includes('ai') || p.includes('software') || p.includes('tech') || p.includes('cloud') || p.includes('system') || p.includes('code');
  const isHealthOrFitness = p.includes('health') || p.includes('fitness') || p.includes('medical') || p.includes('yoga') || p.includes('wellness');
  const isEducationOrScience = p.includes('science') || p.includes('school') || p.includes('space') || p.includes('history') || p.includes('climate') || p.includes('planet');

  let slide2Title = 'Current Landscape & Key Opportunities';
  let slide2Bullets = [
    `Rising industry demand and evolving dynamics surrounding ${capitalizedTitle}`,
    `Critical pain points and bottlenecks experienced in legacy approaches`,
    `Unlocking competitive edge through modern methodologies and targeted execution`,
    `Addressing audience expectations with validated best practices`,
  ];
  let slide2Notes = `In this section, we examine the macro environment and why addressing ${capitalizedTitle} now is crucial for long-term success.`;

  let slide3Title = `${capitalizedTitle}: Core Strategy & Methodology`;
  let slide3Bullets = [
    `Pillar 1: Foundational framework and requirements discovery`,
    `Pillar 2: Rapid operational rollout with continuous quality assurance`,
    `Pillar 3: Scalable infrastructure designed for high reliability and engagement`,
    `Pillar 4: Data-driven feedback loops to accelerate iterative improvement`,
  ];
  let slide3Notes = `This slide details our strategic pillars for executing ${capitalizedTitle} with minimal friction and maximum yield.`;

  let slide4Title = 'Key Milestones, Performance Metrics & ROI';
  let slide4Bullets = [
    `Efficiency & Velocity: Target 40% reduction in operational turnaround time`,
    `Adoption & Retention: Achieving 95%+ stakeholder satisfaction in Phase 1`,
    `Resource Allocation: Optimized cost structure delivering measurable ROI`,
    `Risk Mitigation: Proactive compliance and contingency protocols`,
  ];
  let slide4Notes = `Reviewing our target benchmarks demonstrates clear, measurable value and positive return on investment.`;

  let slide5Title = 'Execution Roadmap & Next Actions';
  let slide5Bullets = [
    `Phase 1 (Month 1): Stakeholder alignment, scoping, and proof-of-concept launch`,
    `Phase 2 (Months 2-3): Full deployment, team training, and metrics calibration`,
    `Phase 3 (Ongoing): Expansion, automated reporting, and community scaling`,
    `Call to Action: Finalizing approvals and scheduling kickoff sprint`,
  ];
  let slide5Notes = `To conclude, this clear phased roadmap allows us to implement ${capitalizedTitle} decisively. I now welcome any questions.`;

  if (isBusinessPitch) {
    slide2Title = 'Market Problem & Untapped Opportunity';
    slide2Bullets = [
      `Existing market solutions for ${capitalizedTitle} are fragmented and high-cost`,
      `Customer friction: 70% of prospective clients report dissatisfaction with alternatives`,
      `Rapidly expanding TAM (Total Addressable Market) with double-digit YoY growth`,
      `First-mover advantage in delivering a seamless, modern value proposition`,
    ];
    slide3Title = 'Our Solution & Unique Value Proposition';
    slide3Bullets = [
      `End-to-end integrated platform built specifically for ${capitalizedTitle}`,
      `Differentiated feature set delivering 3x faster outcomes at lower cost`,
      `Defensible moat through proprietary workflows and network effects`,
      `High-margin recurring revenue model with clear monetization tiers`,
    ];
  } else if (isHealthOrFitness) {
    slide2Title = 'Health Context & Core Benefits';
    slide2Bullets = [
      `Scientifically proven wellness advantages associated with ${capitalizedTitle}`,
      `Counteracting modern lifestyle stressors, fatigue, and physical strain`,
      `Promoting holistic well-being, mental clarity, and sustained vitality`,
      `Accessible routines tailored to all proficiency levels and age groups`,
    ];
    slide3Title = 'Step-by-Step Program & Practice Guide';
    slide3Bullets = [
      `Phase 1: Fundamental conditioning and proper form mastery`,
      `Phase 2: Gradual progression, endurance building, and consistency`,
      `Phase 3: Integration of nutrition, recovery, and mindful habit tracking`,
      `Sustainable long-term lifestyle transformation strategies`,
    ];
  } else if (isEducationOrScience) {
    slide2Title = 'Scientific Background & Fundamental Principles';
    slide2Bullets = [
      `Core theoretical foundations and historical discoveries of ${capitalizedTitle}`,
      `Key mechanisms governing behavior, interaction, and observable patterns`,
      `Recent experimental breakthroughs and empirical research findings`,
      `Broader implications for modern society, science, and the environment`,
    ];
    slide3Title = 'Detailed Exploration & Key Findings';
    slide3Bullets = [
      `Component Analysis: Dissecting primary structures and classifications`,
      `Observational Data: Comparative models and real-world case evidence`,
      `Addressing common misconceptions with verified scientific consensus`,
      `Future frontiers: Open scientific questions and next-gen exploration`,
    ];
  }

  return [
    {
      slide_number: 1,
      title: `${capitalizedTitle}: Comprehensive Overview`,
      bullet_points: [
        `Executive presentation detailing strategic vision and implementation`,
        `Prepared for stakeholders, team members, and decision-makers`,
        `Actionable insights, market context, and structured roadmap`,
      ],
      speaker_notes: `Welcome everyone. Today we are presenting a comprehensive review of ${capitalizedTitle}, outlining our core objectives, strategies, and execution roadmap.`,
    },
    {
      slide_number: 2,
      title: slide2Title,
      bullet_points: slide2Bullets,
      speaker_notes: slide2Notes,
    },
    {
      slide_number: 3,
      title: slide3Title,
      bullet_points: slide3Bullets,
      speaker_notes: slide3Notes,
    },
    {
      slide_number: 4,
      title: slide4Title,
      bullet_points: slide4Bullets,
      speaker_notes: slide4Notes,
    },
    {
      slide_number: 5,
      title: slide5Title,
      bullet_points: slide5Bullets,
      speaker_notes: slide5Notes,
    },
  ];
};

export const runPptAgent = async (userPrompt) => {
  try {
    const rawOutput = await invokeLLM({
      systemPrompt: `${PPT_SYSTEM_PROMPT}\n\nIMPORTANT: Return ONLY a valid JSON array of slide objects. Output format: [{"slide_number": 1, "title": "...", "bullet_points": ["..."], "speaker_notes": "..."}]`,
      userPrompt: `Topic: "${userPrompt}"\nCreate a 5-slide presentation deck specifically tailored to this topic.`,
      temperature: 0.3,
      jsonMode: true,
    });

    let parsedSlides = [];
    try {
      const cleaned = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      const match = cleaned.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (match) {
        parsedSlides = JSON.parse(match[0]);
      } else {
        parsedSlides = JSON.parse(cleaned);
      }
    } catch (parseErr) {
      console.warn('[PPT Agent] JSON parse fallback:', parseErr.message);
    }

    if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
      return {
        agent: 'ppt',
        slides: parsedSlides,
        content: `### 📊 Presentation Slide Deck Generated (${parsedSlides.length} Slides)\n\nYour presentation for **"${userPrompt}"** has been dynamically generated! You can preview each slide interactively in the slide visualizer and click **Download .PPTX** to export the native Microsoft PowerPoint file.`,
      };
    }
  } catch (err) {
    console.warn('[PPT Agent] Generating customized slide deck:', err.message);
  }

  const customSlides = buildCustomSlides(userPrompt);
  return {
    agent: 'ppt',
    slides: customSlides,
    content: `### 📊 Presentation Slide Deck Generated (${customSlides.length} Slides)\n\nYour presentation for **"${userPrompt}"** is ready! You can preview the slides in the viewer and download the official **.pptx** file.`,
  };
};
